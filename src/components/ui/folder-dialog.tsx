'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

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

interface FolderDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  folder?: MediaFolder | null
  parentId?: string | null
  folders: MediaFolder[]
  onSave: (data: { name: string; description?: string; parentId?: string | null }) => Promise<void>
  loading?: boolean
}

export function FolderDialog({
  open,
  onOpenChange,
  folder,
  parentId,
  folders,
  onSave,
  loading = false,
}: FolderDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    parentId: parentId || null,
  })
  const [saving, setSaving] = useState(false)

  const isEditing = !!folder

  // 重置表单数据
  useEffect(() => {
    if (open) {
      if (folder) {
        setFormData({
          name: folder.name,
          description: folder.description || '',
          parentId: folder.parentId || null,
        })
      } else {
        setFormData({
          name: '',
          description: '',
          parentId: parentId || null,
        })
      }
    }
  }, [open, folder, parentId])

  // 构建文件夹选项（排除当前文件夹及其子文件夹）
  const buildFolderOptions = (
    folders: MediaFolder[],
    excludeId?: string
  ): Array<{ id: string | null; name: string; level: number }> => {
    const options: Array<{ id: string | null; name: string; level: number }> = [
      { id: null, name: '根目录', level: 0 },
    ]

    // 使用Set来跟踪已添加的文件夹ID，避免重复
    const addedIds = new Set<string>()

    const addFolderOptions = (folders: MediaFolder[], level: number = 0) => {
      folders.forEach(folder => {
        if (folder.id === excludeId) return // 排除当前文件夹
        if (addedIds.has(folder.id)) return // 避免重复添加

        addedIds.add(folder.id)
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

    // 只处理顶级文件夹（没有parentId的文件夹）
    const topLevelFolders = folders.filter(folder => !folder.parentId)
    addFolderOptions(topLevelFolders)
    return options
  }

  const folderOptions = buildFolderOptions(folders, folder?.id)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return

    setSaving(true)
    try {
      await onSave({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        parentId: formData.parentId,
      })
      onOpenChange(false)
    } catch (error) {
      console.error('保存文件夹失败:', error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{isEditing ? '编辑文件夹' : '新建文件夹'}</DialogTitle>
          <DialogDescription>
            {isEditing ? '修改文件夹的名称、描述和位置' : '创建新的文件夹来组织您的文件'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className='space-y-4'>
          {/* 文件夹名称 */}
          <div>
            <Label htmlFor='name'>文件夹名称 *</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder='请输入文件夹名称'
              required
              maxLength={100}
            />
          </div>

          {/* 文件夹描述 */}
          <div>
            <Label htmlFor='description'>文件夹描述</Label>
            <Textarea
              id='description'
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder='请输入文件夹描述（可选）'
              rows={3}
              maxLength={500}
            />
          </div>

          {/* 父文件夹 */}
          <div>
            <Label htmlFor='parentId'>父文件夹</Label>
            <Select
              value={formData.parentId || 'null'}
              onValueChange={value =>
                setFormData(prev => ({
                  ...prev,
                  parentId: value === 'null' ? null : value,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder='选择父文件夹' />
              </SelectTrigger>
              <SelectContent>
                {folderOptions.map((option, index) => (
                  <SelectItem key={`${option.id || 'null'}-${index}`} value={option.id || 'null'}>
                    <span style={{ paddingLeft: `${option.level * 16}px` }}>{option.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 按钮 */}
          <div className='flex justify-end gap-2 pt-4'>
            <Button
              type='button'
              variant='outline'
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              取消
            </Button>
            <Button type='submit' disabled={!formData.name.trim() || saving}>
              {saving ? '保存中...' : isEditing ? '更新' : '创建'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
