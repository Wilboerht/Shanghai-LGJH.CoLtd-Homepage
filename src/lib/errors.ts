import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { Prisma } from '@prisma/client'

// 自定义错误类型
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400, 'VALIDATION_ERROR')
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 404, 'NOT_FOUND')
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED')
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN')
  }
}

// 错误处理函数
export function handleApiError(error: unknown): NextResponse {
  console.error('API Error:', error)

  // Zod 验证错误
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        error: 'Validation failed',
        details: error.issues,
      },
      { status: 400 }
    )
  }

  // Prisma 错误
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        return NextResponse.json(
          { error: 'A record with this data already exists' },
          { status: 409 }
        )
      case 'P2025':
        return NextResponse.json({ error: 'Record not found' }, { status: 404 })
      default:
        return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }
  }

  // 自定义应用错误
  if (error instanceof AppError) {
    return NextResponse.json(
      { error: error.message, code: error.code },
      { status: error.statusCode }
    )
  }

  // 未知错误
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
}

// 异步错误包装器
export function asyncHandler<T extends any[], R>(fn: (...args: T) => Promise<R>) {
  return (...args: T): Promise<R> => {
    return Promise.resolve(fn(...args)).catch(error => {
      throw error
    })
  }
}
