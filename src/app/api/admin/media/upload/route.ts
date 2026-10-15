import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
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

// 最大文件大小 (10MB for admin uploads)
const MAX_FILE_SIZE = 10 * 1024 * 1024

export async function POST(request: NextRequest) {
  try {
    // 验证管理员权限
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const uploadType = (formData.get('uploadType') as string) || 'product'

    if (!file) {
      return NextResponse.json({ error: '没有文件' }, { status: 400 })
    }

    // 验证文件类型
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
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
    const filename = `${uploadType}_${timestamp}_${randomString}.${extension}`

    // 创建上传目录
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'admin')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // 保存文件
    try {
      const bytes = await file.arrayBuffer()
      let buffer = Buffer.from(bytes)

      // 检查是否需要添加水印
      if (shouldAddWatermark(uploadType)) {
        console.log(`为 ${uploadType} 类型的图片添加水印`)
        try {
          buffer = (await addWatermark(buffer as any)) as any
        } catch (watermarkError) {
          console.warn('水印添加失败，使用原图:', watermarkError)
          // 继续使用原图，不中断上传流程
        }
      }

      const filepath = join(uploadDir, filename)
      await writeFile(filepath, buffer)

      // 返回文件URL
      const url = `/uploads/admin/${filename}`
      return NextResponse.json({
        url,
        filename: originalName,
        size: buffer.length,
        type: file.type,
        uploadedBy: session.user.id,
        uploadedAt: new Date().toISOString(),
      })
    } catch (writeError) {
      console.error('文件写入失败:', writeError)
      return NextResponse.json(
        {
          error: '文件保存失败，请检查服务器存储空间',
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('上传错误:', error)

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
