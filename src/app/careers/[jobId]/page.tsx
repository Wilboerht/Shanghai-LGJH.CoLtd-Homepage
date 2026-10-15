'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Clock,
  DollarSign,
  Briefcase,
  Users,
  CheckCircle,
  Star,
  Flame,
  Send,
} from 'lucide-react'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import Link from 'next/link'

// 职位数据类型
interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: string
  experience: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  isHot?: boolean
  isUrgent?: boolean
  createdAt: string
  updatedAt: string
}

// 招聘流程数据
const recruitmentProcess = [
  {
    step: 1,
    title: '简历筛选',
    description: '我们会仔细审阅您的简历，通常在3个工作日内给出反馈',
    duration: '1-3天',
  },
  {
    step: 2,
    title: '初步面试',
    description: 'HR或部门负责人进行初步沟通，了解基本情况和意向',
    duration: '30-45分钟',
  },
  {
    step: 3,
    title: '技术面试',
    description: '技术专家进行专业能力评估和技术交流',
    duration: '60-90分钟',
  },
  {
    step: 4,
    title: '终面确认',
    description: '部门负责人最终面试，确认岗位匹配度',
    duration: '30-60分钟',
  },
  {
    step: 5,
    title: '发放Offer',
    description: '确认录用后，我们会尽快发放正式Offer',
    duration: '1-2天',
  },
]

export default function JobDetailPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = params.jobId as string

  // 状态管理
  const [job, setJob] = React.useState<JobPosition | null>(null)
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  // 获取职位数据
  React.useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/careers/${jobId}`)
        if (!response.ok) {
          if (response.status === 404) {
            setError('职位不存在')
          } else {
            setError('获取职位信息失败')
          }
          return
        }
        const jobData = await response.json()
        setJob(jobData)
      } catch (error) {
        console.error('获取职位信息失败:', error)
        setError('获取职位信息失败')
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJob()
    }
  }, [jobId])

  // 申请表单状态
  const [formData, setFormData] = React.useState({
    applicantName: '',
    email: '',
    phone: '',
    introduction: '',
  })
  const [resumeFile, setResumeFile] = React.useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [submitStatus, setSubmitStatus] = React.useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('jobId', jobId)
      formDataToSend.append('applicantName', formData.applicantName)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('phone', formData.phone)
      formDataToSend.append('introduction', formData.introduction)

      if (resumeFile) {
        formDataToSend.append('resume', resumeFile)
      }

      const response = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formDataToSend,
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus({
          type: 'success',
          message: result.message || '申请提交成功！我们会尽快联系您。',
        })
        // 清空表单
        setFormData({
          applicantName: '',
          email: '',
          phone: '',
          introduction: '',
        })
        setResumeFile(null)
      } else {
        setSubmitStatus({
          type: 'error',
          message: result.message || '提交失败，请稍后重试',
        })
      }
    } catch (error) {
      console.error('申请提交错误:', error)
      setSubmitStatus({
        type: 'error',
        message: '网络错误，请检查网络连接后重试',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <div className='mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
          <p className='text-gray-600'>加载中...</p>
        </div>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className='flex min-h-screen items-center justify-center bg-white'>
        <div className='text-center'>
          <h1 className='mb-4 text-2xl font-bold text-gray-900'>{error || '职位不存在'}</h1>
          <p className='mb-6 text-gray-600'>
            {error === '职位不存在'
              ? '抱歉，您访问的职位可能已被删除或不存在。'
              : '抱歉，获取职位信息时出现错误。'}
          </p>
          <div className='flex justify-center gap-4'>
            <Link href='/careers'>
              <Button>
                <ArrowLeft className='mr-2 h-4 w-4' />
                返回职位列表
              </Button>
            </Link>
            {error && error !== '职位不存在' && (
              <Button variant='outline' onClick={() => window.location.reload()}>
                重新加载
              </Button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-white'>
      {/* Header */}
      <section className='bg-gray-50 pb-8 pt-32 md:pb-12 md:pt-40'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Link
                href='/careers'
                className='mb-6 inline-flex items-center text-slate-600 hover:text-slate-900'
              >
                <ArrowLeft className='mr-2 h-4 w-4' />
                返回招聘页面
              </Link>

              <div className='mb-4 flex items-center gap-3'>
                <h1 className='font-noto-serif-sc text-3xl font-light text-gray-900 md:text-4xl'>
                  {job.title}
                </h1>
                <Badge variant='secondary'>{job.department}</Badge>
                {job.isHot && (
                  <Badge variant='destructive' className='bg-red-500'>
                    <Flame className='mr-1 h-3 w-3' />
                    热门
                  </Badge>
                )}
                {job.isUrgent && (
                  <Badge variant='destructive' className='bg-orange-500'>
                    <Star className='mr-1 h-3 w-3' />
                    急招
                  </Badge>
                )}
              </div>

              <div className='mb-6 flex flex-wrap items-center gap-6 text-gray-600'>
                <div className='flex items-center'>
                  <MapPin className='mr-2 h-4 w-4' />
                  {job.location}
                </div>
                <div className='flex items-center'>
                  <Clock className='mr-2 h-4 w-4' />
                  {job.type}
                </div>
                <div className='flex items-center'>
                  <Briefcase className='mr-2 h-4 w-4' />
                  {job.experience}
                </div>
                <div className='flex items-center'>
                  <DollarSign className='mr-2 h-4 w-4' />
                  {job.salary}
                </div>
              </div>

              <p className='text-lg leading-relaxed text-gray-700'>{job.description}</p>
            </motion.div>
          </div>
        </Container>
      </section>

      {/* Job Details */}
      <section className='py-16 md:py-20'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <div className='grid grid-cols-1 gap-12 lg:grid-cols-3'>
              {/* Main Content */}
              <div className='space-y-8 lg:col-span-2'>
                {/* Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className='mb-4 font-noto-serif-sc text-2xl font-medium text-gray-900'>
                    职位要求
                  </h2>
                  <ul className='space-y-3'>
                    {job.requirements.map((req, index) => (
                      <li key={index} className='flex items-start'>
                        <CheckCircle className='mr-3 mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600' />
                        <span className='text-gray-700'>{req}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>

                {/* Benefits */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <h2 className='mb-4 font-noto-serif-sc text-2xl font-medium text-gray-900'>
                    福利待遇
                  </h2>
                  <div className='flex flex-wrap gap-2'>
                    {job.benefits.map((benefit, index) => (
                      <Badge key={index} variant='outline' className='text-sm'>
                        {benefit}
                      </Badge>
                    ))}
                  </div>
                </motion.div>

                {/* Tags */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h2 className='mb-4 font-noto-serif-sc text-2xl font-medium text-gray-900'>
                    技能标签
                  </h2>
                  <div className='flex flex-wrap gap-2'>
                    {job.tags.map((tag, index) => (
                      <Badge key={index} variant='secondary' className='text-sm'>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className='lg:col-span-1'>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className='sticky top-8 rounded-lg bg-gray-50 p-6'
                >
                  <h3 className='mb-4 font-noto-serif-sc text-xl font-medium text-gray-900'>
                    申请此职位
                  </h3>
                  <p className='mb-6 text-gray-600'>
                    对这个职位感兴趣？请填写下面的信息，我们会尽快与您联系。
                  </p>

                  <form onSubmit={handleSubmit} className='space-y-4'>
                    {/* 状态消息 */}
                    {submitStatus.type && (
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          submitStatus.type === 'success'
                            ? 'border border-green-200 bg-green-50 text-green-800'
                            : 'border border-red-200 bg-red-50 text-red-800'
                        }`}
                      >
                        {submitStatus.message}
                      </div>
                    )}

                    <div>
                      <Input
                        name='applicantName'
                        value={formData.applicantName}
                        onChange={handleInputChange}
                        placeholder='您的姓名'
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Input
                        name='email'
                        type='email'
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder='邮箱地址'
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Input
                        name='phone'
                        type='tel'
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder='联系电话'
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <Textarea
                        name='introduction'
                        value={formData.introduction}
                        onChange={handleInputChange}
                        placeholder='简单介绍一下您的背景和为什么对这个职位感兴趣...'
                        rows={4}
                        disabled={isSubmitting}
                      />
                    </div>
                    <div>
                      <label className='mb-2 block text-sm font-medium text-gray-700'>
                        上传简历 (可选)
                      </label>
                      <Input
                        type='file'
                        accept='.pdf,.doc,.docx'
                        onChange={handleFileChange}
                        disabled={isSubmitting}
                        className='file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100'
                      />
                      <p className='mt-1 text-xs text-gray-500'>支持PDF、Word格式，最大10MB</p>
                    </div>
                    <Button
                      type='submit'
                      className='w-full bg-slate-600 hover:bg-slate-700'
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className='mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white'></div>
                          提交中...
                        </>
                      ) : (
                        <>
                          提交申请
                          <Send className='ml-2 h-4 w-4' />
                        </>
                      )}
                    </Button>
                  </form>

                  <div className='mt-6 border-t border-gray-200 pt-6'>
                    <p className='mb-2 text-sm text-gray-500'>或者发送简历至：</p>
                    <p className='text-sm font-medium text-gray-900'>hr@lgjh.com</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Recruitment Process */}
      <section className='bg-gray-50 py-16 md:py-20'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className='mb-12 text-center'
            >
              <h2 className='mb-4 font-noto-serif-sc text-3xl font-light text-gray-900'>
                招聘流程
              </h2>
              <p className='text-lg text-gray-600'>了解我们的招聘流程，为面试做好准备</p>
            </motion.div>

            <div className='space-y-6'>
              {recruitmentProcess.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className='flex items-center rounded-lg bg-white p-6 shadow-sm'
                >
                  <div className='mr-6 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-slate-600 font-medium text-white'>
                    {step.step}
                  </div>
                  <div>
                    <h3 className='mb-1 text-lg font-medium text-gray-900'>{step.title}</h3>
                    <p className='text-gray-600'>{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className='py-16 md:py-20'>
        <Container>
          <div className='mx-auto max-w-4xl text-center'>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className='mb-6 font-noto-serif-sc text-3xl font-light text-gray-900'>
                准备好加入我们了吗？
              </h2>
              <p className='mb-8 text-lg text-gray-600'>我们期待与您一起创造更美好的未来</p>
              <div className='flex flex-col justify-center gap-4 sm:flex-row'>
                <Button size='lg' className='bg-slate-600 hover:bg-slate-700'>
                  立即申请
                  <ArrowRight className='ml-2 h-4 w-4' />
                </Button>
                <Link href='/careers'>
                  <Button size='lg' variant='outline'>
                    查看其他职位
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}
