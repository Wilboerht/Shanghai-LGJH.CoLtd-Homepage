import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function addJoinUsModule() {
  try {
    console.log('🎯 添加"加入我们"模块到数据库...')

    // 检查是否已存在"加入我们"模块
    const existingModule = await prisma.missionModule.findUnique({
      where: { category: 'join-us' },
    })

    if (existingModule) {
      console.log('✅ "加入我们"模块已存在')
      console.log(`   - ID: ${existingModule.id}`)
      console.log(`   - 标题: ${existingModule.title}`)
      console.log(`   - 状态: ${existingModule.status}`)
      return existingModule
    }

    // 创建"加入我们"模块
    const joinUsModule = await prisma.missionModule.create({
      data: {
        category: 'join-us',
        title: '加入我们',
        subtitle: '与我们一起创造未来',
        description: '我们正在寻找有才华、有激情的人才加入我们的团队，共同推动智能化技术的发展。',
        icon: 'Users',
        image: '/images/mission/join-us.jpg',
        highlights: [
          '具有竞争力的薪酬待遇',
          '完善的职业发展路径',
          '开放包容的工作环境',
          '丰富的学习成长机会',
        ],
        features: ['弹性工作制度', '五险一金', '年度体检', '团队建设活动', '技能培训', '绩效奖金'],
        achievements: [
          { value: '100+', label: '团队成员' },
          { value: '5+', label: '技术部门' },
          { value: '95%', label: '员工满意度' },
          { value: '3年', label: '平均工作年限' },
        ],
        gradient: 'from-blue-600 to-purple-600',
        accentColor: 'blue',
        href: '/careers',
        status: 'active',
        sortOrder: 5,
      },
    })

    console.log('✅ 成功创建"加入我们"模块')
    console.log(`   - ID: ${joinUsModule.id}`)
    console.log(`   - 标题: ${joinUsModule.title}`)
    console.log(`   - 重定向链接: ${joinUsModule.href}`)

    return joinUsModule
  } catch (error) {
    console.error('❌ 创建"加入我们"模块失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// 运行脚本
addJoinUsModule()
  .then(() => {
    console.log('🎉 "加入我们"模块设置完成!')
  })
  .catch(error => {
    console.error('💥 脚本执行失败:', error)
    process.exit(1)
  })
