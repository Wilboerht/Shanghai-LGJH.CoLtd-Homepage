'use client'

import * as React from 'react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ImageUpload } from '@/components/ui/image-upload'
import { FontSelector } from '@/components/ui/font-selector'
import { GradientPicker } from '@/components/ui/gradient-picker'
import { toast } from 'sonner'
import { Play, Save, RotateCcw, Eye, Type, Palette, ArrowLeft } from 'lucide-react'

interface HeroConfig {
  // 视频配置
  videoUrl: string
  videoFallbackUrl?: string

  // 文本内容
  title: string
  subtitle: string

  // 主标题样式
  titleStyle: {
    fontSize: number // px
    fontWeight: number
    fontFamily: string
    color: string
    letterSpacing: number // px
    lineHeight: number // 倍数
    textShadow: boolean
    gradient: {
      enabled: boolean
      colors: string[]
      direction: string
    }
  }

  // 副标题样式
  subtitleStyle: {
    fontSize: number // px
    fontWeight: number
    fontFamily: string
    color: string
    letterSpacing: number // px
    lineHeight: number // 倍数
    textShadow: boolean
    opacity: number // 0-100
  }

  // 视觉配置
  overlayOpacity: number

  // 其他设置
  autoplay: boolean
  muted: boolean
  loop: boolean
}

// 可用字体选项
const fontOptions = [
  { value: 'font-dingtalk-jinbu', label: 'DingTalk 进步体', family: 'DingTalk-JinBu' },
  { value: 'font-dingtalk-sans', label: 'DingTalk Sans', family: 'DingTalk-Sans' },
  { value: 'font-ali-dongfang', label: '阿里妈妈东方大楷', family: 'AliDongfang' },
  { value: 'font-alimama-agile', label: '阿里妈妈灵动体', family: 'AlimamaAgile' },
  { value: 'font-alimama-daoli', label: '阿里妈妈刀隶体', family: 'AlimamaDaoli' },
  { value: 'font-alimama-fangyuan', label: '阿里妈妈方圆体', family: 'AlimamaFangyuan' },
  { value: 'font-alimama-shuhei', label: '阿里妈妈数黑体', family: 'AlimamaShuHeiTi' },
  { value: 'font-noto-serif-sc', label: 'Noto Serif SC (思源宋体)', family: 'Noto Serif SC' },
  { value: 'font-sans', label: '系统默认字体', family: 'system-ui' },
  { value: 'font-poppins', label: 'Poppins (英文)', family: 'Poppins' },
]

const defaultConfig: HeroConfig = {
  videoUrl: '/videos/Home.mp4',
  videoFallbackUrl: '',
  title: '专业安防解决方案 值得信赖的选择',
  subtitle:
    '临港景鸿是智能安防系统、视频监控、门禁控制和全面安防解决方案的领先提供商，为住宅、商业和工业客户提供专业服务。',
  titleStyle: {
    fontSize: 64,
    fontWeight: 700,
    fontFamily: 'font-dingtalk-jinbu',
    color: '#ffffff',
    letterSpacing: 0,
    lineHeight: 1.2,
    textShadow: true,
    gradient: {
      enabled: false,
      colors: ['#ffffff', '#e0e7ff'],
      direction: 'to right',
    },
  },
  subtitleStyle: {
    fontSize: 24,
    fontWeight: 400,
    fontFamily: 'font-sans',
    color: '#ffffff',
    letterSpacing: 0,
    lineHeight: 1.5,
    textShadow: true,
    opacity: 90,
  },
  overlayOpacity: 30,
  autoplay: true,
  muted: true,
  loop: true,
}

export default function HeroManagement() {
  const router = useRouter()
  const [config, setConfig] = useState<HeroConfig>(defaultConfig)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [previewMode, setPreviewMode] = useState(false)

  // 获取当前配置
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/admin/content/homepage/hero')
        if (response.ok) {
          const data = await response.json()
          setConfig({ ...defaultConfig, ...data.config })
        }
      } catch (error) {
        console.error('获取Hero配置失败:', error)
        toast.error('获取配置失败')
      } finally {
        setLoading(false)
      }
    }

    fetchConfig()
  }, [])

  // 保存配置
  const handleSave = async () => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/content/homepage/hero', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ config }),
      })

      if (response.ok) {
        toast.success('Hero配置保存成功')
      } else {
        throw new Error('保存失败')
      }
    } catch (error) {
      console.error('保存Hero配置失败:', error)
      toast.error('保存配置失败')
    } finally {
      setSaving(false)
    }
  }

  // 重置配置
  const handleReset = () => {
    setConfig(defaultConfig)
    toast.info('配置已重置为默认值')
  }

  // 预览模式切换
  const togglePreview = () => {
    setPreviewMode(!previewMode)
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex min-h-[400px] items-center justify-center'>
          <div className='text-center'>
            <div className='mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <p className='text-gray-600'>加载配置中...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div className='flex items-center gap-4'>
            <Button variant='outline' size='sm' onClick={() => router.back()}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              返回
            </Button>
            <div>
              <h1 className='text-2xl font-bold text-gray-900'>首页Hero区域管理</h1>
              <p className='mt-1 text-gray-600'>管理首页Hero区域的视频背景和文本内容</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Button variant='outline' onClick={togglePreview} className='flex items-center gap-2'>
              <Eye className='h-4 w-4' />
              {previewMode ? '编辑模式' : '预览模式'}
            </Button>
            <Button variant='outline' onClick={handleReset} className='flex items-center gap-2'>
              <RotateCcw className='h-4 w-4' />
              重置
            </Button>
            <Button onClick={handleSave} disabled={saving} className='flex items-center gap-2'>
              <Save className='h-4 w-4' />
              {saving ? '保存中...' : '保存配置'}
            </Button>
          </div>
        </div>

        {previewMode ? (
          /* 预览模式 */
          <Card>
            <CardHeader>
              <CardTitle>Hero区域预览</CardTitle>
              <CardDescription>预览当前配置的Hero区域效果</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='relative aspect-video overflow-hidden rounded-lg bg-gray-900'>
                {config.videoUrl && (
                  <video
                    src={config.videoUrl}
                    autoPlay={config.autoplay}
                    muted={config.muted}
                    loop={config.loop}
                    className='h-full w-full object-cover'
                    playsInline
                  />
                )}

                {/* 遮罩层 */}
                <div
                  className='absolute inset-0 bg-black'
                  style={{ opacity: config.overlayOpacity / 100 }}
                />

                {/* 文本内容 */}
                <div className='absolute inset-0 flex items-center justify-center'>
                  <div className='max-w-4xl px-6 text-center'>
                    <h1
                      className={`mb-6 ${config.titleStyle.fontFamily} ${config.titleStyle.textShadow ? 'drop-shadow-lg' : ''} ${config.titleStyle.gradient.enabled ? 'bg-gradient-to-r bg-clip-text text-transparent' : ''}`}
                      style={{
                        fontSize: `${config.titleStyle.fontSize}px`,
                        fontWeight: config.titleStyle.fontWeight,
                        color: config.titleStyle.gradient.enabled
                          ? 'transparent'
                          : config.titleStyle.color,
                        letterSpacing: `${config.titleStyle.letterSpacing}px`,
                        lineHeight: config.titleStyle.lineHeight,
                        backgroundImage: config.titleStyle.gradient.enabled
                          ? `linear-gradient(${config.titleStyle.gradient.direction}, ${config.titleStyle.gradient.colors.join(', ')})`
                          : undefined,
                      }}
                    >
                      {config.title}
                    </h1>
                    <p
                      className={`${config.subtitleStyle.fontFamily} ${config.subtitleStyle.textShadow ? 'drop-shadow-md' : ''}`}
                      style={{
                        fontSize: `${config.subtitleStyle.fontSize}px`,
                        fontWeight: config.subtitleStyle.fontWeight,
                        color: config.subtitleStyle.color,
                        letterSpacing: `${config.subtitleStyle.letterSpacing}px`,
                        lineHeight: config.subtitleStyle.lineHeight,
                        opacity: config.subtitleStyle.opacity / 100,
                      }}
                    >
                      {config.subtitle}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          /* 编辑模式 */
          <div className='grid grid-cols-1 gap-6 lg:grid-cols-2'>
            {/* 视频配置 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Play className='h-5 w-5' />
                  视频配置
                </CardTitle>
                <CardDescription>配置Hero区域的背景视频</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <ImageUpload
                  value={config.videoUrl}
                  onChange={url => setConfig({ ...config, videoUrl: url })}
                  label='主视频文件'
                  placeholder='输入视频URL或上传视频文件'
                  helpText='建议使用MP4格式，文件大小不超过50MB，分辨率1920x1080'
                  accept='video/*'
                  maxSize={50}
                />

                <ImageUpload
                  value={config.videoFallbackUrl || ''}
                  onChange={url => setConfig({ ...config, videoFallbackUrl: url })}
                  label='备用视频文件（可选）'
                  placeholder='输入备用视频URL或上传备用视频文件'
                  helpText='当主视频加载失败时使用的备用视频'
                  accept='video/*'
                  maxSize={50}
                />

                <Separator />

                <div className='grid grid-cols-3 gap-4'>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='autoplay'
                      checked={config.autoplay}
                      onChange={e => setConfig({ ...config, autoplay: e.target.checked })}
                      className='rounded'
                    />
                    <Label htmlFor='autoplay'>自动播放</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='muted'
                      checked={config.muted}
                      onChange={e => setConfig({ ...config, muted: e.target.checked })}
                      className='rounded'
                    />
                    <Label htmlFor='muted'>静音</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='loop'
                      checked={config.loop}
                      onChange={e => setConfig({ ...config, loop: e.target.checked })}
                      className='rounded'
                    />
                    <Label htmlFor='loop'>循环播放</Label>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 文本内容配置 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Type className='h-5 w-5' />
                  文本内容
                </CardTitle>
                <CardDescription>配置Hero区域显示的文本内容</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='title'>主标题</Label>
                  <Input
                    id='title'
                    value={config.title}
                    onChange={e => setConfig({ ...config, title: e.target.value })}
                    placeholder='输入主标题'
                  />
                </div>

                <div>
                  <Label htmlFor='subtitle'>副标题</Label>
                  <Textarea
                    id='subtitle'
                    value={config.subtitle}
                    onChange={e => setConfig({ ...config, subtitle: e.target.value })}
                    placeholder='输入副标题'
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* 主标题样式配置 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Palette className='h-5 w-5' />
                  主标题样式
                </CardTitle>
                <CardDescription>配置主标题的字体、大小、颜色等样式</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FontSelector
                  value={config.titleStyle.fontFamily}
                  onChange={value =>
                    setConfig({
                      ...config,
                      titleStyle: { ...config.titleStyle, fontFamily: value },
                    })
                  }
                  label='字体'
                  options={fontOptions}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='titleFontSize'>字体大小 ({config.titleStyle.fontSize}px)</Label>
                    <input
                      type='range'
                      id='titleFontSize'
                      min='24'
                      max='120'
                      value={config.titleStyle.fontSize}
                      onChange={e =>
                        setConfig({
                          ...config,
                          titleStyle: { ...config.titleStyle, fontSize: parseInt(e.target.value) },
                        })
                      }
                      className='mt-2 w-full'
                      aria-label={`主标题字体大小: ${config.titleStyle.fontSize}px`}
                      title={`主标题字体大小: ${config.titleStyle.fontSize}px`}
                    />
                  </div>

                  <div>
                    <Label htmlFor='titleFontWeight'>
                      字体粗细 ({config.titleStyle.fontWeight})
                    </Label>
                    <select
                      id='titleFontWeight'
                      value={config.titleStyle.fontWeight}
                      onChange={e =>
                        setConfig({
                          ...config,
                          titleStyle: {
                            ...config.titleStyle,
                            fontWeight: parseInt(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full rounded-md border border-gray-300 px-3 py-2'
                    >
                      <option value={100}>100 - 极细</option>
                      <option value={200}>200 - 超细</option>
                      <option value={300}>300 - 细</option>
                      <option value={400}>400 - 正常</option>
                      <option value={500}>500 - 中等</option>
                      <option value={600}>600 - 半粗</option>
                      <option value={700}>700 - 粗体</option>
                      <option value={800}>800 - 超粗</option>
                      <option value={900}>900 - 极粗</option>
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='titleLetterSpacing'>
                      字间距 ({config.titleStyle.letterSpacing}px)
                    </Label>
                    <input
                      type='range'
                      id='titleLetterSpacing'
                      min='-5'
                      max='10'
                      step='0.5'
                      value={config.titleStyle.letterSpacing}
                      onChange={e =>
                        setConfig({
                          ...config,
                          titleStyle: {
                            ...config.titleStyle,
                            letterSpacing: parseFloat(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full'
                      aria-label={`主标题字间距: ${config.titleStyle.letterSpacing}px`}
                      title={`主标题字间距: ${config.titleStyle.letterSpacing}px`}
                    />
                  </div>

                  <div>
                    <Label htmlFor='titleLineHeight'>行高 ({config.titleStyle.lineHeight})</Label>
                    <input
                      type='range'
                      id='titleLineHeight'
                      min='0.8'
                      max='2.0'
                      step='0.1'
                      value={config.titleStyle.lineHeight}
                      onChange={e =>
                        setConfig({
                          ...config,
                          titleStyle: {
                            ...config.titleStyle,
                            lineHeight: parseFloat(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full'
                    />
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  <input
                    type='checkbox'
                    id='titleTextShadow'
                    checked={config.titleStyle.textShadow}
                    onChange={e =>
                      setConfig({
                        ...config,
                        titleStyle: { ...config.titleStyle, textShadow: e.target.checked },
                      })
                    }
                    className='rounded'
                  />
                  <Label htmlFor='titleTextShadow'>文字阴影</Label>
                </div>

                <GradientPicker
                  value={config.titleStyle.gradient}
                  onChange={gradient =>
                    setConfig({
                      ...config,
                      titleStyle: { ...config.titleStyle, gradient },
                    })
                  }
                  label='渐变色文字'
                />

                {!config.titleStyle.gradient.enabled && (
                  <div>
                    <Label htmlFor='titleColor'>文字颜色</Label>
                    <div className='mt-2 flex items-center gap-2'>
                      <input
                        type='color'
                        id='titleColor'
                        value={config.titleStyle.color}
                        onChange={e =>
                          setConfig({
                            ...config,
                            titleStyle: { ...config.titleStyle, color: e.target.value },
                          })
                        }
                        className='h-10 w-12 rounded border'
                      />
                      <Input
                        value={config.titleStyle.color}
                        onChange={e =>
                          setConfig({
                            ...config,
                            titleStyle: { ...config.titleStyle, color: e.target.value },
                          })
                        }
                        placeholder='#ffffff'
                        className='flex-1'
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 副标题样式配置 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Type className='h-5 w-5' />
                  副标题样式
                </CardTitle>
                <CardDescription>配置副标题的字体、大小、颜色等样式</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <FontSelector
                  value={config.subtitleStyle.fontFamily}
                  onChange={value =>
                    setConfig({
                      ...config,
                      subtitleStyle: { ...config.subtitleStyle, fontFamily: value },
                    })
                  }
                  label='字体'
                  options={fontOptions}
                />

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='subtitleFontSize'>
                      字体大小 ({config.subtitleStyle.fontSize}px)
                    </Label>
                    <input
                      type='range'
                      id='subtitleFontSize'
                      min='12'
                      max='48'
                      value={config.subtitleStyle.fontSize}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: {
                            ...config.subtitleStyle,
                            fontSize: parseInt(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full'
                    />
                  </div>

                  <div>
                    <Label htmlFor='subtitleFontWeight'>
                      字体粗细 ({config.subtitleStyle.fontWeight})
                    </Label>
                    <select
                      id='subtitleFontWeight'
                      value={config.subtitleStyle.fontWeight}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: {
                            ...config.subtitleStyle,
                            fontWeight: parseInt(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full rounded-md border border-gray-300 px-3 py-2'
                    >
                      <option value={100}>100 - 极细</option>
                      <option value={200}>200 - 超细</option>
                      <option value={300}>300 - 细</option>
                      <option value={400}>400 - 正常</option>
                      <option value={500}>500 - 中等</option>
                      <option value={600}>600 - 半粗</option>
                      <option value={700}>700 - 粗体</option>
                      <option value={800}>800 - 超粗</option>
                      <option value={900}>900 - 极粗</option>
                    </select>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='subtitleLetterSpacing'>
                      字间距 ({config.subtitleStyle.letterSpacing}px)
                    </Label>
                    <input
                      type='range'
                      id='subtitleLetterSpacing'
                      min='-3'
                      max='8'
                      step='0.5'
                      value={config.subtitleStyle.letterSpacing}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: {
                            ...config.subtitleStyle,
                            letterSpacing: parseFloat(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full'
                    />
                  </div>

                  <div>
                    <Label htmlFor='subtitleLineHeight'>
                      行高 ({config.subtitleStyle.lineHeight})
                    </Label>
                    <input
                      type='range'
                      id='subtitleLineHeight'
                      min='1.0'
                      max='2.5'
                      step='0.1'
                      value={config.subtitleStyle.lineHeight}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: {
                            ...config.subtitleStyle,
                            lineHeight: parseFloat(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full'
                    />
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label htmlFor='subtitleOpacity'>
                      透明度 ({config.subtitleStyle.opacity}%)
                    </Label>
                    <input
                      type='range'
                      id='subtitleOpacity'
                      min='10'
                      max='100'
                      value={config.subtitleStyle.opacity}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: {
                            ...config.subtitleStyle,
                            opacity: parseInt(e.target.value),
                          },
                        })
                      }
                      className='mt-2 w-full'
                    />
                  </div>

                  <div className='mt-6 flex items-center space-x-2'>
                    <input
                      type='checkbox'
                      id='subtitleTextShadow'
                      checked={config.subtitleStyle.textShadow}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: { ...config.subtitleStyle, textShadow: e.target.checked },
                        })
                      }
                      className='rounded'
                    />
                    <Label htmlFor='subtitleTextShadow'>文字阴影</Label>
                  </div>
                </div>

                <div>
                  <Label htmlFor='subtitleColor'>文字颜色</Label>
                  <div className='mt-2 flex items-center gap-2'>
                    <input
                      type='color'
                      id='subtitleColor'
                      value={config.subtitleStyle.color}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: { ...config.subtitleStyle, color: e.target.value },
                        })
                      }
                      className='h-10 w-12 rounded border'
                    />
                    <Input
                      value={config.subtitleStyle.color}
                      onChange={e =>
                        setConfig({
                          ...config,
                          subtitleStyle: { ...config.subtitleStyle, color: e.target.value },
                        })
                      }
                      placeholder='#ffffff'
                      className='flex-1'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 视觉效果配置 */}
            <Card>
              <CardHeader>
                <CardTitle>视觉效果</CardTitle>
                <CardDescription>配置遮罩层和其他视觉效果</CardDescription>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div>
                  <Label htmlFor='overlayOpacity'>遮罩透明度 ({config.overlayOpacity}%)</Label>
                  <input
                    type='range'
                    id='overlayOpacity'
                    min='0'
                    max='80'
                    value={config.overlayOpacity}
                    onChange={e =>
                      setConfig({ ...config, overlayOpacity: parseInt(e.target.value) })
                    }
                    className='mt-2 w-full'
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 状态信息 */}
        <Card>
          <CardHeader>
            <CardTitle>配置状态</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='flex items-center gap-4'>
              <Badge variant={config.videoUrl ? 'default' : 'secondary'}>
                {config.videoUrl ? '已配置视频' : '未配置视频'}
              </Badge>
              <Badge variant={config.title ? 'default' : 'secondary'}>
                {config.title ? '已配置标题' : '未配置标题'}
              </Badge>
              <Badge variant={config.subtitle ? 'default' : 'secondary'}>
                {config.subtitle ? '已配置副标题' : '未配置副标题'}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
