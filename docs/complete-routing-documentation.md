# 完整路由文档

## 概述

本文档详细记录了临港景鸿项目的所有路由配置，包括页面路由、API路由、动态路由和管理员路由。

## 目录结构

```
src/app/
├── page.tsx                    # 首页
├── layout.tsx                  # 根布局
├── loading.tsx                 # 全局加载页面
├── manifest.ts                 # PWA清单
├── globals.css                 # 全局样式
├── middleware.ts               # 中间件（认证保护）
├── (页面路由)
├── (API路由)
└── (管理员路由)
```

## 1. 页面路由 (Page Routes)

### 1.1 主要页面

| 路径        | 文件                | 描述     | 状态 |
| ----------- | ------------------- | -------- | ---- |
| `/`         | `page.tsx`          | 首页     | ✅   |
| `/about`    | `about/page.tsx`    | 关于我们 | ✅   |
| `/contact`  | `contact/page.tsx`  | 联系我们 | ✅   |
| `/business` | `business/page.tsx` | 业务板块 | ✅   |
| `/search`   | `search/page.tsx`   | 搜索页面 | ✅   |

### 1.2 产品相关路由

| 路径               | 文件                       | 描述       | 类型 |
| ------------------ | -------------------------- | ---------- | ---- |
| `/products`        | `products/page.tsx`        | 产品列表页 | 静态 |
| `/products/[slug]` | `products/[slug]/page.tsx` | 产品详情页 | 动态 |

**产品分类：**

- 智能数字化产品
- AI智能设计
- 智能医疗
- 智慧养老
- 新能源
- 其他产品

### 1.3 解决方案路由

| 路径                | 文件                        | 描述           | 类型 |
| ------------------- | --------------------------- | -------------- | ---- |
| `/solutions`        | `solutions/page.tsx`        | 解决方案列表页 | 静态 |
| `/solutions/[slug]` | `solutions/[slug]/page.tsx` | 解决方案详情页 | 动态 |

**解决方案分类：**

- 园区管理
- 社区管理
- 公共交通
- 工业制造
- 物流运输
- 大健康
- 商业综合体
- 其他方案

### 1.4 服务路由

| 路径               | 文件                       | 描述       | 类型 |
| ------------------ | -------------------------- | ---------- | ---- |
| `/services`        | `services/page.tsx`        | 服务列表页 | 静态 |
| `/services/[slug]` | `services/[slug]/page.tsx` | 服务详情页 | 动态 |

**服务类型：**

- `digital-transformation` - 数字化转型
- `intelligent-operation` - 智能运维服务
- `intelligent-engineering` - 智能化工程
- `fire-engineering` - 消防工程
- `risk-assessment` - 风险检测与评估
- `other-services` - 其他服务

### 1.5 研究路由

| 路径                     | 文件                             | 描述       | 类型 |
| ------------------------ | -------------------------------- | ---------- | ---- |
| `/research`              | `research/page.tsx`              | 研究列表页 | 静态 |
| `/research/[slug]`       | `research/[slug]/page.tsx`       | 研究详情页 | 动态 |
| `/research/achievements` | `research/achievements/page.tsx` | 研究成果   | 静态 |
| `/research/ai-research`  | `research/ai-research/page.tsx`  | AI研究     | 静态 |
| `/research/innovation`   | `research/innovation/page.tsx`   | 创新研究   | 静态 |
| `/research/papers`       | `research/papers/page.tsx`       | 学术论文   | 静态 |

### 1.6 使命责任路由

| 路径                             | 文件                                     | 描述         | 类型 |
| -------------------------------- | ---------------------------------------- | ------------ | ---- |
| `/mission`                       | `mission/page.tsx`                       | 使命责任主页 | 静态 |
| `/mission/education-integration` | `mission/education-integration/page.tsx` | 产教融合     | 静态 |
| `/mission/honors-activities`     | `mission/honors-activities/page.tsx`     | 荣誉活动     | 静态 |
| `/mission/company-news`          | `mission/company-news/page.tsx`          | 公司动态     | 静态 |
| `/mission/external-cooperation`  | `mission/external-cooperation/page.tsx`  | 对外合作     | 静态 |
| `/mission/join-us`               | `mission/join-us/page.tsx`               | 加入我们     | 静态 |

### 1.7 招聘路由

| 路径               | 文件                       | 描述       | 类型 |
| ------------------ | -------------------------- | ---------- | ---- |
| `/careers`         | `careers/page.tsx`         | 招聘列表页 | 静态 |
| `/careers/[jobId]` | `careers/[jobId]/page.tsx` | 职位详情页 | 动态 |

### 1.8 测试页面（开发用）

| 路径              | 文件                      | 描述           |
| ----------------- | ------------------------- | -------------- |
| `/test-api`       | `test-api/page.tsx`       | API测试页面    |
| `/test-db`        | `test-db/page.tsx`        | 数据库测试页面 |
| `/test-editor`    | `test-editor/page.tsx`    | 编辑器测试页面 |
| `/test-image`     | `test-image/page.tsx`     | 图片测试页面   |
| `/test-map`       | `test-map/page.tsx`       | 地图测试页面   |
| `/test-particles` | `test-particles/page.tsx` | 粒子效果测试   |
| `/test-watermark` | `test-watermark/page.tsx` | 水印测试页面   |

## 2. API路由 (API Routes)

### 2.1 认证相关

| 路径                      | 方法      | 描述                | 认证 |
| ------------------------- | --------- | ------------------- | ---- |
| `/api/auth/[...nextauth]` | GET, POST | NextAuth.js认证处理 | 无   |

### 2.2 公开API

| 路径                          | 方法 | 描述             | 参数                     |
| ----------------------------- | ---- | ---------------- | ------------------------ |
| `/api/products`               | GET  | 获取产品列表     | category, limit          |
| `/api/products/[slug]`        | GET  | 获取产品详情     | slug                     |
| `/api/products/search`        | GET  | 产品搜索         | q, category              |
| `/api/solutions`              | GET  | 获取解决方案列表 | category, limit          |
| `/api/solutions/[slug]`       | GET  | 获取解决方案详情 | slug                     |
| `/api/services`               | GET  | 获取服务列表     | category, limit          |
| `/api/services/[slug]`        | GET  | 获取服务详情     | slug                     |
| `/api/research`               | GET  | 获取研究列表     | category, limit          |
| `/api/research/[slug]`        | GET  | 获取研究详情     | slug                     |
| `/api/careers`                | GET  | 获取招聘列表     | department, search, page |
| `/api/careers/[jobId]`        | GET  | 获取职位详情     | jobId                    |
| `/api/careers/apply`          | POST | 提交招聘申请     | 表单数据                 |
| `/api/client-cases`           | GET  | 获取客户案例     | industry, limit          |
| `/api/partners`               | GET  | 获取合作伙伴     | type, limit              |
| `/api/awards`                 | GET  | 获取奖项荣誉     | category, limit          |
| `/api/qualifications`         | GET  | 获取企业资质     | type, limit              |
| `/api/contact`                | POST | 提交联系表单     | 表单数据                 |
| `/api/search`                 | GET  | 全站搜索         | q, type, limit           |
| `/api/locations`              | GET  | 获取位置信息     | -                        |
| `/api/settings`               | GET  | 获取网站设置     | -                        |
| `/api/navigation/footer`      | GET  | 获取页脚导航     | -                        |
| `/api/navigation/logo-config` | GET  | 获取Logo配置     | -                        |
| `/api/homepage/hero`          | GET  | 获取首页Hero配置 | -                        |

### 2.3 文件上传

| 路径                      | 方法 | 描述           | 认证   | 限制 |
| ------------------------- | ---- | -------------- | ------ | ---- |
| `/api/upload`             | POST | 普通文件上传   | 无     | 20MB |
| `/api/admin/media/upload` | POST | 管理员文件上传 | 管理员 | 10MB |

### 2.4 工具API

| 路径                      | 方法      | 描述         | 认证   |
| ------------------------- | --------- | ------------ | ------ |
| `/api/health`             | GET       | 健康检查     | 无     |
| `/api/revalidate`         | GET, POST | 缓存重新验证 | 管理员 |
| `/api/test-db`            | GET       | 数据库测试   | 无     |
| `/api/test-notifications` | GET       | 通知测试     | 无     |

## 3. 管理员路由

### 3.1 管理员页面

| 路径               | 文件                       | 描述       | 认证   |
| ------------------ | -------------------------- | ---------- | ------ |
| `/admin`           | `admin/page.tsx`           | 管理员首页 | 管理员 |
| `/admin/login`     | `admin/login/page.tsx`     | 管理员登录 | 无     |
| `/admin/dashboard` | `admin/dashboard/page.tsx` | 仪表板     | 管理员 |
| `/admin/profile`   | `admin/profile/page.tsx`   | 个人资料   | 管理员 |

### 3.2 内容管理

| 路径                            | 描述         | 认证   |
| ------------------------------- | ------------ | ------ |
| `/admin/content/products`       | 产品管理     | 管理员 |
| `/admin/content/solutions`      | 解决方案管理 | 管理员 |
| `/admin/content/services`       | 服务管理     | 管理员 |
| `/admin/content/research`       | 研究管理     | 管理员 |
| `/admin/content/careers`        | 招聘管理     | 管理员 |
| `/admin/content/partners`       | 合作伙伴管理 | 管理员 |
| `/admin/content/awards`         | 奖项管理     | 管理员 |
| `/admin/content/qualifications` | 资质管理     | 管理员 |
| `/admin/content/client-cases`   | 客户案例管理 | 管理员 |
| `/admin/content/company-news`   | 公司动态管理 | 管理员 |
| `/admin/content/homepage`       | 首页内容管理 | 管理员 |

### 3.3 系统管理

| 路径                   | 描述       | 认证   |
| ---------------------- | ---------- | ------ |
| `/admin/users`         | 用户管理   | 管理员 |
| `/admin/settings`      | 系统设置   | 管理员 |
| `/admin/media`         | 媒体库管理 | 管理员 |
| `/admin/analytics`     | 数据分析   | 管理员 |
| `/admin/notifications` | 通知管理   | 管理员 |
| `/admin/cache`         | 缓存管理   | 管理员 |
| `/admin/search`        | 搜索管理   | 管理员 |
| `/admin/locations`     | 位置管理   | 管理员 |
| `/admin/navigation`    | 导航管理   | 管理员 |

## 4. 文件访问路由

| 路径                 | 文件                         | 描述         |
| -------------------- | ---------------------------- | ------------ |
| `/uploads/[...path]` | `uploads/[...path]/route.ts` | 动态文件访问 |

**支持的文件类型：**

- 图片：JPG, PNG, GIF, WebP, AVIF
- 文档：PDF, DOC, DOCX
- 其他：根据需要扩展

## 5. 中间件配置

**文件：** `src/middleware.ts`

**保护的路由：**

- `/admin/*` - 需要管理员认证
- `/api/admin/*` - 需要管理员API权限

**认证配置：**

- 登录页面：`/admin/login`
- 会话管理：NextAuth.js
- 权限验证：基于用户角色

## 6. 路由特性

### 6.1 静态生成 (SSG)

- 产品详情页：`/products/[slug]`
- 解决方案详情页：`/solutions/[slug]`
- 服务详情页：`/services/[slug]`
- 研究详情页：`/research/[slug]`

### 6.2 增量静态再生 (ISR)

- 重新验证时间：60秒
- 支持按需重新验证

### 6.3 动态路由参数

- `[slug]` - 内容标识符
- `[jobId]` - 职位ID
- `[...path]` - 文件路径
- `[id]` - 通用ID

### 6.4 SEO优化

- 自动生成元数据
- 结构化数据
- 开放图谱标签
- 站点地图生成

## 7. 错误处理

### 7.1 404页面

- 自动处理不存在的路由
- 友好的错误提示
- 导航建议

### 7.2 500错误

- 服务器错误处理
- 错误日志记录
- 降级处理

## 8. 性能优化

### 8.1 代码分割

- 按路由自动分割
- 懒加载组件
- 预加载关键路由

### 8.2 缓存策略

- 静态资源缓存
- API响应缓存
- 数据库查询缓存

## 9. 管理员API路由详细说明

### 9.1 内容管理API

#### 产品管理

| 路径                                    | 方法   | 描述         | 参数                  |
| --------------------------------------- | ------ | ------------ | --------------------- |
| `/api/admin/content/products`           | GET    | 获取产品列表 | page, limit, category |
| `/api/admin/content/products`           | POST   | 创建产品     | 产品数据              |
| `/api/admin/content/products/[id]`      | GET    | 获取产品详情 | id                    |
| `/api/admin/content/products/[id]`      | PUT    | 更新产品     | id, 产品数据          |
| `/api/admin/content/products/[id]`      | DELETE | 删除产品     | id                    |
| `/api/admin/content/product-categories` | GET    | 获取产品分类 | -                     |

#### 解决方案管理

| 路径                                | 方法   | 描述             | 参数                  |
| ----------------------------------- | ------ | ---------------- | --------------------- |
| `/api/admin/content/solutions`      | GET    | 获取解决方案列表 | page, limit, category |
| `/api/admin/content/solutions`      | POST   | 创建解决方案     | 解决方案数据          |
| `/api/admin/content/solutions/[id]` | GET    | 获取解决方案详情 | id                    |
| `/api/admin/content/solutions/[id]` | PUT    | 更新解决方案     | id, 解决方案数据      |
| `/api/admin/content/solutions/[id]` | DELETE | 删除解决方案     | id                    |

#### 服务管理

| 路径                                  | 方法   | 描述             | 参数                  |
| ------------------------------------- | ------ | ---------------- | --------------------- |
| `/api/admin/content/services`         | GET    | 获取服务列表     | page, limit, category |
| `/api/admin/content/services`         | POST   | 创建服务         | 服务数据              |
| `/api/admin/content/services/[id]`    | GET    | 获取服务详情     | id                    |
| `/api/admin/content/services/[id]`    | PUT    | 更新服务         | id, 服务数据          |
| `/api/admin/content/services/[id]`    | DELETE | 删除服务         | id                    |
| `/api/admin/content/unified-services` | GET    | 获取统一服务配置 | -                     |

#### 招聘管理

| 路径                                   | 方法   | 描述         | 参数                |
| -------------------------------------- | ------ | ------------ | ------------------- |
| `/api/admin/content/careers/jobs`      | GET    | 获取职位列表 | page, limit, status |
| `/api/admin/content/careers/jobs`      | POST   | 创建职位     | 职位数据            |
| `/api/admin/content/careers/jobs/[id]` | GET    | 获取职位详情 | id                  |
| `/api/admin/content/careers/jobs/[id]` | PUT    | 更新职位     | id, 职位数据        |
| `/api/admin/content/careers/jobs/[id]` | DELETE | 删除职位     | id                  |

#### 其他内容管理

| 路径                                | 方法                   | 描述         |
| ----------------------------------- | ---------------------- | ------------ |
| `/api/admin/content/partners`       | GET, POST, PUT, DELETE | 合作伙伴管理 |
| `/api/admin/content/awards`         | GET, POST, PUT, DELETE | 奖项管理     |
| `/api/admin/content/qualifications` | GET, POST, PUT, DELETE | 资质管理     |
| `/api/admin/content/client-cases`   | GET, POST, PUT, DELETE | 客户案例管理 |
| `/api/admin/content/company-news`   | GET, POST, PUT, DELETE | 公司动态管理 |
| `/api/admin/content/research`       | GET, POST, PUT, DELETE | 研究管理     |

### 9.2 首页内容管理API

| 路径                                   | 方法     | 描述         |
| -------------------------------------- | -------- | ------------ |
| `/api/admin/content/homepage/hero`     | GET, PUT | Hero区域配置 |
| `/api/admin/content/homepage/features` | GET, PUT | 特性区域配置 |
| `/api/admin/content/homepage/stats`    | GET, PUT | 统计数据配置 |

### 9.3 系统管理API

#### 用户管理

| 路径                    | 方法   | 描述         | 参数              |
| ----------------------- | ------ | ------------ | ----------------- |
| `/api/admin/users`      | GET    | 获取用户列表 | page, limit, role |
| `/api/admin/users`      | POST   | 创建用户     | 用户数据          |
| `/api/admin/users/[id]` | GET    | 获取用户详情 | id                |
| `/api/admin/users/[id]` | PUT    | 更新用户     | id, 用户数据      |
| `/api/admin/users/[id]` | DELETE | 删除用户     | id                |

#### 媒体管理

| 路径                            | 方法      | 描述         | 参数              |
| ------------------------------- | --------- | ------------ | ----------------- |
| `/api/admin/media`              | GET       | 获取媒体列表 | page, limit, type |
| `/api/admin/media/upload`       | POST      | 上传媒体文件 | 文件数据          |
| `/api/admin/media/[id]`         | GET       | 获取媒体详情 | id                |
| `/api/admin/media/[id]`         | PUT       | 更新媒体信息 | id, 媒体数据      |
| `/api/admin/media/[id]`         | DELETE    | 删除媒体文件 | id                |
| `/api/admin/media/batch-delete` | POST      | 批量删除媒体 | ids[]             |
| `/api/admin/media/move`         | POST      | 移动媒体文件 | id, targetFolder  |
| `/api/admin/media/folders`      | GET, POST | 文件夹管理   | -                 |

#### 设置管理

| 路径                        | 方法 | 描述         | 参数       |
| --------------------------- | ---- | ------------ | ---------- |
| `/api/admin/settings`       | GET  | 获取所有设置 | -          |
| `/api/admin/settings/[key]` | GET  | 获取特定设置 | key        |
| `/api/admin/settings/[key]` | PUT  | 更新设置     | key, value |

#### 通知管理

| 路径                             | 方法   | 描述         | 参数                |
| -------------------------------- | ------ | ------------ | ------------------- |
| `/api/admin/notifications`       | GET    | 获取通知列表 | page, limit, status |
| `/api/admin/notifications`       | POST   | 创建通知     | 通知数据            |
| `/api/admin/notifications/[id]`  | GET    | 获取通知详情 | id                  |
| `/api/admin/notifications/[id]`  | PUT    | 更新通知     | id, 通知数据        |
| `/api/admin/notifications/[id]`  | DELETE | 删除通知     | id                  |
| `/api/admin/notifications/batch` | POST   | 批量操作通知 | action, ids[]       |

### 9.4 系统工具API

#### 分析统计

| 路径                          | 方法 | 描述         | 参数               |
| ----------------------------- | ---- | ------------ | ------------------ |
| `/api/admin/analytics`        | GET  | 获取分析数据 | dateRange, metrics |
| `/api/admin/analytics/export` | GET  | 导出分析报告 | format, dateRange  |
| `/api/admin/analytics/test`   | GET  | 测试分析功能 | -                  |

#### 系统状态

| 路径                                | 方法      | 描述         |
| ----------------------------------- | --------- | ------------ |
| `/api/admin/system/status`          | GET       | 系统状态检查 |
| `/api/admin/system/image-test`      | GET, POST | 图片功能测试 |
| `/api/admin/system/cms-image-test`  | GET       | CMS图片测试  |
| `/api/admin/system/career-test`     | GET       | 招聘功能测试 |
| `/api/admin/system/cache-sync-test` | GET       | 缓存同步测试 |

#### 其他工具

| 路径                     | 方法                   | 描述       |
| ------------------------ | ---------------------- | ---------- |
| `/api/admin/search`      | GET                    | 管理员搜索 |
| `/api/admin/dashboard`   | GET                    | 仪表板数据 |
| `/api/admin/profile`     | GET, PUT               | 管理员资料 |
| `/api/admin/locations`   | GET, POST, PUT, DELETE | 位置管理   |
| `/api/admin/navigation`  | GET, POST, PUT, DELETE | 导航管理   |
| `/api/admin/talent-pool` | GET, POST, PUT, DELETE | 人才库管理 |
| `/api/admin/avatars`     | GET, POST, PUT, DELETE | 头像管理   |

## 10. 表单处理API

### 10.1 招聘申请

| 路径                 | 方法 | 描述         | 数据格式            |
| -------------------- | ---- | ------------ | ------------------- |
| `/api/careers/apply` | POST | 提交招聘申请 | multipart/form-data |

**请求参数：**

- `jobId`: 职位ID
- `applicantName`: 申请人姓名
- `email`: 邮箱地址
- `phone`: 电话号码（可选）
- `introduction`: 自我介绍（可选）
- `resume`: 简历文件（可选）

### 10.2 联系表单

| 路径           | 方法 | 描述         | 数据格式         |
| -------------- | ---- | ------------ | ---------------- |
| `/api/contact` | POST | 提交联系表单 | application/json |

**请求参数：**

- `name`: 姓名
- `email`: 邮箱地址
- `phone`: 电话号码（可选）
- `company`: 公司名称（可选）
- `subject`: 主题
- `message`: 消息内容

### 10.3 管理员表单

| 路径                            | 描述         |
| ------------------------------- | ------------ |
| `/api/admin/forms/applications` | 招聘申请管理 |
| `/api/admin/forms/contacts`     | 联系表单管理 |

## 11. 开发工具

### 11.1 测试路由

- 开发环境专用
- API测试接口
- 功能验证页面

### 11.2 调试工具

- 路由分析
- 性能监控
- 错误追踪

## 12. 安全配置

### 12.1 认证中间件

- 路径匹配：`['/admin/:path*', '/api/admin/:path*']`
- 登录重定向：`/admin/login`
- 会话验证：NextAuth.js

### 12.2 权限控制

- 管理员权限：`user.isAdmin === true`
- API权限验证：每个管理员API都需要验证
- 文件上传权限：管理员上传vs普通上传

### 12.3 安全措施

- CSRF保护
- 文件类型验证
- 文件大小限制
- 路径遍历防护

## 10. 详细API路由说明

### 10.1 管理员API路由

#### 内容管理API

| 路径                                | 方法   | 描述             | 请求体       | 响应         |
| ----------------------------------- | ------ | ---------------- | ------------ | ------------ |
| `/api/admin/content/products`       | GET    | 获取产品列表     | -            | 产品数组     |
| `/api/admin/content/products`       | POST   | 创建产品         | 产品数据     | 创建结果     |
| `/api/admin/content/products/[id]`  | GET    | 获取产品详情     | -            | 产品对象     |
| `/api/admin/content/products/[id]`  | PUT    | 更新产品         | 产品数据     | 更新结果     |
| `/api/admin/content/products/[id]`  | DELETE | 删除产品         | -            | 删除结果     |
| `/api/admin/content/solutions`      | GET    | 获取解决方案列表 | -            | 解决方案数组 |
| `/api/admin/content/solutions`      | POST   | 创建解决方案     | 解决方案数据 | 创建结果     |
| `/api/admin/content/solutions/[id]` | GET    | 获取解决方案详情 | -            | 解决方案对象 |
| `/api/admin/content/solutions/[id]` | PUT    | 更新解决方案     | 解决方案数据 | 更新结果     |
| `/api/admin/content/solutions/[id]` | DELETE | 删除解决方案     | -            | 删除结果     |
| `/api/admin/content/services`       | GET    | 获取服务列表     | -            | 服务数组     |
| `/api/admin/content/services`       | POST   | 创建服务         | 服务数据     | 创建结果     |
| `/api/admin/content/services/[id]`  | GET    | 获取服务详情     | -            | 服务对象     |
| `/api/admin/content/services/[id]`  | PUT    | 更新服务         | 服务数据     | 更新结果     |
| `/api/admin/content/services/[id]`  | DELETE | 删除服务         | -            | 删除结果     |

#### 招聘管理API

| 路径                                           | 方法   | 描述         | 请求体   | 响应     |
| ---------------------------------------------- | ------ | ------------ | -------- | -------- |
| `/api/admin/content/careers/jobs`              | GET    | 获取职位列表 | -        | 职位数组 |
| `/api/admin/content/careers/jobs`              | POST   | 创建职位     | 职位数据 | 创建结果 |
| `/api/admin/content/careers/jobs/[id]`         | GET    | 获取职位详情 | -        | 职位对象 |
| `/api/admin/content/careers/jobs/[id]`         | PUT    | 更新职位     | 职位数据 | 更新结果 |
| `/api/admin/content/careers/jobs/[id]`         | DELETE | 删除职位     | -        | 删除结果 |
| `/api/admin/content/careers/applications`      | GET    | 获取申请列表 | -        | 申请数组 |
| `/api/admin/content/careers/applications/[id]` | GET    | 获取申请详情 | -        | 申请对象 |
| `/api/admin/content/careers/applications/[id]` | PUT    | 更新申请状态 | 状态数据 | 更新结果 |

#### 媒体管理API

| 路径                            | 方法   | 描述           | 请求体     | 响应       |
| ------------------------------- | ------ | -------------- | ---------- | ---------- |
| `/api/admin/media`              | GET    | 获取媒体列表   | -          | 媒体数组   |
| `/api/admin/media/upload`       | POST   | 上传文件       | FormData   | 文件信息   |
| `/api/admin/media/[id]`         | GET    | 获取媒体详情   | -          | 媒体对象   |
| `/api/admin/media/[id]`         | PUT    | 更新媒体信息   | 媒体数据   | 更新结果   |
| `/api/admin/media/[id]`         | DELETE | 删除媒体       | -          | 删除结果   |
| `/api/admin/media/batch-delete` | POST   | 批量删除媒体   | ID数组     | 删除结果   |
| `/api/admin/media/move`         | POST   | 移动媒体文件   | 移动数据   | 移动结果   |
| `/api/admin/media/folders`      | GET    | 获取文件夹列表 | -          | 文件夹数组 |
| `/api/admin/media/folders`      | POST   | 创建文件夹     | 文件夹数据 | 创建结果   |

#### 用户管理API

| 路径                    | 方法   | 描述         | 请求体   | 响应     |
| ----------------------- | ------ | ------------ | -------- | -------- |
| `/api/admin/users`      | GET    | 获取用户列表 | -        | 用户数组 |
| `/api/admin/users`      | POST   | 创建用户     | 用户数据 | 创建结果 |
| `/api/admin/users/[id]` | GET    | 获取用户详情 | -        | 用户对象 |
| `/api/admin/users/[id]` | PUT    | 更新用户     | 用户数据 | 更新结果 |
| `/api/admin/users/[id]` | DELETE | 删除用户     | -        | 删除结果 |

#### 系统管理API

| 路径                          | 方法 | 描述           | 请求体   | 响应     |
| ----------------------------- | ---- | -------------- | -------- | -------- |
| `/api/admin/settings`         | GET  | 获取系统设置   | -        | 设置对象 |
| `/api/admin/settings`         | POST | 更新系统设置   | 设置数据 | 更新结果 |
| `/api/admin/settings/[key]`   | GET  | 获取特定设置   | -        | 设置值   |
| `/api/admin/settings/[key]`   | PUT  | 更新特定设置   | 设置值   | 更新结果 |
| `/api/admin/dashboard`        | GET  | 获取仪表板数据 | -        | 统计数据 |
| `/api/admin/analytics`        | GET  | 获取分析数据   | -        | 分析数据 |
| `/api/admin/analytics/export` | GET  | 导出分析数据   | -        | 文件下载 |

#### 通知管理API

| 路径                             | 方法   | 描述         | 请求体   | 响应     |
| -------------------------------- | ------ | ------------ | -------- | -------- |
| `/api/admin/notifications`       | GET    | 获取通知列表 | -        | 通知数组 |
| `/api/admin/notifications`       | POST   | 创建通知     | 通知数据 | 创建结果 |
| `/api/admin/notifications/[id]`  | GET    | 获取通知详情 | -        | 通知对象 |
| `/api/admin/notifications/[id]`  | PUT    | 更新通知     | 通知数据 | 更新结果 |
| `/api/admin/notifications/[id]`  | DELETE | 删除通知     | -        | 删除结果 |
| `/api/admin/notifications/batch` | POST   | 批量操作通知 | 操作数据 | 操作结果 |

#### 系统诊断API

| 路径                                | 方法 | 描述         | 请求体   | 响应     |
| ----------------------------------- | ---- | ------------ | -------- | -------- |
| `/api/admin/system/status`          | GET  | 系统状态检查 | -        | 状态信息 |
| `/api/admin/system/image-test`      | GET  | 图片系统测试 | -        | 测试结果 |
| `/api/admin/system/image-test`      | POST | 图片上传测试 | 测试数据 | 测试结果 |
| `/api/admin/system/cms-image-test`  | GET  | CMS图片测试  | -        | 测试结果 |
| `/api/admin/system/career-test`     | GET  | 招聘系统测试 | -        | 测试结果 |
| `/api/admin/system/cache-sync-test` | GET  | 缓存同步测试 | -        | 测试结果 |

### 10.2 API请求/响应格式

#### 标准响应格式

```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2025-09-23T10:00:00Z"
}
```

#### 错误响应格式

```json
{
  "success": false,
  "error": "错误信息",
  "code": "ERROR_CODE",
  "timestamp": "2025-09-23T10:00:00Z"
}
```

#### 分页响应格式

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

### 10.3 认证和权限

#### 认证方式

- **Session-based**: 使用NextAuth.js管理会话
- **Token验证**: JWT令牌验证
- **权限检查**: 基于用户角色的访问控制

#### 权限级别

- **公开**: 无需认证
- **用户**: 需要登录
- **管理员**: 需要管理员权限
- **超级管理员**: 需要超级管理员权限

#### 中间件保护

```typescript
// 保护的路由模式
export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
}
```

### 10.4 文件上传配置

#### 上传限制

- **普通上传**: 最大20MB
- **管理员上传**: 最大10MB
- **支持格式**: JPG, PNG, GIF, WebP, AVIF

#### 上传目录结构

```
public/uploads/
├── admin/          # 管理员上传
├── products/       # 产品图片
├── solutions/      # 解决方案图片
├── services/       # 服务图片
├── research/       # 研究图片
├── avatars/        # 用户头像
└── temp/           # 临时文件
```

#### 水印配置

- **自动添加**: 根据上传类型自动添加水印
- **水印位置**: 右下角
- **透明度**: 50%
- **尺寸**: 自适应

### 10.5 缓存策略

#### 静态资源缓存

- **图片**: 1年
- **CSS/JS**: 1年（带版本号）
- **字体**: 1年

#### API缓存

- **产品数据**: 1小时
- **配置数据**: 24小时
- **用户数据**: 15分钟

#### ISR配置

- **重新验证**: 60秒
- **按需重新验证**: 支持
- **缓存标签**: 支持标签化缓存

## 11. 数据模型和API示例

### 11.1 产品API示例

#### 获取产品列表

```http
GET /api/products?category=智能数字化产品&limit=10
```

**响应示例：**

```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "title": "智能监控系统",
      "subtitle": "全方位安防解决方案",
      "description": "基于AI技术的智能监控系统...",
      "category": "智能数字化产品",
      "features": ["AI识别", "实时监控", "云端存储"],
      "specifications": {
        "分辨率": "4K",
        "存储": "云端+本地",
        "支持协议": "ONVIF"
      },
      "image": "/uploads/products/smart-monitor.jpg",
      "slug": "smart-monitoring-system",
      "status": "AVAILABLE",
      "tags": ["AI", "监控", "安防"],
      "gradient": "from-blue-500 to-purple-600",
      "accentColor": "#3b82f6"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "totalPages": 3
  }
}
```

#### 创建产品（管理员）

```http
POST /api/admin/content/products
Content-Type: application/json
Authorization: Bearer <token>

{
  "title": "新产品名称",
  "subtitle": "产品副标题",
  "description": "产品描述",
  "category": "智能数字化产品",
  "features": ["特性1", "特性2"],
  "specifications": {
    "规格1": "值1",
    "规格2": "值2"
  },
  "image": "/uploads/products/new-product.jpg",
  "status": "DRAFT",
  "tags": ["标签1", "标签2"]
}
```

### 11.2 招聘API示例

#### 获取职位列表

```http
GET /api/careers?department=技术部&page=1&limit=10
```

**响应示例：**

```json
{
  "success": true,
  "data": [
    {
      "id": "job-001",
      "title": "前端开发工程师",
      "department": "技术部",
      "location": "上海",
      "type": "全职",
      "experience": "3-5年",
      "salary": "15K-25K",
      "description": "负责前端开发工作...",
      "requirements": ["React经验", "TypeScript", "3年以上经验"],
      "benefits": ["五险一金", "弹性工作", "年终奖"],
      "tags": ["React", "TypeScript", "前端"],
      "isHot": true,
      "isUrgent": false,
      "createdAt": "2025-09-01T00:00:00Z"
    }
  ]
}
```

#### 提交招聘申请

```http
POST /api/careers/apply
Content-Type: multipart/form-data

jobId: job-001
applicantName: 张三
email: zhangsan@example.com
phone: 13800138000
introduction: 我对这个职位很感兴趣...
file: [简历文件]
```

### 11.3 文件上传API示例

#### 普通文件上传

```http
POST /api/upload
Content-Type: multipart/form-data

file: [图片文件]
uploadType: product
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "url": "/uploads/product_1732345678_abc123.jpg",
    "filename": "原始文件名.jpg",
    "size": 1024000,
    "type": "image/jpeg",
    "processingTime": 1500
  }
}
```

#### 管理员文件上传

```http
POST /api/admin/media/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

file: [图片文件]
uploadType: product
```

### 11.4 搜索API示例

#### 全站搜索

```http
GET /api/search?q=智能监控&type=all&limit=20
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "results": [
      {
        "type": "product",
        "id": "1",
        "title": "智能监控系统",
        "description": "基于AI技术的智能监控系统...",
        "url": "/products/smart-monitoring-system",
        "image": "/uploads/products/smart-monitor.jpg",
        "relevance": 0.95
      },
      {
        "type": "solution",
        "id": "2",
        "title": "园区智能监控解决方案",
        "description": "针对园区管理的智能监控解决方案...",
        "url": "/solutions/park-monitoring-solution",
        "image": "/uploads/solutions/park-solution.jpg",
        "relevance": 0.88
      }
    ],
    "categories": [
      {
        "type": "products",
        "count": 5,
        "label": "产品"
      },
      {
        "type": "solutions",
        "count": 3,
        "label": "解决方案"
      }
    ],
    "total": 8
  }
}
```

### 11.5 系统设置API示例

#### 获取网站设置

```http
GET /api/settings
```

**响应示例：**

```json
{
  "success": true,
  "data": {
    "seo": {
      "title": "临港景鸿 - 专业安防解决方案",
      "description": "专业安防解决方案提供商...",
      "keywords": ["安防", "监控", "智能化"],
      "ogImage": "/uploads/og-image.jpg"
    },
    "contact": {
      "phone": "400-123-4567",
      "email": "info@lgjh.com",
      "address": "上海市临港新区...",
      "workingHours": "周一至周五 9:00-18:00"
    },
    "social": {
      "wechat": "lgjh_official",
      "weibo": "@临港景鸿",
      "linkedin": "lgjh-company"
    }
  }
}
```

## 12. 错误代码和处理

### 12.1 HTTP状态码

| 状态码 | 含义       | 使用场景               |
| ------ | ---------- | ---------------------- |
| 200    | 成功       | 请求成功处理           |
| 201    | 已创建     | 资源创建成功           |
| 400    | 请求错误   | 参数错误、验证失败     |
| 401    | 未授权     | 需要登录               |
| 403    | 禁止访问   | 权限不足               |
| 404    | 未找到     | 资源不存在             |
| 409    | 冲突       | 资源冲突（如重复创建） |
| 422    | 无法处理   | 数据验证失败           |
| 429    | 请求过多   | 超出速率限制           |
| 500    | 服务器错误 | 内部服务器错误         |

### 12.2 自定义错误代码

| 错误代码                   | 描述             | HTTP状态码 |
| -------------------------- | ---------------- | ---------- |
| `VALIDATION_ERROR`         | 数据验证失败     | 422        |
| `AUTHENTICATION_REQUIRED`  | 需要认证         | 401        |
| `INSUFFICIENT_PERMISSIONS` | 权限不足         | 403        |
| `RESOURCE_NOT_FOUND`       | 资源未找到       | 404        |
| `DUPLICATE_RESOURCE`       | 资源重复         | 409        |
| `FILE_TOO_LARGE`           | 文件过大         | 413        |
| `UNSUPPORTED_FILE_TYPE`    | 不支持的文件类型 | 415        |
| `RATE_LIMIT_EXCEEDED`      | 超出速率限制     | 429        |
| `DATABASE_ERROR`           | 数据库错误       | 500        |
| `EXTERNAL_SERVICE_ERROR`   | 外部服务错误     | 502        |

### 12.3 错误处理示例

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "数据验证失败",
    "details": {
      "title": "标题不能为空",
      "email": "邮箱格式不正确"
    }
  },
  "timestamp": "2025-09-23T10:00:00Z",
  "requestId": "req_123456789"
}
```

## 13. 性能监控和日志

### 13.1 API性能监控

#### 监控指标

- **响应时间**: 平均响应时间、P95、P99
- **吞吐量**: 每秒请求数（RPS）
- **错误率**: 4xx和5xx错误比例
- **可用性**: 服务可用时间百分比

#### 监控端点

```http
GET /api/admin/analytics/performance
```

### 13.2 日志记录

#### 日志级别

- **ERROR**: 错误信息
- **WARN**: 警告信息
- **INFO**: 一般信息
- **DEBUG**: 调试信息

#### 日志格式

```json
{
  "timestamp": "2025-09-23T10:00:00Z",
  "level": "INFO",
  "message": "API request processed",
  "requestId": "req_123456789",
  "userId": "user_001",
  "method": "GET",
  "path": "/api/products",
  "statusCode": 200,
  "responseTime": 150,
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1"
}
```

## 14. 安全措施

### 14.1 输入验证

- **参数验证**: 使用Zod进行严格的参数验证
- **SQL注入防护**: 使用Prisma ORM防止SQL注入
- **XSS防护**: 输入输出过滤和转义

### 14.2 认证安全

- **密码加密**: bcrypt哈希加密
- **会话管理**: 安全的会话配置
- **CSRF保护**: CSRF令牌验证

### 14.3 文件上传安全

- **文件类型检查**: 严格的MIME类型验证
- **文件大小限制**: 防止大文件攻击
- **路径遍历防护**: 安全的文件路径处理

### 14.4 速率限制

- **API限制**: 每个IP每分钟最多100次请求
- **上传限制**: 每个用户每小时最多上传50个文件
- **登录限制**: 连续失败5次后锁定账户

## 15. 部署配置

### 15.1 环境变量

#### 必需环境变量

```bash
# 数据库配置
DATABASE_URL="postgresql://user:password@localhost:5432/lgjh"

# NextAuth配置
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-secret-key"

# 管理员配置
ADMIN_EMAIL="admin@lgjh.com"
ADMIN_PASSWORD="secure-password"

# 文件上传配置
UPLOAD_MAX_SIZE="20971520"  # 20MB
ADMIN_UPLOAD_MAX_SIZE="10485760"  # 10MB

# 缓存配置
REDIS_URL="redis://localhost:6379"

# 邮件配置
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="noreply@lgjh.com"
SMTP_PASS="email-password"
```

#### 可选环境变量

```bash
# 分析和监控
GOOGLE_ANALYTICS_ID="GA_MEASUREMENT_ID"
SENTRY_DSN="https://your-sentry-dsn"

# 第三方服务
CLOUDINARY_URL="cloudinary://api_key:api_secret@cloud_name"
AWS_ACCESS_KEY_ID="your-aws-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"

# 开发配置
NODE_ENV="production"
LOG_LEVEL="info"
DEBUG="false"
```

### 15.2 Docker部署

#### Dockerfile配置

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# 构建应用
FROM base AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules
RUN npm run build

# 生产镜像
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

#### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:3000'
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/lgjh
      - NEXTAUTH_URL=http://localhost:3000
      - NEXTAUTH_SECRET=your-secret-key
    depends_on:
      - db
      - redis
    volumes:
      - ./public/uploads:/app/public/uploads

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=lgjh
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - '5432:5432'

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 15.3 Nginx配置

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    # 安全头
    add_header X-Frame-Options DENY;
    add_header X-Content-Type-Options nosniff;
    add_header X-XSS-Protection "1; mode=block";
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";

    # 静态文件缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # 上传文件
    location /uploads/ {
        alias /app/public/uploads/;
        expires 1y;
        add_header Cache-Control "public";
    }

    # API路由
    location /api/ {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # 主应用
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 16. 最佳实践

### 16.1 API设计原则

#### RESTful设计

- **资源导向**: URL表示资源，HTTP方法表示操作
- **状态无关**: 每个请求包含所有必要信息
- **统一接口**: 一致的API设计模式
- **分层系统**: 清晰的架构分层

#### 命名规范

- **URL路径**: 使用小写字母和连字符
- **查询参数**: 使用驼峰命名法
- **响应字段**: 使用驼峰命名法
- **错误代码**: 使用大写字母和下划线

### 16.2 性能优化

#### 数据库优化

- **索引优化**: 为常用查询字段添加索引
- **查询优化**: 使用Prisma的select和include优化查询
- **连接池**: 配置合适的数据库连接池
- **缓存策略**: 使用Redis缓存热点数据

#### 前端优化

- **代码分割**: 按路由和组件分割代码
- **图片优化**: 使用Next.js Image组件优化图片
- **预加载**: 预加载关键资源
- **CDN**: 使用CDN加速静态资源

### 16.3 安全最佳实践

#### 输入验证

```typescript
import { z } from 'zod'

const productSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  category: z.enum(['智能数字化产品', 'AI智能设计', '智能医疗']),
  price: z.number().positive().optional(),
})
```

#### 权限检查

```typescript
export async function checkAdminPermission(request: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    throw new Error('权限不足')
  }
  return session
}
```

#### 速率限制

```typescript
import rateLimit from 'express-rate-limit'

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 最多100次请求
  message: '请求过于频繁，请稍后再试',
})
```

### 16.4 监控和日志

#### 错误监控

```typescript
import * as Sentry from '@sentry/nextjs'

export function logError(error: Error, context?: any) {
  console.error('API Error:', error)
  Sentry.captureException(error, { extra: context })
}
```

#### 性能监控

```typescript
export function measurePerformance(operation: string) {
  const start = Date.now()
  return {
    end: () => {
      const duration = Date.now() - start
      console.log(`${operation} took ${duration}ms`)
      return duration
    },
  }
}
```

### 16.5 测试策略

#### 单元测试

```typescript
import { GET } from '@/app/api/products/route'
import { NextRequest } from 'next/server'

describe('/api/products', () => {
  it('should return products list', async () => {
    const request = new NextRequest('http://localhost/api/products')
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(Array.isArray(data.data)).toBe(true)
  })
})
```

#### 集成测试

```typescript
import { test, expect } from '@playwright/test'

test('产品页面加载正常', async ({ page }) => {
  await page.goto('/products')
  await expect(page.locator('h1')).toContainText('产品服务')
  await expect(page.locator('[data-testid="product-card"]')).toHaveCount(6)
})
```

## 17. 故障排除

### 17.1 常见问题

#### 路由404错误

- **检查文件路径**: 确保文件在正确的目录下
- **检查文件命名**: 确保使用正确的文件名（page.tsx, route.ts）
- **检查动态路由**: 确保动态参数格式正确

#### API响应慢

- **数据库查询**: 检查是否有N+1查询问题
- **缓存策略**: 检查缓存是否正常工作
- **网络延迟**: 检查外部API调用

#### 文件上传失败

- **文件大小**: 检查文件是否超过限制
- **文件类型**: 检查文件类型是否支持
- **存储空间**: 检查服务器存储空间

### 17.2 调试工具

#### 开发工具

- **Next.js DevTools**: 路由和性能分析
- **Prisma Studio**: 数据库可视化管理
- **React DevTools**: 组件调试

#### 生产监控

- **Sentry**: 错误监控和性能分析
- **Vercel Analytics**: 网站性能监控
- **Google Analytics**: 用户行为分析

---

**文档版本：** 2.0.0
**最后更新：** 2025-09-23
**维护者：** 开发团队
**审核者：** 技术负责人

## 附录

### A. 快速参考

#### 常用API端点

```bash
# 获取产品列表
curl -X GET "https://api.lgjh.com/api/products"

# 获取产品详情
curl -X GET "https://api.lgjh.com/api/products/smart-monitoring-system"

# 搜索
curl -X GET "https://api.lgjh.com/api/search?q=智能监控"

# 提交联系表单
curl -X POST "https://api.lgjh.com/api/contact" \
  -H "Content-Type: application/json" \
  -d '{"name":"张三","email":"zhangsan@example.com","message":"咨询产品"}'
```

#### 管理员API端点

```bash
# 登录获取token
curl -X POST "https://api.lgjh.com/api/auth/signin" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@lgjh.com","password":"password"}'

# 创建产品
curl -X POST "https://api.lgjh.com/api/admin/content/products" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"新产品","category":"智能数字化产品"}'

# 上传文件
curl -X POST "https://api.lgjh.com/api/admin/media/upload" \
  -H "Authorization: Bearer <token>" \
  -F "file=@image.jpg" \
  -F "uploadType=product"
```

### B. 状态码速查表

| 状态码 | 含义                  | 常见场景     |
| ------ | --------------------- | ------------ |
| 200    | OK                    | 成功获取数据 |
| 201    | Created               | 成功创建资源 |
| 400    | Bad Request           | 参数错误     |
| 401    | Unauthorized          | 未登录       |
| 403    | Forbidden             | 权限不足     |
| 404    | Not Found             | 资源不存在   |
| 422    | Unprocessable Entity  | 数据验证失败 |
| 429    | Too Many Requests     | 请求过多     |
| 500    | Internal Server Error | 服务器错误   |
