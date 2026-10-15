'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { cn } from '@/lib/utils'
import { ImageUpload } from './image-upload'
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Code,
  Link as LinkIcon,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Undo,
  Redo,
  Type,
  Upload,
  ExternalLink,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React, { useCallback, useState, useEffect } from 'react'

// 创建支持拖拽上传的Image扩展
const CustomImage = Image.extend({
  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('imageUpload'),
        props: {
          handleDOMEvents: {
            drop(view, event) {
              const hasFiles = event.dataTransfer?.files?.length

              if (!hasFiles) {
                return false
              }

              const images = Array.from(event.dataTransfer.files).filter(file =>
                file.type.includes('image/')
              )

              if (images.length === 0) {
                return false
              }

              event.preventDefault()

              const { schema } = view.state
              const coordinates = view.posAtCoords({
                left: event.clientX,
                top: event.clientY,
              })

              images.forEach(async image => {
                const formData = new FormData()
                formData.append('file', image)

                try {
                  const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  })

                  if (response.ok) {
                    const data = await response.json()
                    const node = schema.nodes.image.create({
                      src: data.url,
                      alt: image.name,
                    })

                    const transaction = view.state.tr.insert(
                      coordinates?.pos || view.state.selection.head,
                      node
                    )
                    view.dispatch(transaction)
                  }
                } catch (error) {
                  console.error('Upload failed:', error)
                }
              })

              return true
            },
            paste(view, event) {
              const items = event.clipboardData?.items
              if (!items) return false

              const images = Array.from(items).filter(item => item.type.includes('image/'))

              if (images.length === 0) return false

              event.preventDefault()

              images.forEach(async item => {
                const file = item.getAsFile()
                if (!file) return

                const formData = new FormData()
                formData.append('file', file)

                try {
                  const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                  })

                  if (response.ok) {
                    const data = await response.json()
                    const { schema } = view.state
                    const node = schema.nodes.image.create({
                      src: data.url,
                      alt: file.name,
                    })

                    const transaction = view.state.tr.insert(view.state.selection.head, node)
                    view.dispatch(transaction)
                  }
                } catch (error) {
                  console.error('Upload failed:', error)
                }
              })

              return true
            },
          },
        },
      }),
    ]
  },
})

interface RichTextEditorProps {
  value?: string
  onChange?: (content: string) => void
  placeholder?: string
  height?: number
  disabled?: boolean
  className?: string
  id?: string
}

// 图片插入对话框组件
interface ImageInsertDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onInsert: (imageData: { src: string; alt?: string }) => void
}

function ImageInsertDialog({ open, onOpenChange, onInsert }: ImageInsertDialogProps) {
  const [imageUrl, setImageUrl] = useState('')
  const [altText, setAltText] = useState('')
  const [uploading, setUploading] = useState(false)
  const [previewError, setPreviewError] = useState(false)
  const [activeTab, setActiveTab] = useState('url')

  const handleUrlInsert = () => {
    if (imageUrl.trim()) {
      onInsert({ src: imageUrl.trim(), alt: altText.trim() || undefined })
      handleClose()
    }
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        onInsert({ src: data.url, alt: altText.trim() || file.name })
        handleClose()
      } else {
        alert('上传失败')
      }
    } catch (error) {
      console.error('上传错误:', error)
      alert('上传失败')
    } finally {
      setUploading(false)
    }
  }

  const handleClose = () => {
    setImageUrl('')
    setAltText('')
    setPreviewError(false)
    setActiveTab('url')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>插入图片</DialogTitle>
          <DialogDescription>选择图片插入到富文本编辑器中</DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='url' className='flex items-center gap-2'>
              <ExternalLink className='h-4 w-4' />
              外部链接
            </TabsTrigger>
            <TabsTrigger value='upload' className='flex items-center gap-2'>
              <Upload className='h-4 w-4' />
              上传图片
            </TabsTrigger>
          </TabsList>

          <TabsContent value='url' className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='image-url'>图片URL</Label>
              <div className='flex gap-2'>
                <Input
                  id='image-url'
                  value={imageUrl}
                  onChange={e => {
                    setImageUrl(e.target.value)
                    setPreviewError(false)
                  }}
                  placeholder='https://example.com/image.jpg'
                  className='flex-1'
                />
                <Button
                  type='button'
                  variant='outline'
                  size='sm'
                  onClick={async () => {
                    try {
                      const text = await navigator.clipboard.readText()
                      if (text && (text.startsWith('http') || text.startsWith('data:'))) {
                        setImageUrl(text)
                        setPreviewError(false)
                      }
                    } catch (err) {
                      // 忽略剪贴板权限错误
                    }
                  }}
                  title='从剪贴板粘贴URL'
                >
                  粘贴
                </Button>
              </div>
            </div>

            <div className='space-y-2'>
              <Label htmlFor='alt-text'>替代文本（可选）</Label>
              <Input
                id='alt-text'
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder='图片描述'
              />
            </div>

            {/* 预览 */}
            {imageUrl && !previewError && (
              <div className='space-y-2'>
                <Label>预览</Label>
                <div className='rounded-md border bg-gray-50 p-2'>
                  <img
                    src={imageUrl}
                    alt='预览'
                    className='h-32 max-w-full rounded object-contain'
                    onError={() => setPreviewError(true)}
                  />
                </div>
              </div>
            )}

            {previewError && (
              <div className='text-sm text-red-600'>无法加载图片预览，请检查URL是否正确</div>
            )}

            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={handleClose}>
                取消
              </Button>
              <Button onClick={handleUrlInsert} disabled={!imageUrl.trim()}>
                插入图片
              </Button>
            </div>
          </TabsContent>

          <TabsContent value='upload' className='space-y-4'>
            <div className='space-y-2'>
              <Label htmlFor='image-file'>选择图片文件</Label>
              <Input
                id='image-file'
                type='file'
                accept='image/*'
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='alt-text-upload'>替代文本（可选）</Label>
              <Input
                id='alt-text-upload'
                value={altText}
                onChange={e => setAltText(e.target.value)}
                placeholder='图片描述'
              />
            </div>

            {uploading && <div className='text-sm text-blue-600'>上传中...</div>}

            <div className='flex justify-end gap-2'>
              <Button variant='outline' onClick={handleClose}>
                取消
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export function RichTextEditor({
  value = '',
  onChange,
  placeholder = '请输入内容...',
  height = 400,
  disabled = false,
  className,
  id,
}: RichTextEditorProps) {
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // 禁用StarterKit中的Link扩展，使用我们自定义的
        link: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
      }),
      CustomImage,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      if (onChange) {
        onChange(html)
      }
    },
    editable: !disabled,
    immediatelyRender: false, // 修复SSR问题
  })

  // 同步外部 value 属性的变化
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value)
    }
  }, [editor, value])

  const setLink = useCallback(() => {
    if (!editor || typeof window === 'undefined') return

    const previousUrl = editor.getAttributes('link').href
    const url = window.prompt('URL', previousUrl)

    if (url === null) {
      return
    }

    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }

    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  const addImage = useCallback(() => {
    if (!editor) return
    setIsImageDialogOpen(true)
  }, [editor])

  const handleImageInsert = useCallback(
    (imageData: { src: string; alt?: string }) => {
      if (!editor) return
      editor.chain().focus().setImage(imageData).run()
    },
    [editor]
  )

  // 拖拽事件处理
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    // 拖拽处理已在CustomImage扩展中实现
  }, [])

  if (!editor) {
    return <div className='h-64 animate-pulse rounded-md bg-gray-50' />
  }

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-lg border border-gray-200',
        isDragOver && 'border-blue-500 bg-blue-50',
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* 拖拽提示覆盖层 */}
      {isDragOver && (
        <div className='absolute inset-0 z-10 flex items-center justify-center border-2 border-dashed border-blue-500 bg-blue-100 bg-opacity-90'>
          <div className='text-center'>
            <ImageIcon className='mx-auto mb-2 h-12 w-12 text-blue-500' />
            <p className='font-medium text-blue-700'>插入图片</p>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className='flex flex-wrap gap-1 border-b border-gray-200 bg-gray-50 p-2'>
        {/* Text Formatting */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
        >
          <Bold className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
        >
          <Italic className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-gray-200' : ''}
        >
          <Strikethrough className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Headings */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
        >
          H1
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
        >
          H2
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}
        >
          H3
        </Button>

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Lists */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
        >
          <List className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
        >
          <ListOrdered className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Alignment */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive({ textAlign: 'left' }) ? 'bg-gray-200' : ''}
        >
          <AlignLeft className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive({ textAlign: 'center' }) ? 'bg-gray-200' : ''}
        >
          <AlignCenter className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive({ textAlign: 'right' }) ? 'bg-gray-200' : ''}
        >
          <AlignRight className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Quote and Code */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
        >
          <Quote className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
        >
          <Code className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Link and Image */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={setLink}
          className={editor.isActive('link') ? 'bg-gray-200' : ''}
        >
          <LinkIcon className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={addImage}
          title='插入图片 (支持拖拽上传、粘贴图片)'
        >
          <ImageIcon className='h-4 w-4' />
        </Button>

        <div className='mx-1 h-6 w-px bg-gray-300' />

        {/* Undo/Redo */}
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
        >
          <Undo className='h-4 w-4' />
        </Button>
        <Button
          type='button'
          variant='ghost'
          size='sm'
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
        >
          <Redo className='h-4 w-4' />
        </Button>
      </div>

      {/* Editor Content */}
      <div className='relative p-4' style={{ minHeight: height - 60 }}>
        <EditorContent editor={editor} className='prose prose-sm max-w-none focus:outline-none' />

        {/* 空内容时的提示 */}
        {!value && (
          <div className='pointer-events-none absolute left-4 right-4 top-4 text-sm text-gray-400'>
            <p className='mb-2'>{placeholder}</p>
            <p className='text-xs'>
              💡 提示：可以直接拖拽图片到编辑器中，粘贴图片，或使用工具栏的图片按钮插入图片
            </p>
            <p className='mt-1 text-xs'>🖼️ 支持：外部图片URL、本地上传、媒体库选择</p>
          </div>
        )}
      </div>

      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: ${height - 120}px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: '${placeholder}';
          float: left;
          color: #9ca3af;
          pointer-events: none;
          height: 0;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin: 1rem 0 0.5rem 0;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem 0;
        }
        .ProseMirror p {
          margin: 0.5rem 0;
        }
        .ProseMirror ul,
        .ProseMirror ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #e5e7eb;
          padding-left: 1rem;
          margin: 1rem 0;
          color: #6b7280;
        }
        .ProseMirror pre {
          background: #f3f4f6;
          border-radius: 0.375rem;
          padding: 1rem;
          margin: 1rem 0;
          overflow-x: auto;
        }
        .ProseMirror code {
          background: #f3f4f6;
          padding: 0.125rem 0.25rem;
          border-radius: 0.25rem;
          font-size: 0.875rem;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.375rem;
        }
        .ProseMirror a {
          color: #3b82f6;
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: #1d4ed8;
        }
      `}</style>

      {/* 图片插入对话框 */}
      <ImageInsertDialog
        open={isImageDialogOpen}
        onOpenChange={setIsImageDialogOpen}
        onInsert={handleImageInsert}
      />
    </div>
  )
}

export default RichTextEditor
