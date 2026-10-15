'use client'

import React from 'react'
import { Container } from '@/components/ui/container'

interface CaseDetailClientProps {
  data: {
    case: any
    module: any
  }
}

export default function CaseDetailClient({ data }: CaseDetailClientProps) {
  const { case: caseData } = data

  return (
    <div className='min-h-screen bg-white pt-20'>
      <Container className='py-8'>
        <div className='mx-auto max-w-4xl'>
          {caseData.content && (
            <div
              className='prose prose-sm max-w-none'
              dangerouslySetInnerHTML={{ __html: caseData.content }}
            />
          )}
        </div>
      </Container>
    </div>
  )
}
