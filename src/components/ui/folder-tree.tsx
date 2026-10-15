'use client'

import React, { useState, useEffect } from 'react'
import { ChevronRight, ChevronDown, Folder, FolderOpen, Plus, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

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

interface FolderTreeProps {
  folders: MediaFolder[]
  selectedFolderId?: string | null
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: (parentId?: string | null) => void
  onEditFolder: (folder: MediaFolder) => void
  onDeleteFolder: (folder: MediaFolder) => void
  loading?: boolean
}

interface FolderNodeProps {
  folder: MediaFolder
  level: number
  selectedFolderId?: string | null
  onFolderSelect: (folderId: string | null) => void
  onCreateFolder: (parentId?: string | null) => void
  onEditFolder: (folder: MediaFolder) => void
  onDeleteFolder: (folder: MediaFolder) => void
}

function FolderNode({
  folder,
  level,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
}: FolderNodeProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const hasChildren = folder.children && folder.children.length > 0
  const isSelected = selectedFolderId === folder.id

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1 rounded px-2 py-1 hover:bg-gray-100 ${
          isSelected ? 'border border-blue-200 bg-blue-50' : ''
        }`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        {/* 展开/收起按钮 */}
        <Button
          variant='ghost'
          size='sm'
          className='h-4 w-4 p-0'
          onClick={() => setIsExpanded(!isExpanded)}
          disabled={!hasChildren}
        >
          {hasChildren ? (
            isExpanded ? (
              <ChevronDown className='h-3 w-3' />
            ) : (
              <ChevronRight className='h-3 w-3' />
            )
          ) : (
            <div className='h-3 w-3' />
          )}
        </Button>

        {/* 文件夹图标 */}
        <div className='flex-shrink-0'>
          {isExpanded ? (
            <FolderOpen className='h-4 w-4 text-blue-600' />
          ) : (
            <Folder className='h-4 w-4 text-blue-600' />
          )}
        </div>

        {/* 文件夹名称 */}
        <span className='flex-1 truncate text-sm' onClick={() => onFolderSelect(folder.id)}>
          {folder.name}
        </span>

        {/* 文件数量 */}
        <span className='mr-1 text-xs text-gray-500'>{folder._count.media}</span>

        {/* 操作菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              size='sm'
              className='h-6 w-6 p-0 opacity-0 group-hover:opacity-100'
            >
              <MoreHorizontal className='h-3 w-3' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem onClick={() => onCreateFolder(folder.id)}>
              <Plus className='mr-2 h-4 w-4' />
              新建子文件夹
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEditFolder(folder)}>编辑文件夹</DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => onDeleteFolder(folder)}
              className='text-red-600'
              disabled={folder._count.media > 0 || folder._count.children > 0}
            >
              删除文件夹
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* 子文件夹 */}
      {isExpanded && hasChildren && (
        <div>
          {folder.children!.map(child => (
            <FolderNode
              key={child.id}
              folder={child}
              level={level + 1}
              selectedFolderId={selectedFolderId}
              onFolderSelect={onFolderSelect}
              onCreateFolder={onCreateFolder}
              onEditFolder={onEditFolder}
              onDeleteFolder={onDeleteFolder}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FolderTree({
  folders,
  selectedFolderId,
  onFolderSelect,
  onCreateFolder,
  onEditFolder,
  onDeleteFolder,
  loading = false,
}: FolderTreeProps) {
  if (loading) {
    return (
      <div className='p-4 text-center'>
        <div className='inline-block h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600'></div>
        <p className='mt-2 text-sm text-gray-600'>加载中...</p>
      </div>
    )
  }

  return (
    <div className='space-y-1'>
      {/* 根目录 */}
      <div
        className={`flex cursor-pointer items-center gap-2 rounded px-2 py-2 hover:bg-gray-100 ${
          selectedFolderId === null ? 'border border-blue-200 bg-blue-50' : ''
        }`}
        onClick={() => onFolderSelect(null)}
      >
        <Folder className='h-4 w-4 text-gray-600' />
        <span className='text-sm font-medium'>根目录</span>
      </div>

      {/* 文件夹树 */}
      <div className='group'>
        {folders.map(folder => (
          <FolderNode
            key={folder.id}
            folder={folder}
            level={0}
            selectedFolderId={selectedFolderId}
            onFolderSelect={onFolderSelect}
            onCreateFolder={onCreateFolder}
            onEditFolder={onEditFolder}
            onDeleteFolder={onDeleteFolder}
          />
        ))}
      </div>

      {/* 新建根文件夹按钮 */}
      <Button
        variant='ghost'
        size='sm'
        className='w-full justify-start text-gray-600 hover:text-gray-900'
        onClick={() => onCreateFolder(null)}
      >
        <Plus className='mr-2 h-4 w-4' />
        新建文件夹
      </Button>
    </div>
  )
}
