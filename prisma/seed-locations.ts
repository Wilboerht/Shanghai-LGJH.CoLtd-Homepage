import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedLocations() {
  console.log('开始添加公司地址数据...')

  // 删除现有数据
  await prisma.companyLocation.deleteMany()

  // 添加默认地址
  const locations = [
    {
      name: '公司总部',
      type: 'HEADQUARTERS' as const,
      address: '上海市徐汇区宜山路508号景鸿大楼5楼',
      phone: '+86 13816579552',
      email: 'zhoujunting@lingangjinghong.com',
      longitude: 121.4258,
      latitude: 31.182,
      description: '上海临港景鸿安防科技有限公司总部',
      isDefault: true,
      isActive: true,
      sortOrder: 1,
      businessHours: JSON.stringify({
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '18:00' },
        saturday: { closed: true },
        sunday: { closed: true },
      }),
      contactPerson: '周经理',
    },
    {
      name: '创晶展厅',
      type: 'SHOWROOM' as const,
      address: '上海市浦东新区海洋一路99号',
      phone: '+86 13816579552',
      email: 'zhoujunting@lingangjinghong.com',
      longitude: 121.9118,
      latitude: 30.8708,
      description: '创晶安防科技展厅，展示最新的安防产品和解决方案',
      isDefault: false,
      isActive: true,
      sortOrder: 2,
      businessHours: JSON.stringify({
        monday: { open: '09:00', close: '17:00' },
        tuesday: { open: '09:00', close: '17:00' },
        wednesday: { open: '09:00', close: '17:00' },
        thursday: { open: '09:00', close: '17:00' },
        friday: { open: '09:00', close: '17:00' },
        saturday: { open: '10:00', close: '16:00' },
        sunday: { closed: true },
      }),
      contactPerson: '展厅接待',
    },
  ]

  for (const location of locations) {
    await prisma.companyLocation.create({
      data: location,
    })
    console.log(`✓ 已添加地址: ${location.name}`)
  }

  console.log('地址数据添加完成！')
}

seedLocations()
  .catch(e => {
    console.error('添加地址数据失败:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
