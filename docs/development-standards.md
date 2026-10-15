# 开发规范文档

## 概述

本文档定义了临港景鸿网站项目的开发规范，包括代码规范、命名约定、项目结构和最佳实践。

## 代码规范

### 1. TypeScript规范

#### 类型定义

```typescript
// ✅ 推荐：明确的类型定义
interface Product {
  id: string
  title: string
  category: ProductCategory
  status: ProductStatus
  createdAt: Date
}

// ❌ 避免：使用any类型
const data: any = fetchData()

// ✅ 推荐：使用泛型
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(res => res.json())
}
```

#### 接口命名

```typescript
// ✅ 推荐：使用I前缀或描述性名称
interface UserProfile {
  name: string
  email: string
}

// 或者
interface IUserProfile {
  name: string
  email: string
}

// ✅ 推荐：Props接口
interface ProductCardProps {
  product: Product
  onSelect?: (id: string) => void
}
```

### 2. React组件规范

#### 函数组件

```typescript
// ✅ 推荐：函数组件 + TypeScript
interface ButtonProps {
  variant?: 'primary' | 'secondary'
  size?: 'sm' | 'md' | 'lg'
  children: React.ReactNode
  onClick?: () => void
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick
}: ButtonProps) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
```

#### Hooks使用

```typescript
// ✅ 推荐：自定义Hook
function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchProducts()
      .then(setProducts)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, error }
}

// ✅ 推荐：使用useCallback优化性能
const handleSubmit = useCallback(
  (data: FormData) => {
    // 处理提交逻辑
  },
  [dependency]
)
```

### 3. API路由规范

#### 路由处理器

```typescript
// ✅ 推荐：标准API路由结构
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// 请求验证schema
const createProductSchema = z.object({
  title: z.string().min(1).max(100),
  category: z.string(),
  description: z.string().min(10),
})

export async function POST(request: NextRequest) {
  try {
    // 1. 权限验证
    const session = await getServerSession(authOptions)
    if (!session?.user?.isAdmin) {
      return NextResponse.json({ error: '权限不足' }, { status: 403 })
    }

    // 2. 请求验证
    const body = await request.json()
    const validatedData = createProductSchema.parse(body)

    // 3. 业务逻辑
    const product = await prisma.product.create({
      data: validatedData,
    })

    // 4. 返回结果
    return NextResponse.json({
      success: true,
      data: product,
      message: '产品创建成功',
    })
  } catch (error) {
    console.error('创建产品失败:', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: '数据验证失败',
          details: error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        error: '服务器内部错误',
      },
      { status: 500 }
    )
  }
}
```

## 命名约定

### 1. 文件和目录命名

#### 文件命名

```
✅ 推荐：
- page.tsx (Next.js页面)
- route.ts (API路由)
- layout.tsx (布局文件)
- loading.tsx (加载页面)
- error.tsx (错误页面)
- not-found.tsx (404页面)

✅ 组件文件：
- product-card.tsx (kebab-case)
- user-profile.tsx
- admin-layout.tsx

✅ 工具文件：
- auth.ts
- prisma.ts
- utils.ts
- constants.ts
```

#### 目录结构

```
src/
├── app/                    # Next.js App Router
│   ├── (pages)/           # 页面分组
│   ├── admin/             # 管理后台
│   └── api/               # API路由
├── components/            # React组件
│   ├── ui/                # 基础UI组件
│   ├── layout/            # 布局组件
│   ├── sections/          # 页面区块
│   └── admin/             # 管理后台组件
├── lib/                   # 工具库
├── types/                 # 类型定义
├── hooks/                 # 自定义Hooks
├── utils/                 # 工具函数
└── styles/                # 样式文件
```

### 2. 变量和函数命名

#### 变量命名

```typescript
// ✅ 推荐：camelCase
const userName = 'john'
const isLoading = true
const productList = []

// ✅ 推荐：常量使用UPPER_CASE
const API_BASE_URL = 'https://api.example.com'
const MAX_FILE_SIZE = 1024 * 1024 * 10 // 10MB

// ✅ 推荐：布尔值使用is/has/can前缀
const isVisible = true
const hasPermission = false
const canEdit = true
```

#### 函数命名

```typescript
// ✅ 推荐：动词开头，描述性命名
function fetchProducts() {}
function createUser() {}
function validateEmail() {}
function handleSubmit() {}

// ✅ 推荐：事件处理器使用handle前缀
const handleClick = () => {}
const handleChange = () => {}
const handleSubmit = () => {}

// ✅ 推荐：异步函数明确标识
async function fetchUserData() {}
async function saveProduct() {}
```

### 3. 组件命名

#### React组件

```typescript
// ✅ 推荐：PascalCase
export function ProductCard() {}
export function UserProfile() {}
export function AdminLayout() {}

// ✅ 推荐：页面组件
export default function ProductsPage() {}
export default function AdminDashboard() {}

// ✅ 推荐：HOC组件
export function withAuth<T>(Component: React.ComponentType<T>) {}
```

## 项目结构规范

### 1. 组件组织

#### 基础UI组件 (`src/components/ui/`)

```
ui/
├── button.tsx
├── input.tsx
├── card.tsx
├── modal.tsx
├── table.tsx
└── index.ts          # 统一导出
```

#### 业务组件 (`src/components/`)

```
components/
├── products/
│   ├── product-card.tsx
│   ├── product-list.tsx
│   └── product-form.tsx
├── admin/
│   ├── admin-header.tsx
│   ├── admin-sidebar.tsx
│   └── admin-layout.tsx
└── layout/
    ├── header.tsx
    ├── footer.tsx
    └── main-layout.tsx
```

### 2. 类型定义组织

#### 类型文件 (`src/types/`)

```typescript
// types/index.ts - 主要类型导出
export * from './product'
export * from './user'
export * from './api'

// types/product.ts - 产品相关类型
export interface Product {
  id: string
  title: string
  category: ProductCategory
}

export type ProductCategory = '智能数字化产品' | 'AI智能设计' | '智能医疗'

// types/api.ts - API相关类型
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
```

### 3. 工具函数组织

#### 工具库 (`src/lib/` 和 `src/utils/`)

```typescript
// lib/ - 核心库文件
lib/
├── auth.ts           # 认证配置
├── prisma.ts         # 数据库连接
├── utils.ts          # 通用工具
└── constants.ts      # 常量定义

// utils/ - 工具函数
utils/
├── format.ts         # 格式化函数
├── validation.ts     # 验证函数
├── api.ts           # API工具
└── file.ts          # 文件处理
```

## 样式规范

### 1. Tailwind CSS使用

#### 组件样式

```typescript
// ✅ 推荐：使用cn工具函数合并类名
import { cn } from '@/lib/utils'

interface ButtonProps {
  variant?: 'primary' | 'secondary'
  className?: string
}

export function Button({ variant = 'primary', className, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        // 基础样式
        'px-4 py-2 rounded-md font-medium transition-colors',
        // 变体样式
        {
          'bg-blue-600 text-white hover:bg-blue-700': variant === 'primary',
          'bg-gray-200 text-gray-900 hover:bg-gray-300': variant === 'secondary',
        },
        // 自定义样式
        className
      )}
      {...props}
    />
  )
}
```

#### 响应式设计

```typescript
// ✅ 推荐：移动优先的响应式设计
<div className="
  grid grid-cols-1 gap-4
  md:grid-cols-2 md:gap-6
  lg:grid-cols-3 lg:gap-8
">
  {/* 内容 */}
</div>
```

### 2. CSS模块使用

#### 特殊样式文件

```css
/* styles/components/hero.module.css */
.hero {
  @apply relative flex min-h-screen items-center justify-center;
}

.heroBackground {
  @apply absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700;
}

.heroContent {
  @apply relative z-10 text-center text-white;
}
```

## 错误处理规范

### 1. 前端错误处理

#### 错误边界

```typescript
// components/error-boundary.tsx
import React from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              出现了一些问题
            </h2>
            <p className="text-gray-600 mb-4">
              页面加载时发生错误，请刷新页面重试。
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              刷新页面
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 2. API错误处理

#### 统一错误处理

```typescript
// lib/api-client.ts
export class ApiError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiRequest<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new ApiError(
        response.status,
        errorData.code || 'UNKNOWN_ERROR',
        errorData.message || '请求失败'
      )
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, 'NETWORK_ERROR', '网络请求失败')
  }
}
```

## 测试规范

### 1. 单元测试

#### 组件测试

```typescript
// __tests__/components/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)

    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('applies correct variant styles', () => {
    render(<Button variant="secondary">Secondary</Button>)
    const button = screen.getByText('Secondary')
    expect(button).toHaveClass('bg-gray-200')
  })
})
```

#### API测试

```typescript
// __tests__/api/products.test.ts
import { GET } from '@/app/api/products/route'
import { NextRequest } from 'next/server'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}))

describe('/api/products', () => {
  it('returns products list', async () => {
    const mockProducts = [{ id: '1', title: 'Test Product', category: '智能数字化产品' }]

    ;(prisma.product.findMany as jest.Mock).mockResolvedValue(mockProducts)

    const request = new NextRequest('http://localhost/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockProducts)
  })
})
```

### 2. 集成测试

#### E2E测试

```typescript
// tests/e2e/products.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Products Page', () => {
  test('should display products list', async ({ page }) => {
    await page.goto('/products')

    // 检查页面标题
    await expect(page.locator('h1')).toContainText('产品服务')

    // 检查产品卡片
    const productCards = page.locator('[data-testid="product-card"]')
    await expect(productCards).toHaveCount(6)

    // 检查分类筛选
    await page.click('[data-testid="category-智能数字化产品"]')
    await expect(page.url()).toContain('category=智能数字化产品')
  })

  test('should navigate to product detail', async ({ page }) => {
    await page.goto('/products')

    // 点击第一个产品
    await page.click('[data-testid="product-card"]:first-child')

    // 检查是否跳转到详情页
    await expect(page.url()).toMatch(/\/products\/[\w-]+/)
    await expect(page.locator('h1')).toBeVisible()
  })
})
```

---

**创建时间**: 2025-09-23
**维护者**: 开发团队
**版本**: 1.0.0
