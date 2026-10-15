'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Container } from '@/components/ui/container'
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
import { useContactSettings } from '@/hooks/use-site-settings'
import { useLocations } from '@/hooks/use-locations'
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react'
import { CompanyMap } from '@/components/ui/map'

export default function ContactPage() {
  const { settings: contactSettings, error: settingsError } = useContactSettings()
  const { locations, loading: locationsLoading, error: locationsError } = useLocations()

  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || '感谢您的联系，我们会尽快回复您！',
        })
        // 清空表单
        setFormData({
          name: '',
          email: '',
          phone: '',
          company: '',
          subject: '',
          message: '',
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || '提交失败，请稍后重试',
        })
      }
    } catch (error) {
      console.error('表单提交错误:', error)
      setSubmitStatus({
        type: 'error',
        message: '网络错误，请检查网络连接后重试',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      subject: value,
    })
  }

  // 如果设置加载失败，显示默认联系信息
  if (settingsError) {
    console.warn('联系设置加载失败，使用默认值:', settingsError)
  }

  return (
    <div className='min-h-screen bg-gray-50 pt-28 dark:bg-slate-900 sm:pt-32'>
      <Container>
        <div className='mx-auto max-w-6xl py-12'>
          {/* Header */}
          <motion.div
            className='mb-12 text-center'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className='mb-4 text-3xl font-bold text-gray-900 dark:text-white'>联系我们</h1>
            <p className='text-lg text-gray-600 dark:text-gray-300'>
              对产品、技术支持、合作等有任何问题，请与我们联系
            </p>
          </motion.div>

          {/* Main Content Grid */}
          <div className='grid grid-cols-1 gap-8 lg:grid-cols-3'>
            {/* Contact Form - 占2列 */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className='rounded-lg border border-gray-200 bg-white/90 p-8 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90 lg:col-span-2'
            >
              <h2 className='mb-6 text-xl font-bold text-gray-900 dark:text-white'>
                填写联系表单，我们会尽快联系您
              </h2>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
                  <div className='space-y-2'>
                    <Label htmlFor='name'>姓名 *</Label>
                    <Input
                      type='text'
                      id='name'
                      name='name'
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder='称呼'
                    />
                  </div>
                  <div className='space-y-2'>
                    <Label htmlFor='phone'>联系电话 *</Label>
                    <Input
                      type='tel'
                      id='phone'
                      name='phone'
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder='138-0000-0000'
                    />
                  </div>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='email'>邮箱地址</Label>
                  <Input
                    type='email'
                    id='email'
                    name='email'
                    value={formData.email}
                    onChange={handleChange}
                    placeholder='zhang@company.com'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='company'>公司/物业类型</Label>
                  <Input
                    type='text'
                    id='company'
                    name='company'
                    value={formData.company}
                    onChange={handleChange}
                    placeholder='您的公司或物业类型'
                  />
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='subject'>咨询类型 *</Label>
                  <Select value={formData.subject} onValueChange={handleSelectChange} required>
                    <SelectTrigger>
                      <SelectValue placeholder='选择咨询类型' />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value='smart-park'>智慧园区解决方案</SelectItem>
                      <SelectItem value='smart-community'>智慧社区管理</SelectItem>
                      <SelectItem value='fire-safety'>消防安全工程</SelectItem>
                      <SelectItem value='ai-security'>AI智能安防</SelectItem>
                      <SelectItem value='digital-transformation'>数字化转型服务</SelectItem>
                      <SelectItem value='intelligent-operation'>智能运维服务</SelectItem>
                      <SelectItem value='risk-assessment'>风险检测评估</SelectItem>
                      <SelectItem value='integrated-platform'>综合管理平台</SelectItem>
                      <SelectItem value='technical-support'>技术支持服务</SelectItem>
                      <SelectItem value='project-consultation'>项目咨询</SelectItem>
                      <SelectItem value='product-inquiry'>产品咨询</SelectItem>
                      <SelectItem value='partnership'>合作洽谈</SelectItem>
                      <SelectItem value='other'>其他咨询</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className='space-y-2'>
                  <Label htmlFor='message'>详细需求 *</Label>
                  <Textarea
                    id='message'
                    name='message'
                    required
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    placeholder='请描述您的安防需求、物业详情和特殊要求...'
                    className='resize-none'
                  />
                </div>

                {/* 状态消息 */}
                {submitStatus.type && (
                  <div
                    className={`rounded-lg p-4 ${
                      submitStatus.type === 'success'
                        ? 'border border-green-200 bg-green-50 text-green-800'
                        : 'border border-red-200 bg-red-50 text-red-800'
                    }`}
                  >
                    {submitStatus.message}
                  </div>
                )}

                <Button
                  type='submit'
                  size='lg'
                  className='w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700'
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                      提交中...
                    </>
                  ) : (
                    <>
                      提交咨询
                      <Send className='ml-2 h-4 w-4' />
                    </>
                  )}
                </Button>
              </form>
            </motion.div>

            {/* Contact Information - 占1列 */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className='space-y-6'
            >
              {/* 联系方式卡片 */}
              <div className='rounded-lg border border-gray-200 bg-white/90 p-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90'>
                <h2 className='mb-4 text-xl font-bold text-gray-900 dark:text-white'>联系方式</h2>

                {/* 通用联系信息 */}
                <div className='mb-6 space-y-4'>
                  {/* Phone */}
                  <div className='flex items-center space-x-3'>
                    <Phone className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    <div>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>联系电话</p>
                      <p className='text-sm text-gray-600 dark:text-gray-300'>
                        {contactSettings.company_phone || '+86 13816579552'}
                      </p>
                    </div>
                  </div>

                  {/* Email */}
                  <div className='flex items-center space-x-3'>
                    <Mail className='h-5 w-5 text-blue-600 dark:text-blue-400' />
                    <div>
                      <p className='text-sm font-medium text-gray-900 dark:text-white'>企业邮箱</p>
                      <p className='text-sm text-gray-600 dark:text-gray-300'>
                        {contactSettings.company_email || 'zhoujunting@lingangjinghong.com'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* 办公地址 - 紧凑布局 */}
                {!locationsLoading && !locationsError && locations.length > 0 && (
                  <div className='border-t border-gray-200 pt-4 dark:border-slate-600'>
                    <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                      办公地址
                    </h3>
                    <div className='space-y-3'>
                      {locations.map((location, index) => (
                        <div key={location.id} className='flex items-start space-x-3'>
                          <MapPin className='mt-1 h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400' />
                          <div className='min-w-0 flex-1'>
                            <div className='mb-1 flex items-center gap-2'>
                              <p className='truncate text-sm font-medium text-gray-900 dark:text-white'>
                                {location.name}
                              </p>
                              {location.isDefault && (
                                <span className='inline-flex flex-shrink-0 items-center rounded bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-200'>
                                  总部
                                </span>
                              )}
                            </div>
                            <p className='text-xs leading-relaxed text-gray-600 dark:text-gray-300'>
                              {location.address}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 加载状态 */}
                {locationsLoading && (
                  <div className='border-t border-gray-200 pt-4 dark:border-slate-600'>
                    <div className='flex items-center justify-center py-4'>
                      <div className='h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600'></div>
                      <span className='ml-2 text-sm text-gray-600 dark:text-gray-300'>
                        加载地址信息...
                      </span>
                    </div>
                  </div>
                )}

                {/* 错误状态 */}
                {locationsError && (
                  <div className='border-t border-gray-200 pt-4 dark:border-slate-600'>
                    <div className='py-4 text-center'>
                      <p className='text-sm text-red-600 dark:text-red-400'>地址信息加载失败</p>
                    </div>
                  </div>
                )}

                {/* 回退地址信息 */}
                {!locationsLoading && !locationsError && locations.length === 0 && (
                  <div className='border-t border-gray-200 pt-4 dark:border-slate-600'>
                    <h3 className='mb-3 text-lg font-semibold text-gray-900 dark:text-white'>
                      公司地址
                    </h3>
                    <div className='flex items-start space-x-3'>
                      <MapPin className='mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400' />
                      <div>
                        <p className='text-sm font-medium text-gray-900 dark:text-white'>
                          公司总部
                        </p>
                        <p className='text-sm text-gray-600 dark:text-gray-300'>
                          {contactSettings.company_address ||
                            '上海市徐汇区 宜山路508号 景鸿大楼 5楼'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Contact Buttons */}
                <div className='mt-4 grid grid-cols-2 gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full text-xs'
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = 'tel:+8613816579552'
                      }
                    }}
                  >
                    <Phone className='mr-1 h-3 w-3' />
                    立即致电
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='w-full text-xs'
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        window.location.href = 'mailto:zhoujunting@lingangjinghong.com'
                      }
                    }}
                  >
                    <Mail className='mr-1 h-3 w-3' />
                    发送邮件
                  </Button>
                </div>
              </div>

              {/* 二维码卡片 */}
              <div className='rounded-lg border border-gray-200 bg-white/90 p-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/90'>
                <h3 className='mb-4 text-center text-lg font-bold text-gray-900 dark:text-white'>
                  关注我们
                </h3>
                <div className='flex justify-center'>
                  <div className='text-center'>
                    <Image
                      src='/images/QR code.png'
                      alt='临港景鸿二维码'
                      width={96}
                      height={96}
                      className='mx-auto rounded-lg shadow-sm'
                    />
                    <p className='mt-2 text-xs text-gray-600 dark:text-gray-400'>微信公众号</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 公司地图定位 */}
          <motion.div
            className='mt-12'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <CompanyMap markerStyle='modern' />
          </motion.div>

          {/* 安全保障说明 */}
          <motion.div
            className='mt-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className='relative overflow-hidden rounded-lg border border-blue-200 bg-blue-50/50 p-6 backdrop-blur-sm dark:border-blue-800 dark:bg-blue-900/20'>
              {/* 水印背景图片 */}
              <div className='bg-watermark-security-light absolute inset-0' />

              {/* 深色模式下的额外渐变层 */}
              <div className='bg-watermark-security-dark absolute inset-0 hidden dark:block' />

              {/* 内容层 */}
              <div className='relative z-10'>
                <div className='flex items-start space-x-3'>
                  <div className='flex-shrink-0'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-800'>
                      <svg
                        className='h-5 w-5 text-blue-600 dark:text-blue-400'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                        />
                      </svg>
                    </div>
                  </div>
                  <div className='flex-1'>
                    <h3 className='text-lg font-semibold text-blue-900 dark:text-blue-100'>
                      信息安全保障
                    </h3>
                    <div className='mt-2 space-y-2 text-sm text-blue-800 dark:text-blue-200'>
                      <p className='flex items-center'>
                        <span className='mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400'></span>
                        您的个人信息将通过 <strong>HTTPS 加密传输</strong>
                        ，确保数据在传输过程中的安全性
                      </p>
                      <p className='flex items-center'>
                        <span className='mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400'></span>
                        我们采用 <strong>严格的数据验证和过滤机制</strong>，防止恶意攻击和数据泄露
                      </p>
                      <p className='flex items-center'>
                        <span className='mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400'></span>
                        您的联系信息将被 <strong>安全存储</strong>
                        ，仅用于业务沟通，绝不会泄露给第三方
                      </p>
                      <p className='flex items-center'>
                        <span className='mr-2 h-1.5 w-1.5 rounded-full bg-blue-600 dark:bg-blue-400'></span>
                        我们遵循 <strong>数据保护法规</strong>，您有权随时要求删除或修改您的个人信息
                      </p>
                    </div>
                    <div className='mt-3 text-xs text-blue-700 dark:text-blue-300'>
                      如有任何隐私相关问题，请联系我们：
                      <a
                        href='mailto:privacy@lingangjinghong.com'
                        className='ml-1 underline hover:text-blue-900 dark:hover:text-blue-100'
                      >
                        privacy@lingangjinghong.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  )
}
