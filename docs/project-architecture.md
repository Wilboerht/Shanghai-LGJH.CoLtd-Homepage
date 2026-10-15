# 项目架构文档

## 项目概述

临港景鸿企业网站 - 基于Next.js 15的现代化企业官网，包含产品展示、解决方案、服务介绍、招聘管理等功能。

## 技术栈

### 前端技术

- **框架**: Next.js 15 (App Router)
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **UI组件**: Radix UI + 自定义组件
- **状态管理**: React Context + Zustand
- **表单**: React Hook Form + Zod验证
- **动画**: Framer Motion
- **图标**: Lucide React

### 后端技术

- **API**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js
- **文件上传**: 本地存储 + 水印处理
- **缓存**: Next.js内置缓存 + Redis(可选)

### 开发工具

- **包管理**: npm
- **代码规范**: ESLint + Prettier
- **类型检查**: TypeScript
- **测试**: Jest + Playwright
- **构建**: Next.js内置构建

## 项目结构

```
LGJH1/
├── src/
│   ├── app/                    # Next.js App Router页面
│   │   ├── (pages)/           # 前台页面
│   │   ├── admin/             # 管理后台
│   │   └── api/               # API路由
│   ├── components/            # React组件
│   │   ├── admin/             # 管理后台组件
│   │   ├── layout/            # 布局组件
│   │   ├── sections/          # 页面区块组件
│   │   └── ui/                # 基础UI组件
│   ├── lib/                   # 工具库
│   │   ├── auth.ts            # 认证配置
│   │   ├── prisma.ts          # 数据库连接
│   │   └── utils.ts           # 工具函数
│   ├── types/                 # TypeScript类型定义
│   └── styles/                # 样式文件
├── prisma/                    # 数据库相关
│   ├── schema.prisma          # 数据库模型
│   ├── migrations/            # 数据库迁移
│   └── seed.ts                # 数据种子
├── public/                    # 静态资源
│   ├── uploads/               # 上传文件
│   └── images/                # 图片资源
├── docs/                      # 项目文档
├── deployment/                # 部署配置
└── tests/                     # 测试文件
```

## 核心模块

### 1. 认证系统

- **位置**: `src/lib/auth.ts`
- **功能**: 管理员登录、会话管理、权限控制
- **技术**: NextAuth.js + Credentials Provider

### 2. 数据库层

- **位置**: `src/lib/prisma.ts`
- **ORM**: Prisma
- **数据库**: PostgreSQL
- **主要模型**: Product, Solution, Service, User, JobPosition等

### 3. 文件上传

- **位置**: `src/lib/image-watermark.ts`
- **功能**: 图片上传、水印添加、文件管理
- **存储**: 本地文件系统 (`public/uploads/`)

### 4. 内容管理

- **产品管理**: 产品CRUD、分类管理、状态控制
- **解决方案**: 方案展示、分类筛选
- **服务管理**: 服务介绍、动态路由
- **招聘系统**: 职位发布、简历管理

## 数据流架构

```
用户请求 → Next.js路由 → API处理 → Prisma ORM → PostgreSQL
                    ↓
              组件渲染 ← 数据返回 ← 业务逻辑处理
```

## 部署架构

### 开发环境

- **本地开发**: `npm run dev`
- **数据库**: 本地PostgreSQL或SQLite
- **文件存储**: 本地文件系统

### 生产环境

- **容器化**: Docker + docker-compose
- **反向代理**: Nginx
- **数据库**: PostgreSQL
- **文件存储**: 本地挂载卷

## 安全措施

### 认证安全

- 密码bcrypt加密
- JWT会话管理
- CSRF保护
- 权限中间件

### 文件安全

- 文件类型验证
- 大小限制
- 路径遍历防护
- 水印保护

### API安全

- 输入验证(Zod)
- SQL注入防护(Prisma)
- XSS防护
- 速率限制

## 性能优化

### 前端优化

- 静态生成(SSG)
- 增量静态再生(ISR)
- 图片优化(Next.js Image)
- 代码分割
- 预加载

### 后端优化

- 数据库索引
- 查询优化
- 缓存策略
- 连接池

## 监控和日志

### 错误监控

- 控制台日志
- 错误边界
- API错误处理

### 性能监控

- Next.js内置分析
- 数据库查询监控
- 文件上传监控

## 关键配置文件

### 1. Next.js配置 (`next.config.ts`)

```typescript
const nextConfig = {
  output: 'standalone',  // Docker部署
  images: { ... },       // 图片优化
  rewrites: { ... }      # 路由重写
}
```

### 2. 数据库配置 (`prisma/schema.prisma`)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. 认证配置 (`src/lib/auth.ts`)

```typescript
export const authOptions: NextAuthOptions = {
  providers: [CredentialsProvider],
  callbacks: { ... },
  pages: { signIn: '/admin/login' }
}
```

## 环境变量

### 必需变量

```bash
DATABASE_URL=           # 数据库连接
NEXTAUTH_URL=          # 应用URL
NEXTAUTH_SECRET=       # 认证密钥
ADMIN_EMAIL=           # 管理员邮箱
ADMIN_PASSWORD=        # 管理员密码
```

### 可选变量

```bash
REDIS_URL=             # Redis缓存
SMTP_HOST=             # 邮件服务
GOOGLE_ANALYTICS_ID=   # 分析工具
```

## 常见问题

### 1. 数据库连接问题

- 检查DATABASE_URL配置
- 确认数据库服务运行
- 验证网络连接

### 2. 文件上传失败

- 检查uploads目录权限
- 验证文件大小限制
- 确认文件类型支持

### 3. 认证问题

- 检查NEXTAUTH配置
- 验证管理员账户
- 确认会话配置

## 维护指南

### 日常维护

- 定期备份数据库
- 清理上传文件
- 监控系统日志
- 更新依赖包

### 故障处理

- 查看错误日志
- 检查系统资源
- 验证配置文件
- 重启相关服务

---

**创建时间**: 2025-09-23
**维护者**: 开发团队
**版本**: 1.0.0
