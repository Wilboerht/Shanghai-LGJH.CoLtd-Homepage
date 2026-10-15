# 数据库设计文档

## 概述

本文档描述了临港景鸿项目的数据库设计，包括表结构、关系、索引和约束。

## 数据库信息

- **数据库类型**: PostgreSQL
- **ORM**: Prisma
- **字符集**: UTF-8
- **时区**: UTC

## 核心数据模型

### 1. 用户管理 (User)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String
  isAdmin   Boolean  @default(false)
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // 关联关系
  processedApplications JobApplication[] @relation("ProcessedBy")

  @@map("users")
}
```

**字段说明:**

- `id`: 主键，使用CUID
- `email`: 邮箱，唯一索引
- `isAdmin`: 管理员标识
- `avatar`: 头像URL

### 2. 产品管理 (Product)

```prisma
model Product {
  id             String        @id @default(cuid())
  title          String
  subtitle       String?
  description    String
  content        String?       // 富文本内容
  category       String
  features       String[]      // 产品特性
  specifications Json?         // 技术规格
  applications   String[]      // 应用场景
  benefits       String[]      // 产品优势
  image          String?       // 主图
  images         String[]      // 多图
  status         ProductStatus @default(DRAFT)
  slug           String        @unique
  tags           String[]
  gradient       String?       // 渐变色
  accentColor    String?       // 主色调
  displayOrder   Int?          // 显示顺序
  isActive       Boolean       @default(true)
  createdAt      DateTime      @default(now())
  updatedAt      DateTime      @updatedAt

  @@map("products")
}

enum ProductStatus {
  DRAFT
  AVAILABLE
  COMING_SOON
  DISCONTINUED
}
```

### 3. 解决方案 (Solution)

```prisma
model Solution {
  id           String   @id @default(cuid())
  title        String
  subtitle     String?
  description  String
  content      String?  // 富文本内容
  category     String
  features     String[]
  applications String[]
  metrics      Json?    // 效果指标
  technologies String[] // 技术栈
  benefits     String[]
  image        String?
  slug         String   @unique
  gradient     String?
  accentColor  String?
  displayOrder Int?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("solutions")
}
```

### 4. 服务管理 (Service)

```prisma
model Service {
  id           String        @id @default(cuid())
  title        String
  subtitle     String?
  description  String
  content      String?       // 富文本内容
  category     String
  features     String[]
  process      Json?         // 服务流程
  benefits     String[]
  image        String?
  slug         String        @unique
  status       ServiceStatus @default(DRAFT)
  displayOrder Int?
  isActive     Boolean       @default(true)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt

  @@map("services")
}

enum ServiceStatus {
  DRAFT
  PUBLISHED
  ARCHIVED
}
```

### 5. 招聘管理

#### 职位表 (JobPosition)

```prisma
model JobPosition {
  id           String              @id @default(cuid())
  title        String
  department   String
  location     String
  type         String              // 全职/兼职/实习
  experience   String              // 经验要求
  salary       String?             // 薪资范围
  description  String
  requirements String[]            // 职位要求
  benefits     String[]            // 福利待遇
  tags         String[]
  isHot        Boolean             @default(false)
  isUrgent     Boolean             @default(false)
  status       JobPositionStatus   @default(draft)
  displayOrder Int?
  createdAt    DateTime            @default(now())
  updatedAt    DateTime            @updatedAt

  // 关联关系
  applications JobApplication[]

  @@map("job_positions")
}

enum JobPositionStatus {
  draft
  published
  archived
}
```

#### 求职申请 (JobApplication)

```prisma
model JobApplication {
  id             String                 @id @default(cuid())
  jobId          String
  applicantName  String
  email          String
  phone          String?
  resumeUrl      String?                // 简历文件URL
  introduction   String?                // 自我介绍
  status         JobApplicationStatus   @default(pending)
  processedBy    String?                // 处理人ID
  processedAt    DateTime?              // 处理时间
  notes          String?                // 处理备注
  createdAt      DateTime               @default(now())
  updatedAt      DateTime               @updatedAt

  // 关联关系
  job       JobPosition @relation(fields: [jobId], references: [id], onDelete: Cascade)
  processor User?       @relation("ProcessedBy", fields: [processedBy], references: [id])

  @@map("job_applications")
}

enum JobApplicationStatus {
  pending
  reviewing
  interviewed
  accepted
  rejected
}
```

### 6. 内容管理

#### 客户案例 (ClientCase)

```prisma
model ClientCase {
  id           String   @id @default(cuid())
  name         String   // 客户名称
  logo         String?  // 客户Logo
  logoText     String?  // Logo文字
  logoColor    String?  // Logo颜色
  industry     String   // 行业
  title        String   // 案例标题
  description  String   // 案例描述
  image        String?  // 案例图片
  metrics      Json?    // 效果指标
  tags         String[]
  displayOrder Int?
  isActive     Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt

  @@map("client_cases")
}
```

#### 合作伙伴 (Partner)

```prisma
model Partner {
  id           String      @id @default(cuid())
  name         String
  logo         String?
  logoText     String?
  logoColor    String?
  website      String?
  description  String?
  type         PartnerType @default(STRATEGIC)
  displayOrder Int?
  isActive     Boolean     @default(true)
  createdAt    DateTime    @default(now())
  updatedAt    DateTime    @updatedAt

  @@map("partners")
}

enum PartnerType {
  STRATEGIC    // 战略合作伙伴
  TECHNOLOGY   // 技术合作伙伴
  CHANNEL      // 渠道合作伙伴
  SUPPLIER     // 供应商
}
```

### 7. 系统配置

#### 网站配置 (SiteConfig)

```prisma
model SiteConfig {
  id          String   @id @default(cuid())
  key         String   @unique
  value       String   // JSON字符串
  category    String?  // 配置分类
  description String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("site_configs")
}
```

#### 通知管理 (Notification)

```prisma
model Notification {
  id        String             @id @default(cuid())
  title     String
  content   String
  type      NotificationType   @default(INFO)
  isRead    Boolean            @default(false)
  userId    String?            // 接收用户ID
  createdAt DateTime           @default(now())
  updatedAt DateTime           @updatedAt

  @@map("notifications")
}

enum NotificationType {
  INFO
  WARNING
  ERROR
  SUCCESS
}
```

## 数据库关系图

```
User (1) -----> (N) JobApplication
JobPosition (1) -> (N) JobApplication
User (1) -----> (N) Notification
```

## 索引策略

### 主要索引

```sql
-- 用户表
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_admin ON users(is_admin);

-- 产品表
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_is_active ON products(is_active);

-- 解决方案表
CREATE INDEX idx_solutions_category ON solutions(category);
CREATE INDEX idx_solutions_slug ON solutions(slug);
CREATE INDEX idx_solutions_is_active ON solutions(is_active);

-- 服务表
CREATE INDEX idx_services_category ON services(category);
CREATE INDEX idx_services_status ON services(status);
CREATE INDEX idx_services_slug ON services(slug);

-- 职位表
CREATE INDEX idx_job_positions_department ON job_positions(department);
CREATE INDEX idx_job_positions_status ON job_positions(status);

-- 求职申请表
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
CREATE INDEX idx_job_applications_email ON job_applications(email);
```

## 数据迁移

### 初始化脚本

```bash
# 生成迁移文件
npx prisma migrate dev --name init

# 应用迁移
npx prisma migrate deploy

# 生成客户端
npx prisma generate

# 数据种子
npx prisma db seed
```

### 种子数据

位置: `prisma/seed.ts`

- 管理员用户
- 产品分类数据
- 基础配置数据

## 备份策略

### 自动备份

```bash
# 每日备份
pg_dump -h localhost -U postgres -d lgjh > backup_$(date +%Y%m%d).sql

# 压缩备份
pg_dump -h localhost -U postgres -d lgjh | gzip > backup_$(date +%Y%m%d).sql.gz
```

### 恢复数据

```bash
# 从备份恢复
psql -h localhost -U postgres -d lgjh < backup_20250923.sql
```

## 性能优化

### 查询优化

- 使用select指定字段
- 合理使用include和where
- 避免N+1查询问题

### 连接池配置

```javascript
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  // 连接池配置
  connection_limit = 10
}
```

## 数据验证

### Prisma验证

- 字段类型验证
- 必填字段检查
- 唯一性约束
- 外键约束

### 应用层验证

- Zod schema验证
- 业务逻辑验证
- 权限验证

---

**创建时间**: 2025-09-23
**维护者**: 开发团队
**版本**: 1.0.0
