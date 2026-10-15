# 使用官方 Node.js 18 Alpine 镜像
FROM node:18-alpine AS base

# 安装系统依赖
RUN apk add --no-cache libc6-compat

# 设置工作目录
WORKDIR /app

# 安装依赖阶段
FROM base AS deps

# 复制 package 文件
COPY package.json package-lock.json* ./

# 安装所有依赖（包括开发依赖，用于构建）
RUN npm ci

# 构建应用阶段
FROM base AS builder

# 复制依赖
COPY --from=deps /app/node_modules ./node_modules

# 复制源代码
COPY . .

# 复制 Prisma schema
COPY prisma ./prisma

# 生成 Prisma 客户端
RUN npx prisma generate

# 构建 Next.js 应用
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# 生产镜像
FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# 创建非 root 用户
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 创建必要的目录并设置权限
RUN mkdir -p /app/prisma /app/public/uploads /app/public/uploads/admin /app/logs
RUN chown -R nextjs:nodejs /app/public/uploads /app/logs /app/prisma
RUN chmod -R 755 /app/public/uploads

# 复制构建产物和必要文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 复制 Prisma 相关文件
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# 设置正确的权限
RUN chown -R nextjs:nodejs /app
USER nextjs

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# 启动应用
CMD ["node", "server.js"]
