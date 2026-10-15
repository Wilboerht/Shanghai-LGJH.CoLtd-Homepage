import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { addWatermark, shouldAddWatermark } from '@/lib/image-watermark'

// 支持的图片类型
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/gif',
  'image/webp',
  'image/avif',
]

// 最大文件大小 (20MB)
const MAX_FILE_SIZE = 20 * 1024 * 1024

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const requestId = Math.random().toString(36).substring(2, 15)

  console.log(`[${requestId}] 开始处理文件上传请求`)

  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const uploadType = formData.get('uploadType') as string // 获取上传类型

    console.log(`[${requestId}] 接收到文件:`, {
      name: file?.name,
      size: file?.size,
      type: file?.type,
      uploadType,
    })

    if (!file) {
      console.log(`[${requestId}] 错误: 没有文件`)
      return NextResponse.json({ error: '没有文件' }, { status: 400 })
    }

    // 验证文件类型
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      console.log(`[${requestId}] 错误: 不支持的文件类型 ${file.type}`)
      return NextResponse.json(
        {
          error: `不支持的文件类型: ${file.type}。支持的格式：JPG, PNG, GIF, WebP, AVIF`,
        },
        { status: 400 }
      )
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      const sizeMB = Math.round(MAX_FILE_SIZE / (1024 * 1024))
      console.log(
        `[${requestId}] 错误: 文件大小超过限制 ${file.size} bytes > ${MAX_FILE_SIZE} bytes`
      )
      return NextResponse.json(
        {
          error: `文件大小超过限制，最大支持 ${sizeMB}MB`,
        },
        { status: 400 }
      )
    }

    // 安全地获取文件扩展名
    const originalName = file.name || 'unknown'
    const lastDotIndex = originalName.lastIndexOf('.')
    const extension = lastDotIndex > 0 ? originalName.substring(lastDotIndex + 1) : 'jpg'

    // 生成文件名
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 8)
    const filename = `${timestamp}-${randomString}.${extension}`

    console.log(`[${requestId}] 生成文件名: ${filename}`)

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      console.log(`[${requestId}] 创建上传目录: ${uploadDir}`)
      await mkdir(uploadDir, { recursive: true })
    }

    // 保存文件
    try {
      const bytes = await file.arrayBuffer()
      let buffer = Buffer.from(bytes)

      // 检查是否需要添加水印
      if (shouldAddWatermark(uploadType)) {
        console.log(`[${requestId}] 为 ${uploadType} 类型的图片添加水印`)
        try {
          buffer = (await addWatermark(buffer as any)) as any
          console.log(`[${requestId}] 水印添加成功`)
        } catch (watermarkError) {
          console.warn(`[${requestId}] 水印添加失败，使用原图:`, watermarkError)
          // 继续使用原图，不中断上传流程
        }
      }

      const filepath = join(uploadDir, filename)
      console.log(`[${requestId}] 保存文件到: ${filepath}`)
      await writeFile(filepath, buffer)

      const processingTime = Date.now() - startTime
      console.log(`[${requestId}] 文件上传成功，耗时: ${processingTime}ms`)

      // 返回文件URL
      const url = `/uploads/${filename}`
      return NextResponse.json({
        url,
        filename: originalName,
        size: buffer.length, // 使用处理后的文件大小
        type: file.type,
        processingTime,
      })
    } catch (writeError) {
      console.error(`[${requestId}] 文件写入失败:`, writeError)
      return NextResponse.json(
        {
          error: '文件保存失败，请检查服务器存储空间',
          details: process.env.NODE_ENV === 'development' ? writeError.message : undefined,
        },
        { status: 500 }
      )
    }
  } catch (error) {
    const processingTime = Date.now() - startTime
    console.error(`[${requestId}] 上传错误 (耗时: ${processingTime}ms):`, error)

    // 根据错误类型返回更具体的错误信息
    if (error instanceof Error) {
      if (error.message.includes('PayloadTooLargeError')) {
        return NextResponse.json(
          {
            error: '文件过大，请选择较小的文件',
          },
          { status: 413 }
        )
      }
      if (error.message.includes('ENOSPC')) {
        return NextResponse.json(
          {
            error: '服务器存储空间不足',
          },
          { status: 507 }
        )
      }
    }

    return NextResponse.json(
      {
        error: '上传失败，请重试',
      },
      { status: 500 }
    )
  }
}
