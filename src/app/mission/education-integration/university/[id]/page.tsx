import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import UniversityDetailClient from './client'

interface UniversityDetailPageProps {
  params: Promise<{
    id: string
  }>
}

async function getUniversityData(id: string) {
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

    // 查找指定的合作院校
    const universities = data.universities || []
    const university = universities.find((item: any) => item.id === id)

    if (!university) {
      return null
    }

    return {
      university,
      module: data.module,
    }
  } catch (error) {
    console.error('Error fetching university data:', error)
    return null
  }
}

export async function generateMetadata({ params }: UniversityDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const data = await getUniversityData(id)

  if (!data) {
    return {
      title: '院校详情 - 产教融合',
      description: '查看合作院校详细信息',
    }
  }

  return {
    title: `${data.university.title} - 合作院校详情`,
    description: data.university.description || '查看合作院校详细信息',
    openGraph: {
      title: `${data.university.title} - 合作院校详情`,
      description: data.university.description || '查看合作院校详细信息',
      type: 'article',
    },
  }
}

export default async function UniversityDetailPage({ params }: UniversityDetailPageProps) {
  const { id } = await params
  const data = await getUniversityData(id)

  if (!data) {
    notFound()
  }

  return <UniversityDetailClient data={data} />
}
