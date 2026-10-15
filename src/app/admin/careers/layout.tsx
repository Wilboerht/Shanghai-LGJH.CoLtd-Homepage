'use client'

import React from 'react'
import { AdminLayout } from '@/components/admin/layout/admin-layout'

interface CareersLayoutProps {
  children: React.ReactNode
}

export default function CareersLayout({ children }: CareersLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>
}
