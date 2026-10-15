'use client'

import React, { useState, useEffect } from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Settings,
  Save,
  Plus,
  Trash2,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  Palette,
  Shield,
  Database,
} from 'lucide-react'

interface SiteSetting {
  id: string
  key: string
  value?: string
  category?: string
  description?: string
  updatedAt: string
}

interface SettingsByCategory {
  [category: string]: SiteSetting[]
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsByCategory>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('general')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // 新设置项表单
  const [newSetting, setNewSetting] = useState({
    key: '',
    value: '',
    category: 'general',
    description: '',
  })

  // 获取设置
  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/settings')

      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)

        // 如果没有设置，初始化默认设置
        if (Object.keys(data.settings).length === 0) {
          await initializeDefaultSettings()
        }
      } else {
        console.error('Failed to fetch settings')
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  // 初始化默认设置
  const initializeDefaultSettings = async () => {
    const defaultSettings = [
      // 基本信息
      { key: 'site_name', value: '临港景鸿', category: 'general', description: '网站名称' },
      {
        key: 'site_description',
        value: '专业的智能化解决方案提供商',
        category: 'general',
        description: '网站描述',
      },
      {
        key: 'site_keywords',
        value: '智能化,物联网,AI,解决方案',
        category: 'general',
        description: '网站关键词',
      },

      // 联系信息
      {
        key: 'company_name',
        value: '上海临港景鸿安全防范科技发展有限公司',
        category: 'contact',
        description: '公司名称',
      },
      {
        key: 'company_address',
        value: '上海市浦东新区临港新片区',
        category: 'contact',
        description: '公司地址',
      },
      {
        key: 'company_phone',
        value: '+86 21 1234 5678',
        category: 'contact',
        description: '联系电话',
      },
      {
        key: 'company_email',
        value: 'info@lgjh.com',
        category: 'contact',
        description: '联系邮箱',
      },

      // 社交媒体
      { key: 'wechat_qr', value: '', category: 'social', description: '微信二维码URL' },
      { key: 'weibo_url', value: '', category: 'social', description: '微博链接' },
      { key: 'linkedin_url', value: '', category: 'social', description: 'LinkedIn链接' },

      // SEO设置
      {
        key: 'meta_title',
        value: '临港景鸿 - 智能化解决方案专家',
        category: 'seo',
        description: '页面标题',
      },
      {
        key: 'meta_description',
        value: '专业提供智能化、物联网、AI等解决方案',
        category: 'seo',
        description: '页面描述',
      },
      { key: 'google_analytics', value: '', category: 'seo', description: 'Google Analytics ID' },

      // 系统设置
      { key: 'maintenance_mode', value: 'false', category: 'system', description: '维护模式' },
      {
        key: 'max_upload_size',
        value: '10',
        category: 'system',
        description: '最大上传文件大小(MB)',
      },
      { key: 'cache_duration', value: '3600', category: 'system', description: '缓存时长(秒)' },
    ]

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: defaultSettings }),
      })

      if (response.ok) {
        fetchSettings()
      }
    } catch (error) {
      console.error('Error initializing settings:', error)
    }
  }

  useEffect(() => {
    fetchSettings()
  }, [])

  // 更新设置值
  const updateSettingValue = (category: string, key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [category]:
        prev[category]?.map(setting => (setting.key === key ? { ...setting, value } : setting)) ||
        [],
    }))
  }

  // 保存设置
  const saveSettings = async () => {
    try {
      setSaving(true)

      // 将设置转换为数组格式
      const settingsArray = Object.values(settings).flat()

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsArray }),
      })

      if (response.ok) {
        alert('设置保存成功！')
        fetchSettings()
      } else {
        alert('保存失败')
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  // 添加新设置
  const addNewSetting = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSetting),
      })

      if (response.ok) {
        setIsAddDialogOpen(false)
        setNewSetting({ key: '', value: '', category: 'general', description: '' })
        fetchSettings()
      } else {
        const error = await response.json()
        alert(error.error || '添加失败')
      }
    } catch (error) {
      console.error('Error adding setting:', error)
      alert('添加失败')
    }
  }

  // 删除设置
  const deleteSetting = async (key: string) => {
    if (!confirm(`确定要删除设置"${key}"吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/settings/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchSettings()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Error deleting setting:', error)
      alert('删除失败')
    }
  }

  // 获取分类图标
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'general':
        return <Globe className='h-4 w-4' />
      case 'contact':
        return <Phone className='h-4 w-4' />
      case 'social':
        return <Building className='h-4 w-4' />
      case 'seo':
        return <Database className='h-4 w-4' />
      case 'system':
        return <Settings className='h-4 w-4' />
      default:
        return <Settings className='h-4 w-4' />
    }
  }

  // 获取分类名称
  const getCategoryName = (category: string) => {
    switch (category) {
      case 'general':
        return '基本设置'
      case 'contact':
        return '联系信息'
      case 'social':
        return '社交媒体'
      case 'seo':
        return 'SEO设置'
      case 'system':
        return '系统设置'
      default:
        return category
    }
  }

  const categories = Object.keys(settings)

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>网站设置</h1>
            <p className='text-gray-600'>管理网站的全局配置和参数</p>
          </div>
          <div className='flex items-center gap-2'>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button variant='outline' className='flex items-center gap-2'>
                  <Plus className='h-4 w-4' />
                  添加设置
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>添加新设置</DialogTitle>
                  <DialogDescription>添加新的网站配置项，用于管理网站的全局参数</DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                  <div>
                    <Label htmlFor='key'>设置键</Label>
                    <Input
                      id='key'
                      value={newSetting.key}
                      onChange={e => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                      placeholder='例如: site_name'
                    />
                  </div>
                  <div>
                    <Label htmlFor='value'>设置值</Label>
                    <Input
                      id='value'
                      value={newSetting.value}
                      onChange={e => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                      placeholder='设置的值'
                    />
                  </div>
                  <div>
                    <Label htmlFor='category'>分类</Label>
                    <Select
                      value={newSetting.category}
                      onValueChange={value => setNewSetting(prev => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='general'>基本设置</SelectItem>
                        <SelectItem value='contact'>联系信息</SelectItem>
                        <SelectItem value='social'>社交媒体</SelectItem>
                        <SelectItem value='seo'>SEO设置</SelectItem>
                        <SelectItem value='system'>系统设置</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor='description'>描述</Label>
                    <Textarea
                      id='description'
                      value={newSetting.description}
                      onChange={e =>
                        setNewSetting(prev => ({ ...prev, description: e.target.value }))
                      }
                      placeholder='设置的描述信息'
                    />
                  </div>
                  <Button onClick={addNewSetting} className='w-full'>
                    添加设置
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button onClick={saveSettings} disabled={saving} className='flex items-center gap-2'>
              <Save className='h-4 w-4' />
              {saving ? '保存中...' : '保存设置'}
            </Button>
          </div>
        </div>

        {/* 设置内容 */}
        {loading ? (
          <div className='py-8 text-center'>
            <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
            <p className='mt-2 text-gray-600'>加载中...</p>
          </div>
        ) : categories.length === 0 ? (
          <div className='py-8 text-center'>
            <p className='text-gray-600'>暂无设置项</p>
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className='grid w-full grid-cols-5'>
              {categories.map(category => (
                <TabsTrigger key={category} value={category} className='flex items-center gap-2'>
                  {getCategoryIcon(category)}
                  {getCategoryName(category)}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map(category => (
              <TabsContent key={category} value={category}>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex items-center gap-2'>
                      {getCategoryIcon(category)}
                      {getCategoryName(category)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-4'>
                    {settings[category]?.map(setting => (
                      <div
                        key={setting.key}
                        className='grid grid-cols-1 gap-4 rounded-lg border p-4 md:grid-cols-3'
                      >
                        <div>
                          <Label className='text-sm font-medium'>{setting.key}</Label>
                          {setting.description && (
                            <p className='mt-1 text-xs text-gray-500'>{setting.description}</p>
                          )}
                        </div>
                        <div className='flex items-center gap-2 md:col-span-2'>
                          {setting.key.includes('description') ||
                          setting.key.includes('keywords') ? (
                            <Textarea
                              value={setting.value || ''}
                              onChange={e =>
                                updateSettingValue(category, setting.key, e.target.value)
                              }
                              className='flex-1'
                              rows={2}
                            />
                          ) : (
                            <Input
                              value={setting.value || ''}
                              onChange={e =>
                                updateSettingValue(category, setting.key, e.target.value)
                              }
                              className='flex-1'
                              type={
                                setting.key.includes('email')
                                  ? 'email'
                                  : setting.key.includes('phone')
                                    ? 'tel'
                                    : setting.key.includes('url')
                                      ? 'url'
                                      : 'text'
                              }
                            />
                          )}
                          <Button
                            variant='outline'
                            size='sm'
                            onClick={() => deleteSetting(setting.key)}
                            className='text-red-600 hover:text-red-700'
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </AdminLayout>
  )
}
