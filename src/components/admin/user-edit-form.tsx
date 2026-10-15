'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'

interface User {
  id: string
  email: string
  name: string
  isAdmin: boolean
  lastLogin?: Date
  createdAt: Date
  updatedAt: Date
}

interface UserEditFormProps {
  user: User | null
  isCreating: boolean
  onSave: (user: Partial<User> & { password?: string }) => void
  onCancel: () => void
}

export function UserEditForm({ user, isCreating, onSave, onCancel }: UserEditFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        confirmPassword: '',
        isAdmin: user.isAdmin,
      })
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        isAdmin: false,
      })
    }
  }, [user])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // 验证姓名
    if (!formData.name.trim()) {
      newErrors.name = '姓名不能为空'
    }

    // 验证邮箱
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确'
    }

    // 验证密码（创建时必填，编辑时可选）
    if (isCreating) {
      if (!formData.password) {
        newErrors.password = '密码不能为空'
      } else if (formData.password.length < 6) {
        newErrors.password = '密码至少6位'
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = '请确认密码'
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = '两次密码输入不一致'
      }
    } else {
      // 编辑时，如果输入了密码，则需要验证
      if (formData.password) {
        if (formData.password.length < 6) {
          newErrors.password = '密码至少6位'
        }
        if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = '两次密码输入不一致'
        }
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const userData: any = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      isAdmin: formData.isAdmin,
    }

    // 只有在设置了密码时才包含密码字段
    if (formData.password) {
      userData.password = formData.password
    }

    onSave(userData)
  }

  return (
    <form onSubmit={handleSubmit} className='space-y-6'>
      {/* 基本信息 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>基本信息</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='name'>姓名 *</Label>
            <Input
              id='name'
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              placeholder='输入用户姓名'
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name}</p>}
          </div>

          <div>
            <Label htmlFor='email'>邮箱地址 *</Label>
            <Input
              id='email'
              type='email'
              value={formData.email}
              onChange={e => handleInputChange('email', e.target.value)}
              placeholder='输入邮箱地址'
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && <p className='mt-1 text-sm text-red-600'>{errors.email}</p>}
          </div>
        </CardContent>
      </Card>

      {/* 密码设置 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>
            密码设置
            {!isCreating && (
              <span className='ml-2 text-sm font-normal text-gray-500'>(留空则不修改密码)</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div>
            <Label htmlFor='password'>密码 {isCreating && '*'}</Label>
            <div className='relative'>
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                placeholder={isCreating ? '输入密码' : '输入新密码（可选）'}
                className={errors.password ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </Button>
            </div>
            {errors.password && <p className='mt-1 text-sm text-red-600'>{errors.password}</p>}
          </div>

          <div>
            <Label htmlFor='confirmPassword'>确认密码 {isCreating && '*'}</Label>
            <div className='relative'>
              <Input
                id='confirmPassword'
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                placeholder={isCreating ? '再次输入密码' : '再次输入新密码'}
                className={errors.confirmPassword ? 'border-red-500 pr-10' : 'pr-10'}
              />
              <Button
                type='button'
                variant='ghost'
                size='sm'
                className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
              </Button>
            </div>
            {errors.confirmPassword && (
              <p className='mt-1 text-sm text-red-600'>{errors.confirmPassword}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 权限设置 */}
      <Card>
        <CardHeader>
          <CardTitle className='text-lg'>权限设置</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between'>
            <div className='space-y-0.5'>
              <Label htmlFor='isAdmin' className='text-base'>
                管理员权限
              </Label>
              <p className='text-sm text-gray-500'>管理员可以访问所有管理功能和设置</p>
            </div>
            <Switch
              id='isAdmin'
              checked={formData.isAdmin}
              onCheckedChange={checked => handleInputChange('isAdmin', checked)}
            />
          </div>

          {formData.isAdmin && (
            <Alert className='mt-4'>
              <AlertCircle className='h-4 w-4' />
              <AlertDescription>
                管理员权限将允许该用户访问所有系统功能，包括用户管理、内容管理和系统设置。请谨慎授予。
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* 操作按钮 */}
      <div className='flex justify-end gap-2 border-t pt-4'>
        <Button type='button' variant='outline' onClick={onCancel}>
          取消
        </Button>
        <Button type='submit'>{isCreating ? '创建用户' : '保存修改'}</Button>
      </div>
    </form>
  )
}
