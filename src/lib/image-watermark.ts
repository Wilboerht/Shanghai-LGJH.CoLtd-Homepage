import sharp from 'sharp'

/**
 * 为图片添加水印
 * @param imageBuffer 原始图片buffer
 * @param watermarkText 水印文字
 * @returns 处理后的图片buffer
 */
export async function addWatermark(
  imageBuffer: Buffer,
  watermarkText: string = '仅供网页展示，不做任何经营用途'
): Promise<Buffer> {
  try {
    // 获取原图信息
    const image = sharp(imageBuffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      throw new Error('无法获取图片尺寸')
    }

    // 计算水印大小和位置
    const width = metadata.width
    const height = metadata.height
    const fontSize = Math.max(Math.min(width / 20, 24), 12) // 根据图片宽度调整字体大小
    const padding = Math.max(width / 40, 10) // 边距

    // 创建水印SVG
    const watermarkSvg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <style>
            .watermark-text {
              font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
              font-size: ${fontSize}px;
              fill: rgba(128, 128, 128, 0.6);
              text-anchor: end;
            }
          </style>
        </defs>
        <!-- 右下角水印 -->
        <text x="${width - padding}" y="${height - padding}" class="watermark-text">
          ${watermarkText}
        </text>
        <!-- 中心半透明水印 -->
        <text x="${width / 2}" y="${height / 2}" 
              class="watermark-text" 
              text-anchor="middle" 
              style="font-size: ${fontSize * 1.5}px; fill: rgba(128, 128, 128, 0.3); transform: rotate(-45deg); transform-origin: ${width / 2}px ${height / 2}px;">
          ${watermarkText}
        </text>
      </svg>
    `

    // 将水印应用到图片上
    const watermarkedImage = await image
      .composite([
        {
          input: Buffer.from(watermarkSvg),
          top: 0,
          left: 0,
        },
      ])
      .jpeg({ quality: 90 }) // 保持较高质量
      .toBuffer()

    return watermarkedImage
  } catch (error) {
    console.error('添加水印失败:', error)
    // 如果水印添加失败，返回原图
    return imageBuffer
  }
}

/**
 * 检查是否需要添加水印
 * @param uploadPath 上传路径或用途
 * @returns 是否需要添加水印
 */
export function shouldAddWatermark(uploadPath?: string): boolean {
  if (!uploadPath) return false

  // 企业资质和荣誉奖项需要添加水印
  const watermarkPaths = ['qualifications', 'awards', 'certificates']

  return watermarkPaths.some(path => uploadPath.includes(path))
}
