import { useState, useEffect } from 'react'

export interface CompanyLocation {
  id: string
  name: string
  type: string
  address: string
  phone?: string
  email?: string
  longitude?: number
  latitude?: number
  description?: string
  isDefault: boolean
  businessHours?: any
  contactPerson?: string
}

interface UseLocationsResult {
  locations: CompanyLocation[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useLocations(): UseLocationsResult {
  const [locations, setLocations] = useState<CompanyLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchLocations = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/locations?activeOnly=true')
      if (!response.ok) {
        throw new Error('获取地址信息失败')
      }

      const data = await response.json()
      if (data.success) {
        setLocations(data.data)
      } else {
        throw new Error(data.error || '获取地址信息失败')
      }
    } catch (err) {
      console.error('获取地址信息失败:', err)
      setError(err instanceof Error ? err.message : '获取地址信息失败')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLocations()
  }, [])

  return {
    locations,
    loading,
    error,
    refetch: fetchLocations,
  }
}
