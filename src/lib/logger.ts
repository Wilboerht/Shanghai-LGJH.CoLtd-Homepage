import { env, isDevelopment } from './env'

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private logLevel: LogLevel

  constructor() {
    this.logLevel = isDevelopment ? LogLevel.DEBUG : LogLevel.INFO
  }

  private formatMessage(entry: LogEntry): string {
    const levelName = LogLevel[entry.level]
    const timestamp = entry.timestamp
    const context = entry.context ? ` ${JSON.stringify(entry.context)}` : ''
    const error = entry.error ? ` Error: ${entry.error.message}\n${entry.error.stack}` : ''

    return `[${timestamp}] ${levelName}: ${entry.message}${context}${error}`
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    if (level > this.logLevel) return

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formattedMessage = this.formatMessage(entry)

    // 在开发环境中使用 console
    if (isDevelopment) {
      switch (level) {
        case LogLevel.ERROR:
          console.error(formattedMessage)
          break
        case LogLevel.WARN:
          console.warn(formattedMessage)
          break
        case LogLevel.INFO:
          console.info(formattedMessage)
          break
        case LogLevel.DEBUG:
          console.debug(formattedMessage)
          break
      }
    }

    // 在生产环境中可以发送到外部日志服务
    // 例如：Sentry, LogRocket, DataDog 等
  }

  error(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  // API 请求日志
  apiRequest(method: string, path: string, userId?: string, duration?: number) {
    this.info('API Request', {
      method,
      path,
      userId,
      duration: duration ? `${duration}ms` : undefined,
    })
  }

  // 数据库操作日志
  dbOperation(operation: string, table: string, duration?: number) {
    this.debug('Database Operation', {
      operation,
      table,
      duration: duration ? `${duration}ms` : undefined,
    })
  }
}

export const logger = new Logger()
