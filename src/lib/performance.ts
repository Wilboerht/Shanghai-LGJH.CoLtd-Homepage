import { logger } from './logger'

// 性能计时器
export class PerformanceTimer {
  private startTime: number
  private name: string

  constructor(name: string) {
    this.name = name
    this.startTime = performance.now()
  }

  end(): number {
    const duration = performance.now() - this.startTime
    logger.debug(`Performance: ${this.name}`, { duration: `${duration.toFixed(2)}ms` })
    return duration
  }
}

// 性能监控装饰器
export function measurePerformance(name?: string) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value
    const methodName = name || `${target.constructor.name}.${propertyKey}`

    descriptor.value = async function (...args: any[]) {
      const timer = new PerformanceTimer(methodName)
      try {
        const result = await originalMethod.apply(this, args)
        timer.end()
        return result
      } catch (error) {
        timer.end()
        throw error
      }
    }

    return descriptor
  }
}

// Web Vitals 监控
export function reportWebVitals(metric: any) {
  if (typeof window !== 'undefined') {
    logger.info('Web Vitals', {
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
    })

    // 发送到分析服务
    if (process.env.NEXT_PUBLIC_GA_ID) {
      // Google Analytics 4
      gtag('event', metric.name, {
        custom_map: { metric_id: 'custom_metric' },
        custom_metric: metric.value,
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      })
    }
  }
}

// 声明 gtag 函数
declare global {
  function gtag(...args: any[]): void
}

// 缓存工具
export class SimpleCache<T> {
  private cache = new Map<string, { value: T; expiry: number }>()

  set(key: string, value: T, ttlMs: number = 5 * 60 * 1000): void {
    const expiry = Date.now() + ttlMs
    this.cache.set(key, { value, expiry })
  }

  get(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  delete(key: string): boolean {
    return this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }

    timeoutId = setTimeout(() => {
      func(...args)
    }, waitMs)
  }
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limitMs: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limitMs)
    }
  }
}
