'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { AvatarSelector } from '@/components/admin/avatar-selector'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

import { User, Shield, Save, RefreshCw, Eye, EyeOff, Camera, Key } from 'lucide-react'
import Image from 'next/image'

interface UserProfile {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  isAdmin: boolean
  lastLogin: string | null
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatarUrl: null as string | null,
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  // 加载个人资料
  const loadProfile = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/profile')
      const result = await response.json()

      if (result.success) {
        setProfile(result.data)
        setFormData({
          name: result.data.name,
          email: result.data.email,
          avatarUrl: result.data.avatarUrl,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      }
    } catch (error) {
      console.error('加载个人资料失败:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  // 保存个人资料
  const handleSave = async () => {
    try {
      setSaving(true)

      // 验证密码
      if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
        alert('新密码和确认密码不匹配')
        return
      }

      const updateData: any = {
        name: formData.name,
        email: formData.email,
        avatarUrl: formData.avatarUrl,
      }

      // 如果要修改密码
      if (formData.newPassword) {
        updateData.currentPassword = formData.currentPassword
        updateData.newPassword = formData.newPassword
        updateData.confirmPassword = formData.confirmPassword
      }

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })

      const result = await response.json()

      if (result.success) {
        alert('个人资料更新成功')
        setFormData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        }))
        loadProfile()
      } else {
        alert(result.error || '更新失败')
      }
    } catch (error) {
      console.error('保存个人资料失败:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  // 头像上传成功后自动保存
  const handleAvatarUploadSuccess = async (avatarUrl: string) => {
    try {
      console.log('保存头像URL:', avatarUrl)
      const requestData = {
        name: formData.name,
        email: formData.email,
        avatarUrl: avatarUrl,
      }
      console.log('请求数据:', requestData)

      const response = await fetch('/api/admin/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      })

      const result = await response.json()

      if (result.success) {
        alert('头像上传并保存成功！')
        // 重新加载用户资料，session会自动从数据库获取最新头像
        loadProfile()
      } else {
        console.error('头像保存失败:', result)
        alert(`头像保存失败: ${result.error || '未知错误'}`)
      }
    } catch (error) {
      console.error('保存头像失败:', error)
      alert('头像保存失败')
    }
  }

  // 格式化时间
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('zh-CN')
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className='flex items-center justify-center py-12'>
          <RefreshCw className='h-8 w-8 animate-spin text-gray-400' />
          <span className='ml-3 text-gray-600 dark:text-gray-400'>加载中...</span>
        </div>
      </AdminLayout>
    )
  }

  if (!profile) {
    return (
      <AdminLayout>
        <div className='py-12 text-center'>
          <User className='mx-auto mb-4 h-12 w-12 text-gray-400' />
          <p className='text-gray-600 dark:text-gray-400'>无法加载个人资料</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>个人资料</h1>
            <p className='text-gray-600 dark:text-gray-400'>管理您的账户信息和安全设置</p>
          </div>
          <div className='flex gap-2'>
            <Button onClick={loadProfile} variant='outline' size='sm' disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              刷新
            </Button>
            <Button onClick={handleSave} size='sm' disabled={saving} className='min-w-[120px]'>
              {saving ? (
                <>
                  <RefreshCw className='mr-2 h-4 w-4 animate-spin' />
                  保存中...
                </>
              ) : (
                <>
                  <Save className='mr-2 h-4 w-4' />
                  保存更改
                </>
              )}
            </Button>
          </div>
        </div>

        <div className='grid grid-cols-1 gap-6 lg:grid-cols-3'>
          {/* 基本信息 */}
          <div className='space-y-6 lg:col-span-2'>
            {/* 个人信息编辑 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <User className='h-5 w-5' />
                  基本信息
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {/* 头像设置 */}
                <div className='space-y-4'>
                  <Label className='text-base font-medium'>头像设置</Label>
                  <div className='flex items-start gap-6'>
                    {/* 当前头像预览 */}
                    <div className='group relative'>
                      <div className='h-24 w-24 overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100 shadow-lg dark:border-gray-700 dark:bg-gray-800'>
                        {formData.avatarUrl ? (
                          <Image
                            src={formData.avatarUrl}
                            alt='用户头像'
                            width={96}
                            height={96}
                            className='h-full w-full object-cover'
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center'>
                            <User className='h-10 w-10 text-gray-400' />
                          </div>
                        )}
                      </div>
                      {/* 头像悬停效果 */}
                      <div className='absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-0 transition-all duration-200 group-hover:bg-opacity-20'>
                        <Camera className='h-6 w-6 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100' />
                      </div>
                    </div>

                    {/* 头像操作 */}
                    <div className='flex-1 space-y-3'>
                      <div>
                        <h4 className='mb-1 font-medium text-gray-900 dark:text-white'>个人头像</h4>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                          上传您的个人头像，将在整个管理后台中显示
                        </p>
                      </div>

                      <div className='flex flex-wrap gap-2'>
                        <AvatarSelector
                          value={formData.avatarUrl}
                          onChange={url => setFormData(prev => ({ ...prev, avatarUrl: url }))}
                          onUploadSuccess={handleAvatarUploadSuccess}
                          trigger={
                            <Button variant='outline' size='sm'>
                              <Camera className='mr-2 h-4 w-4' />
                              {formData.avatarUrl ? '更换头像' : '上传头像'}
                            </Button>
                          }
                        />
                        {formData.avatarUrl && (
                          <Button
                            variant='ghost'
                            size='sm'
                            onClick={() => setFormData(prev => ({ ...prev, avatarUrl: null }))}
                            className='text-red-600 hover:text-red-700 dark:text-red-400'
                          >
                            移除头像
                          </Button>
                        )}
                      </div>

                      <div className='space-y-1 text-xs text-gray-500 dark:text-gray-400'>
                        <p>• 推荐使用正方形图片，尺寸至少 200x200 像素</p>
                        <p>• 支持 JPG、PNG、GIF 格式，文件大小不超过 5MB</p>
                        <p>• 头像将自动裁剪为圆形显示</p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* 基本信息 */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>姓名</Label>
                    <Input
                      id='name'
                      value={formData.name}
                      onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder='请输入姓名'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='email'>邮箱</Label>
                    <Input
                      id='email'
                      type='email'
                      value={formData.email}
                      onChange={e => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder='请输入邮箱'
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 密码修改 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Key className='h-5 w-5' />
                  修改密码
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='space-y-2'>
                  <Label htmlFor='currentPassword'>当前密码</Label>
                  <div className='relative'>
                    <Input
                      id='currentPassword'
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={formData.currentPassword}
                      onChange={e =>
                        setFormData(prev => ({ ...prev, currentPassword: e.target.value }))
                      }
                      placeholder='请输入当前密码'
                    />
                    <Button
                      type='button'
                      variant='ghost'
                      size='sm'
                      className='absolute right-0 top-0 h-full px-3'
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? (
                        <EyeOff className='h-4 w-4' />
                      ) : (
                        <Eye className='h-4 w-4' />
                      )}
                    </Button>
                  </div>
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='newPassword'>新密码</Label>
                    <div className='relative'>
                      <Input
                        id='newPassword'
                        type={showNewPassword ? 'text' : 'password'}
                        value={formData.newPassword}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, newPassword: e.target.value }))
                        }
                        placeholder='请输入新密码'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3'
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='confirmPassword'>确认新密码</Label>
                    <div className='relative'>
                      <Input
                        id='confirmPassword'
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={e =>
                          setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))
                        }
                        placeholder='请再次输入新密码'
                      />
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        className='absolute right-0 top-0 h-full px-3'
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? (
                          <EyeOff className='h-4 w-4' />
                        ) : (
                          <Eye className='h-4 w-4' />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className='text-sm text-gray-600 dark:text-gray-400'>
                  <p>• 密码至少6位字符</p>
                  <p>• 如果不需要修改密码，请留空</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 侧边栏信息 */}
          <div className='space-y-6'>
            {/* 账户概览 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  账户概览
                </CardTitle>
              </CardHeader>
              <CardContent className='space-y-4'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-blue-100 dark:bg-blue-900/20'>
                    {profile.avatarUrl ? (
                      <Image
                        src={profile.avatarUrl}
                        alt={profile.name}
                        width={48}
                        height={48}
                        className='h-full w-full object-cover'
                      />
                    ) : (
                      <User className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                    )}
                  </div>
                  <div>
                    <p className='font-medium text-gray-900 dark:text-white'>{profile.name}</p>
                    <p className='text-sm text-gray-600 dark:text-gray-400'>{profile.email}</p>
                  </div>
                </div>

                <Separator />

                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>账户类型</span>
                    <Badge variant={profile.isAdmin ? 'default' : 'secondary'}>
                      {profile.isAdmin ? '管理员' : '普通用户'}
                    </Badge>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>注册时间</span>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {formatDateTime(profile.createdAt)}
                    </span>
                  </div>
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>最后登录</span>
                    <span className='text-sm text-gray-900 dark:text-white'>
                      {profile.lastLogin ? formatDateTime(profile.lastLogin) : '从未登录'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 安全提示 */}
            <Card>
              <CardHeader>
                <CardTitle className='flex items-center gap-2'>
                  <Shield className='h-5 w-5' />
                  安全提示
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className='space-y-3 text-sm text-gray-600 dark:text-gray-400'>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>定期更换密码以保护账户安全，建议每3-6个月更换一次</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>使用强密码：至少8位，包含大小写字母、数字和特殊字符</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>不要在公共设备上保存登录状态，使用后及时退出</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>如发现异常活动请立即修改密码并联系管理员</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>不要与他人分享您的登录凭据，包括密码和会话信息</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>定期检查最后登录时间，确认是否为本人操作</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>避免在不安全的网络环境下访问管理后台</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>及时更新浏览器和操作系统以获得最新安全补丁</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>使用双因素认证（如果可用）增强账户安全性</p>
                  </div>
                  <div className='flex items-start gap-2'>
                    <div className='mt-2 h-1.5 w-1.5 rounded-full bg-blue-500'></div>
                    <p>注意防范钓鱼邮件和恶意链接，确认URL正确性</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
