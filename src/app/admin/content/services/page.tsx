'use client'

import { useState, useEffect } from 'react'

// 类型安全的辅助函数
function ensureArray(value: any): any[] {
  if (Array.isArray(value)) {
    return value
  }
  if (typeof value === 'string') {
    try {
      const parsed = JSON.parse(value)
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  }
  return []
}
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SimpleServiceForm } from '@/components/admin/simple-service-form'
import { ClientCasesManagement } from '@/components/admin/client-cases-management'
import { PartnersManagement } from '@/components/admin/partners-management'
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  ExternalLink,
  BarChart3,
  Target,
  TrendingUp,
  Users,
} from 'lucide-react'

interface Service {
  id: string
  title: string
  subtitle?: string
  description?: string
  category: string
  serviceType?: string
  level?: 'beginner' | 'intermediate' | 'advanced'
  duration?: string
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
  icon?: string
  backgroundImage?: string
  highlight?: string
  features?: string[]
  displayOrder?: number

  // 新的页面内容结构
  hero?: {
    title: string
    subtitle: string
    description: string
    instructor?: {
      name: string
      title: string
      company: string
    }
  }
  learning?: {
    title: string
    objectives: string[]
  }
  courseInfo?: {
    level: string
    duration: string
    lessons: number
    instructor: string
    company: string
  }
  about?: {
    title: string
    description: string
    details: string[]
  }
  cta?: {
    buttonText: string
    isEnrollment: boolean
  }

  // 原有字段保持兼容
  process?: Array<{
    step: number
    title: string
    description: string
    icon?: string
  }>
  visualElements?: {
    primaryColor?: string
    secondaryColor?: string
    icon?: string
  }
  ctaConfig?: {
    text?: string
    link?: string
    style?: string
  }
  metrics?: Array<{
    label: string
    value: string
    unit?: string
  }>
  seo?: {
    metaTitle?: string
    metaDescription?: string
    keywords?: string[]
  }
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
  updater?: {
    id: string
    name: string
    email: string
  }
}

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  // 标签页状态
  const [activeTab, setActiveTab] = useState('services')

  // 处理URL锚点，自动切换到对应标签页
  useEffect(() => {
    const hash = window.location.hash.replace('#', '')
    if (hash === 'partners') {
      setActiveTab('partners')
    } else if (hash === 'client-cases') {
      setActiveTab('client-cases')
    } else if (hash === 'services') {
      setActiveTab('services')
    }
  }, [])

  // 对话框状态
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)

  // 获取服务列表
  const fetchServices = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '10',
        ...(searchTerm && { search: searchTerm }),
      })

      const response = await fetch(`/api/admin/content/services?${params}`)

      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
        setTotalPages(data.pagination.pages)
        setTotalCount(data.pagination.total)
      } else {
        console.error('Failed to fetch services')
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchServices()
  }, [currentPage, searchTerm])

  // 计算统计数据
  const getStatsData = () => {
    const totalFeatures = services.reduce((sum, service) => {
      return sum + (service.features?.length || 0)
    }, 0)

    const totalMetrics = services.reduce((sum, service) => {
      return sum + (service.metrics?.length || 0)
    }, 0)

    const totalProcessSteps = services.reduce((sum, service) => {
      return sum + (service.process?.length || 0)
    }, 0)

    return {
      total: totalCount,
      features: totalFeatures,
      metrics: totalMetrics,
      processSteps: totalProcessSteps,
    }
  }

  const stats = getStatsData()

  // 对话框操作
  const openCreateDialog = () => {
    setSelectedService(null)
    setIsCreateDialogOpen(true)
  }

  const openEditDialog = (service: Service) => {
    setSelectedService(service)
    setIsEditDialogOpen(true)
  }

  const openViewDialog = (service: Service) => {
    setSelectedService(service)
    setIsViewDialogOpen(true)
  }

  // 跳转到服务详情页面
  const goToServiceDetail = (service: Service) => {
    if (!service.slug) {
      alert('该服务缺少URL标识符(slug)，无法跳转到详情页面')
      return
    }
    const detailUrl = `/services/${service.slug}`
    window.open(detailUrl, '_blank')
  }

  const closeDialogs = () => {
    setIsCreateDialogOpen(false)
    setIsEditDialogOpen(false)
    setIsViewDialogOpen(false)
    setSelectedService(null)
  }

  // 删除服务
  const handleDelete = async (service: Service) => {
    if (!confirm(`确定要删除服务"${service.title}"吗？`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/content/services/${service.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchServices()
      } else {
        alert('删除失败')
      }
    } catch (error) {
      console.error('Error deleting service:', error)
      alert('删除失败')
    }
  }

  // 处理表单提交成功
  const handleFormSuccess = () => {
    fetchServices()
    closeDialogs()
  }

  return (
    <AdminLayout>
      <div className='space-y-6'>
        {/* 页面标题 */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-2xl font-bold text-gray-900'>服务管理</h1>
            <p className='text-gray-600'>管理和编辑服务内容</p>
          </div>
          <Button onClick={openCreateDialog} className='flex items-center gap-2'>
            <Plus className='h-4 w-4' />
            新增服务
          </Button>
        </div>

        {/* 简化表单说明 */}
        <Card className='border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950'>
          <CardContent className='p-4'>
            <div className='flex items-start gap-3'>
              <div className='mt-2 h-2 w-2 rounded-full bg-green-500'></div>
              <div className='flex-1'>
                <h3 className='mb-2 font-medium text-green-800 dark:text-green-200'>
                  ✨ 已切换到简化版表单
                </h3>
                <div className='space-y-2 text-sm text-green-700 dark:text-green-300'>
                  <p>
                    <strong>简化版表单特点：</strong>只包含核心字段，操作更简单快捷
                  </p>
                  <div className='flex flex-wrap gap-4 text-xs'>
                    <span className='rounded bg-green-100 px-2 py-1 text-green-800'>
                      ✅ 服务标题
                    </span>
                    <span className='rounded bg-green-100 px-2 py-1 text-green-800'>
                      ✅ 服务描述
                    </span>
                    <span className='rounded bg-green-100 px-2 py-1 text-green-800'>
                      ✅ 服务图标
                    </span>
                    <span className='rounded bg-green-100 px-2 py-1 text-green-800'>
                      ✅ 背景图片
                    </span>
                    <span className='rounded bg-green-100 px-2 py-1 text-green-800'>
                      ✅ 显示顺序
                    </span>
                    <span className='rounded bg-green-100 px-2 py-1 text-green-800'>
                      ✅ 发布状态
                    </span>
                  </div>
                  <p className='text-xs'>💡 如需更多高级配置，可以联系开发人员切换回完整版表单</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 标签页 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className='w-full'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='services'>服务管理</TabsTrigger>
            <TabsTrigger value='client-cases'>客户案例</TabsTrigger>
            <TabsTrigger value='partners'>合作伙伴</TabsTrigger>
          </TabsList>

          <TabsContent value='services' className='space-y-6'>
            {/* 搜索和筛选 */}
            <div className='flex items-center gap-4'>
              <div className='relative max-w-sm flex-1'>
                <Search className='absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-gray-400' />
                <Input
                  placeholder='搜索服务标题...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
            </div>

            {/* 筛选结果提示 */}
            <div className='flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900 dark:text-white'>服务列表</h2>
              <p className='text-sm text-gray-600 dark:text-gray-400'>共 {totalCount} 个服务</p>
            </div>

            {/* 服务列表 */}
            <div className='rounded-lg border bg-white dark:bg-gray-800'>
              {loading ? (
                <div className='p-8 text-center'>
                  <div className='inline-block h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600'></div>
                  <p className='mt-2 text-gray-600'>加载中...</p>
                </div>
              ) : services.length === 0 ? (
                <div className='p-8 text-center'>
                  <p className='text-gray-600'>暂无服务数据</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='flex items-center gap-2'>
                        服务标题
                        <Badge variant='outline' className='text-xs'>
                          前端显示
                        </Badge>
                      </TableHead>
                      <TableHead>图标</TableHead>
                      <TableHead>状态</TableHead>
                      <TableHead>显示顺序</TableHead>
                      <TableHead>描述长度</TableHead>
                      <TableHead>更新时间</TableHead>
                      <TableHead className='w-[100px]'>操作</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {services.map(service => (
                      <TableRow key={service.id}>
                        <TableCell className='font-medium'>
                          <div className='flex flex-col'>
                            <span>{service.title}</span>
                            {service.subtitle && (
                              <span className='text-xs text-gray-500'>{service.subtitle}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className='flex items-center gap-2'>
                            {service.icon && (
                              <span className='text-lg'>
                                {service.icon === 'Cpu'
                                  ? '💻'
                                  : service.icon === 'Settings'
                                    ? '⚙️'
                                    : service.icon === 'Wrench'
                                      ? '🔧'
                                      : service.icon === 'Flame'
                                        ? '🔥'
                                        : service.icon === 'Shield'
                                          ? '🛡️'
                                          : service.icon === 'Grid3X3'
                                            ? '📋'
                                            : service.icon === 'CheckCircle'
                                              ? '✅'
                                              : service.icon === 'Star'
                                                ? '⭐'
                                                : '📄'}
                              </span>
                            )}
                            <span className='text-xs text-gray-600'>{service.icon || '无'}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              service.status === 'PUBLISHED'
                                ? 'default'
                                : service.status === 'DRAFT'
                                  ? 'secondary'
                                  : 'destructive'
                            }
                          >
                            {service.status === 'PUBLISHED'
                              ? '已发布'
                              : service.status === 'DRAFT'
                                ? '草稿'
                                : '已归档'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant='outline'>#{service.displayOrder || 0}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className='flex flex-col'>
                            <span className='text-sm'>{(service.description || '').length} 字</span>
                            <span className='max-w-[100px] truncate text-xs text-gray-500'>
                              {service.description || '无描述'}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className='text-sm'>
                          {new Date(service.updatedAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant='ghost' className='h-8 w-8 p-0'>
                                <MoreHorizontal className='h-4 w-4' />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end'>
                              <DropdownMenuItem onClick={() => openViewDialog(service)}>
                                <Eye className='mr-2 h-4 w-4' />
                                查看
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => goToServiceDetail(service)}
                                disabled={!service.slug}
                                className={!service.slug ? 'cursor-not-allowed opacity-50' : ''}
                              >
                                <ExternalLink className='mr-2 h-4 w-4' />
                                查看详情页
                                {!service.slug && (
                                  <span className='ml-2 text-xs text-gray-500'>(缺少slug)</span>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => openEditDialog(service)}>
                                <Edit className='mr-2 h-4 w-4' />
                                编辑
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(service)}
                                className='text-red-600'
                              >
                                <Trash2 className='mr-2 h-4 w-4' />
                                删除
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* 分页 */}
            {totalPages > 1 && (
              <div className='flex items-center justify-center gap-2'>
                <Button
                  variant='outline'
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <span className='text-sm text-gray-600'>
                  第 {currentPage} 页，共 {totalPages} 页
                </span>
                <Button
                  variant='outline'
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value='client-cases' className='space-y-6'>
            <ClientCasesManagement />
          </TabsContent>

          <TabsContent value='partners' className='space-y-6'>
            <PartnersManagement />
          </TabsContent>
        </Tabs>

        {/* 创建服务对话框 */}
        <Dialog
          open={isCreateDialogOpen}
          onOpenChange={open => {
            // 只有在明确关闭时才关闭对话框
            if (!open) {
              setIsCreateDialogOpen(false)
            }
          }}
        >
          <DialogContent
            className='max-h-[90vh] max-w-5xl overflow-y-auto'
            aria-describedby='create-service-description'
            onPointerDownOutside={e => {
              // 防止点击内容区域时关闭对话框
              e.preventDefault()
            }}
          >
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-blue-500'></span>
                新增服务
              </DialogTitle>
              <div id='create-service-description' className='sr-only'>
                创建新的服务项目，填写服务的基本信息、内容和配置
              </div>
            </DialogHeader>
            <SimpleServiceForm onSuccess={handleFormSuccess} onCancel={closeDialogs} />
          </DialogContent>
        </Dialog>

        {/* 编辑服务对话框 */}
        <Dialog
          open={isEditDialogOpen}
          onOpenChange={open => {
            // 只有在明确关闭时才关闭对话框
            if (!open) {
              setIsEditDialogOpen(false)
            }
          }}
        >
          <DialogContent
            className='max-h-[90vh] max-w-5xl overflow-y-auto'
            aria-describedby='edit-service-description'
            onPointerDownOutside={e => {
              // 防止点击内容区域时关闭对话框
              e.preventDefault()
            }}
          >
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-green-500'></span>
                编辑服务
              </DialogTitle>
              <div id='edit-service-description' className='sr-only'>
                编辑现有服务的信息、内容和配置设置
              </div>
            </DialogHeader>
            {selectedService && (
              <SimpleServiceForm
                service={{
                  ...selectedService,
                  features: ensureArray(selectedService.features),
                }}
                onSuccess={handleFormSuccess}
                onCancel={closeDialogs}
              />
            )}
          </DialogContent>
        </Dialog>

        {/* 查看服务对话框 */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent
            className='max-h-[90vh] max-w-5xl overflow-y-auto'
            aria-describedby='view-service-description'
          >
            <DialogHeader>
              <DialogTitle className='flex items-center gap-2'>
                <span className='h-2 w-2 rounded-full bg-gray-500'></span>
                查看服务详情
              </DialogTitle>
              <div id='view-service-description' className='sr-only'>
                查看服务的详细信息和配置，只读模式
              </div>
            </DialogHeader>
            {selectedService && (
              <SimpleServiceForm
                service={{
                  ...selectedService,
                  features: ensureArray(selectedService.features),
                }}
                readOnly={true}
                onCancel={closeDialogs}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
