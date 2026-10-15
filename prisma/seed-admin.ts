import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdmin() {
  console.log('开始创建默认管理员账户...')

  // 检查是否已经存在管理员账户
  const existingAdmin = await prisma.user.findFirst({
    where: { isAdmin: true },
  })

  if (existingAdmin) {
    console.log('管理员账户已存在:', existingAdmin.email)
    return
  }

  // 创建默认管理员账户
  const hashedPassword = await bcrypt.hash('admin123', 12)

  const admin = await prisma.user.create({
    data: {
      email: 'admin@lingangjinghong.com',
      name: '系统管理员',
      passwordHash: hashedPassword,
      isAdmin: true,
    },
  })

  console.log('✓ 默认管理员账户创建成功:')
  console.log('  邮箱:', admin.email)
  console.log('  密码: admin123')
  console.log('  请登录后立即修改密码！')
}

seedAdmin()
  .catch(e => {
    console.error('创建管理员账户失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
