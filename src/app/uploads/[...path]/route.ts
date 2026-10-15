import { NextRequest, NextResponse } from 'next/server'
import { readFile, stat } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

// 支持的图片类型和对应的MIME类型
const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
}

// 获取文件扩展名对应的MIME类型
function getMimeType(filename: string): string {
  const ext = filename.toLowerCase().substring(filename.lastIndexOf('.'))
  return MIME_TYPES[ext] || 'application/octet-stream'
}

// 处理静态文件请求
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params
    const { path } = resolvedParams

    // 构建文件路径
    const filePath = join(process.cwd(), 'public', 'uploads', ...path)

    console.log('请求文件路径:', filePath)

    // 安全检查：确保文件路径在uploads目录内
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    const normalizedFilePath = filePath.replace(/\\/g, '/')
    const normalizedUploadsDir = uploadsDir.replace(/\\/g, '/')

    if (!normalizedFilePath.startsWith(normalizedUploadsDir)) {
      console.log('安全检查失败: 文件路径不在uploads目录内', {
        filePath: normalizedFilePath,
        uploadsDir: normalizedUploadsDir,
      })
      return NextResponse.json({ error: '访问被拒绝' }, { status: 403 })
    }

    // 检查文件是否存在
    if (!existsSync(filePath)) {
      console.log('文件不存在:', filePath)
      return NextResponse.json({ error: '文件不存在' }, { status: 404 })
    }

    // 获取文件信息
    const stats = await stat(filePath)
    if (!stats.isFile()) {
      console.log('不是文件:', filePath)
      return NextResponse.json({ error: '不是有效文件' }, { status: 404 })
    }

    // 读取文件内容
    const fileBuffer = await readFile(filePath)
    const filename = path[path.length - 1]
    const mimeType = getMimeType(filename)

    console.log('成功读取文件:', filename, 'MIME类型:', mimeType, '大小:', fileBuffer.length)

    // 返回文件内容
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': fileBuffer.length.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable', // 缓存1年
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('读取文件失败:', error)
    return NextResponse.json({ error: '读取文件失败' }, { status: 500 })
  }
}

// 处理HEAD请求（用于检查文件是否存在）
export async function HEAD(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const resolvedParams = await params
    const { path } = resolvedParams

    // 构建文件路径
    const filePath = join(process.cwd(), 'public', 'uploads', ...path)

    // 安全检查
    const uploadsDir = join(process.cwd(), 'public', 'uploads')
    if (!filePath.startsWith(uploadsDir)) {
      return new NextResponse(null, { status: 403 })
    }

    // 检查文件是否存在
    if (!existsSync(filePath)) {
      return new NextResponse(null, { status: 404 })
    }

    // 获取文件信息
    const stats = await stat(filePath)
    if (!stats.isFile()) {
      return new NextResponse(null, { status: 404 })
    }

    const filename = path[path.length - 1]
    const mimeType = getMimeType(filename)

    // 返回文件头信息
    return new NextResponse(null, {
      status: 200,
      headers: {
        'Content-Type': mimeType,
        'Content-Length': stats.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    })
  } catch (error) {
    console.error('获取文件信息失败:', error)
    return new NextResponse(null, { status: 500 })
  }
}
