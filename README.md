# 临港景鸿企业网站

基于 Next.js 15 构建的现代化专业安防解决方案展示网站，采用 TypeScript + Tailwind CSS 技术栈，为安防行业客户提供产品展示、解决方案介绍和在线咨询服务。

## ✨ 项目特点

- **🔒 专业安防主题**: 针对安防行业定制的设计风格和内容架构
- **⚡ 现代化技术栈**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **📱 响应式设计**: 支持所有设备和屏幕尺寸的完美适配
- **🎛️ 完整CMS系统**: 内置管理后台，支持内容管理和招聘系统
- **🚀 高性能优化**: 代码分割、图片优化、快速加载
- **🔍 SEO友好**: 完整的搜索引擎优化配置
- **♿ 无障碍访问**: 符合WCAG标准的语义化HTML和ARIA标签
- **🎨 专业设计**: 企业级色彩方案和专业视觉效果

## 🛠️ 技术架构

### 核心技术栈

- **前端框架**: Next.js 15 (App Router)
- **开发语言**: TypeScript
- **样式框架**: Tailwind CSS
- **数据库**: SQLite + Prisma ORM
- **认证系统**: NextAuth.js
- **动画库**: Framer Motion
- **图标库**: Lucide React
- **字体**: Geist Sans & Geist Mono
- **部署方案**: Docker + Nginx

### 功能模块

#### 前台功能

- **首页**: 企业介绍、核心产品展示、解决方案概览
- **产品中心**: 安防产品分类展示、详细规格参数
- **解决方案**: 行业定制化安防解决方案
- **服务支持**: 技术服务、售后支持信息
- **关于我们**: 企业文化、发展历程、联系方式
- **人才招聘**: 职位发布、在线申请系统

#### 后台管理

- **内容管理**: 产品、服务、解决方案的CRUD操作
- **招聘管理**: 职位发布、简历管理、人才储备
- **媒体管理**: 图片上传、水印处理、文件管理
- **用户管理**: 管理员账户、权限控制
- **系统设置**: 网站配置、SEO设置

## 🚀 快速开始

### 环境要求

- **Node.js**: 18.0 或更高版本
- **npm**: 9.0.0 或更高版本
- **Git**: 版本控制工具

### 1. 项目克隆与安装

```bash
# 克隆项目
git clone <repository-url>
cd LGJH1

# 安装依赖
npm install
```

### 2. 环境配置

```bash
# 复制环境变量模板
cp deployment/configs/.env.production.example .env

# 编辑环境变量文件，配置必要参数：
# - DATABASE_URL: 数据库连接字符串
# - NEXTAUTH_URL: 应用访问地址
# - NEXTAUTH_SECRET: 认证密钥
# - ADMIN_EMAIL: 管理员邮箱
# - ADMIN_PASSWORD: 管理员密码
```

### 3. 数据库初始化

```bash
# 生成 Prisma 客户端
npm run db:generate

# 运行数据库迁移
npm run db:migrate

# 填充示例数据（可选）
npm run db:seed
```

### 4. 启动开发服务器

```bash
# 启动开发环境
npm run dev

# 访问应用
# 前台: http://localhost:3100
# 后台: http://localhost:3100/admin/login
```

### 5. 管理员登录

默认管理员账户：

- **邮箱**: admin@lgjh.com
- **密码**: admin123

> ⚠️ **安全提示**: 生产环境请务必修改默认密码

## 📋 常用命令

### 开发相关

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 代码检查
npm run lint:fix     # 自动修复代码问题
npm run format       # 代码格式化
npm run type-check   # TypeScript 类型检查
```

### 数据库相关

```bash
npm run db:generate  # 生成 Prisma 客户端
npm run db:migrate   # 运行数据库迁移
npm run db:seed      # 填充示例数据
npm run db:studio    # 打开数据库管理界面
npm run db:reset     # 重置数据库
```

### 测试相关

```bash
npm run test         # 运行单元测试
npm run test:watch   # 监听模式运行测试
npm run test:e2e     # 运行端到端测试
npm run test:coverage # 生成测试覆盖率报告
```

## 🚀 部署指南

### 🐳 Docker 部署 (推荐)

#### 快速部署

```bash
cd deployment/scripts
./deploy-docker.sh        # Linux/macOS
# 或
deploy-docker.bat         # Windows
```

#### 手动 Docker 部署

```bash
# 简单部署 (仅应用)
docker-compose -f deployment/docker/docker-compose.simple.yml up -d

# 完整部署 (应用 + Nginx)
docker-compose -f deployment/docker/docker-compose.production.yml up -d
```

### 🖥️ 传统服务器部署

#### 环境准备

```bash
cd deployment/scripts
./server-setup.sh
```

#### 项目打包上传

```bash
# 本地打包
cd deployment/scripts
./package-for-server.sh   # Linux/macOS
# 或
package-for-server.bat    # Windows

# 上传到服务器
scp lgjh-homepage-*.tar.gz user@server:/opt/
```

### 📋 部署检查

```bash
cd deployment/scripts
./check-deployment.sh
```

## 📁 项目结构

```
LGJH1/
├── 📄 核心配置文件
│   ├── package.json           # 项目依赖和脚本
│   ├── next.config.ts         # Next.js 配置
│   ├── Dockerfile             # Docker 构建配置
│   └── README.md              # 项目说明
├── 🚀 deployment/             # 部署相关文件
│   ├── docker/                # Docker 配置文件
│   ├── scripts/               # 部署脚本
│   └── configs/               # 配置模板
├── 📚 docs/                   # 项目文档
│   ├── project-architecture.md      # 项目架构文档
│   ├── complete-routing-documentation.md # 路由文档
│   ├── database-design.md           # 数据库设计
│   ├── deployment-guide.md          # 部署指南
│   ├── development-standards.md     # 开发规范
│   └── troubleshooting-guide.md     # 故障排除
├── 💻 src/                    # 应用源代码
│   ├── app/                   # Next.js App Router
│   ├── components/            # React 组件
│   ├── lib/                   # 工具库
│   └── types/                 # TypeScript 类型
├── 🗄️ prisma/                 # 数据库配置
├── 🎨 public/                 # 静态资源
├── 📜 scripts/                # 数据库种子脚本
└── 🧪 tests/                  # 测试文件
```

## 🎨 设计系统

### 色彩方案

- **主色调**: 专业蓝色系 (#1e40af, #3b82f6)
- **辅助色**: 灰色系 (#64748b, #94a3b8)
- **强调色**: 橙色 (#f97316) 用于重要按钮和链接
- **背景色**: 白色和浅灰色渐变

### 字体系统

- **主字体**: Geist Sans (现代无衬线字体)
- **代码字体**: Geist Mono (等宽字体)
- **中文字体**: 系统默认中文字体栈

### 组件规范

- **按钮**: 统一的圆角、阴影和悬停效果
- **卡片**: 一致的边框、阴影和内边距
- **表单**: 标准化的输入框、标签和验证样式
- **导航**: 响应式导航栏和面包屑导航

## 📚 文档资源

- **[项目架构图表汇总](./项目架构图表汇总.md)** - 完整的系统架构图表
- **[详细技术文档](./docs/README.md)** - 完整的开发和部署文档
- **[部署指南](./docs/deployment-guide.md)** - 详细的部署流程
- **[故障排除](./docs/troubleshooting-guide.md)** - 常见问题解决方案

## 🔧 环境变量配置

```bash
# 数据库配置
DATABASE_URL="file:./dev.db"

# NextAuth 配置
NEXTAUTH_URL="http://localhost:3100"
NEXTAUTH_SECRET="your-secret-key"

# 管理员账户
ADMIN_EMAIL="admin@lgjh.com"
ADMIN_PASSWORD="admin123"

# 可选配置
REDIS_URL=""                    # Redis 缓存
SMTP_HOST=""                    # 邮件服务
GOOGLE_ANALYTICS_ID=""          # 分析工具
```

## 🌐 浏览器支持

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 📞 技术支持

如需技术支持或有任何问题，请：

- 查看 [故障排除文档](./docs/troubleshooting-guide.md)
- 查看 [项目架构图表](./项目架构图表汇总.md)
- 联系开发团队

---

**项目版本**: 1.0.0
**最后更新**: 2025-09-23
**维护状态**: 活跃开发中
