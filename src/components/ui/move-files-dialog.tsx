'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { FolderTree } from './folder-tree'

interface MediaFolder {
  id: string
  name: string
  description?: string
  parentId?: string | null
  createdAt: string
  updatedAt: string
  creator?: {
    id: string
    name: string
    email: string
  }
  parent?: {
    id: string
    name: string
  }
  children?: MediaFolder[]
  _count: {
    media: number
    children: number
  }
}

interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  fileSize?: number
  url: string
  altText?: string
  metadata?: any
  createdAt: string
  folder?: {
    id: string
    name: string
  }
  uploader?: {
    id: string
    name: string
    email: string
  }
}

interface MoveFilesDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedFiles: MediaFile[]
  folders: MediaFolder[]
  onMove: (folderId: string | null) => Promise<void>
  loading?: boolean
}

export function MoveFilesDialog({
  open,
  onOpenChange,
  selectedFiles,
  folders,
  onMove,
  loading = false,
}: MoveFilesDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [moving, setMoving] = useState(false)

  // 重置选择
  useEffect(() => {
    if (open) {
      setSelectedFolderId(null)
    }
  }, [open])

  // 构建文件夹选项
  const buildFolderOptions = (
    folders: MediaFolder[]
  ): Array<{ id: string | null; name: string; level: number }> => {
    const options: Array<{ id: string | null; name: string; level: number }> = [
      { id: null, name: '根目录', level: 0 },
    ]

    const addFolderOptions = (folders: MediaFolder[], level: number = 0) => {
      folders.forEach(folder => {
        options.push({
          id: folder.id,
          name: folder.name,
          level: level + 1,
        })

        if (folder.children) {
          addFolderOptions(folder.children, level + 1)
        }
      })
    }

    addFolderOptions(folders)
    return options
  }

  const folderOptions = buildFolderOptions(folders)

  const handleMove = async () => {
    setMoving(true)
    try {
      await onMove(selectedFolderId)
      onOpenChange(false)
    } catch (error) {
      console.error('移动文件失败:', error)
    } finally {
      setMoving(false)
    }
  }

  const selectedFolderName = selectedFolderId
    ? folderOptions.find(f => f.id === selectedFolderId)?.name || '未知文件夹'
    : '根目录'

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[80vh] max-w-2xl flex-col'>
        <DialogHeader className='flex-shrink-0'>
          <DialogTitle>移动文件 ({selectedFiles.length} 个文件)</DialogTitle>
          <DialogDescription>选择目标文件夹来移动选中的文件</DialogDescription>
        </DialogHeader>

        <div className='min-h-0 flex-1 space-y-4'>
          {/* 选中的文件列表 */}
          <div>
            <Label>选中的文件:</Label>
            <div className='mt-2 max-h-32 overflow-y-auto rounded-md border bg-gray-50 p-2'>
              {selectedFiles.map(file => (
                <div key={file.id} className='flex items-center justify-between py-1 text-sm'>
                  <span className='truncate'>{file.originalName}</span>
                  <span className='ml-2 text-xs text-gray-500'>
                    {file.folder?.name || '根目录'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 目标文件夹选择 */}
          <div className='min-h-0 flex-1'>
            <Label>选择目标文件夹:</Label>
            <div className='mt-2 grid h-64 grid-cols-1 gap-4 md:grid-cols-2'>
              {/* 下拉选择 */}
              <div>
                <Label className='text-sm text-gray-600'>快速选择:</Label>
                <Select
                  value={selectedFolderId || 'null'}
                  onValueChange={value => setSelectedFolderId(value === 'null' ? null : value)}
                >
                  <SelectTrigger className='mt-1'>
                    <SelectValue placeholder='选择文件夹' />
                  </SelectTrigger>
                  <SelectContent>
                    {folderOptions.map(option => (
                      <SelectItem key={option.id || 'null'} value={option.id || 'null'}>
                        <span style={{ paddingLeft: `${option.level * 16}px` }}>{option.name}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 文件夹树 */}
              <div>
                <Label className='text-sm text-gray-600'>文件夹树:</Label>
                <div className='mt-1 h-48 overflow-y-auto rounded-md border bg-white p-2'>
                  <FolderTree
                    folders={folders}
                    selectedFolderId={selectedFolderId}
                    onFolderSelect={setSelectedFolderId}
                    onCreateFolder={() => {}} // 在移动对话框中不允许创建文件夹
                    onEditFolder={() => {}}
                    onDeleteFolder={() => {}}
                    loading={loading}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 目标信息 */}
          <div className='rounded-md bg-blue-50 p-3'>
            <p className='text-sm'>
              将 <strong>{selectedFiles.length}</strong> 个文件移动到:
              <strong className='ml-1 text-blue-600'>{selectedFolderName}</strong>
            </p>
          </div>
        </div>

        {/* 按钮 */}
        <div className='flex flex-shrink-0 justify-end gap-2 border-t pt-4'>
          <Button variant='outline' onClick={() => onOpenChange(false)} disabled={moving}>
            取消
          </Button>
          <Button onClick={handleMove} disabled={moving}>
            {moving ? '移动中...' : '确认移动'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
