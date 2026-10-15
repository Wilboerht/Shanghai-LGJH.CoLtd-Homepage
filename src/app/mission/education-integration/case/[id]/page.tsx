import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import CaseDetailClient from './client'

interface CaseDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getCaseData(id: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/mission/industry-education`,
      {
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch data')
    }

    const data = await response.json()

    // 查找指定的成功案例
    const cases = data.successCases || []
    const case_ = cases.find((item: any) => item.id === id)

    if (!case_) {
      return null
    }

    return {
      case: case_,
      module: data.module,
    }
  } catch (error) {
    console.error('Error fetching case data:', error)
    return null
  }
}

export async function generateMetadata({ params }: CaseDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getCaseData(id)

  if (!data) {
    return {
      title: '案例详情 - 产教融合',
      description: '查看成功案例详细信息',
    }
  }

  return {
    title: `${data.case.title} - 成功案例详情`,
    description: data.case.description || '查看成功案例详细信息',
    openGraph: {
      title: `${data.case.title} - 成功案例详情`,
      description: data.case.description || '查看成功案例详细信息',
      type: 'article',
      images: data.case.image ? [{ url: data.case.image }] : undefined,
    },
  }
}

export default async function CaseDetailPage({ params }: CaseDetailPageProps) {
  const { id } = await params
  const data = await getCaseData(id)

  if (!data) {
    notFound()
  }

  return <CaseDetailClient data={data} />
}
