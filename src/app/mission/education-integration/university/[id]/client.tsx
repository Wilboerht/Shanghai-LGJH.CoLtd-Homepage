'use client'

import React from 'react'
import { Container } from '@/components/ui/container'

interface UniversityDetailClientProps {
  data: {
    university: any
    module: any
  }
}

export default function UniversityDetailClient({ data }: UniversityDetailClientProps) {
  const { university } = data

  return (
    <div className='min-h-screen bg-white pt-20'>
      <Container className='py-8'>
        <div className='mx-auto max-w-4xl'>
          {university && university.content && (
            <div
              className='prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: university.content }}
            />
          )}
          {(!university || !university.content) && (
            <div className='py-8 text-center text-gray-500'>
              <p>暂无内容</p>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
