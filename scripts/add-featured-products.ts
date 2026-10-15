import { PrismaClient, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function addFeaturedProducts() {
  console.log('开始添加特色产品数据...')

  // 获取管理员用户
  const admin = await prisma.user.findFirst({
    where: { isAdmin: true },
  })

  if (!admin) {
    console.error('未找到管理员用户')
    return
  }

  // 特色产品数据
  const featuredProducts = [
    // 行业特色产品
    {
      id: 'explosion-proof-camera',
      category: 'security-monitoring',
      title: '防爆摄像机',
      subtitle: 'Explosion-Proof Camera',
      description:
        '专为危险环境设计的防爆摄像机，符合国际防爆标准，适用于石化、煤矿、天然气等高危行业。',
      features: [
        '防爆认证设计',
        '高清图像采集',
        '红外夜视功能',
        '远程云台控制',
        '防腐蚀外壳',
        '故障自诊断',
      ],
      specifications: [
        { name: '防爆等级', value: 'ExdIICT6 Gb' },
        { name: '图像分辨率', value: '1080P/4K可选' },
        { name: '夜视距离', value: '120米' },
        { name: '工作温度', value: '-40°C至60°C' },
      ],
      applications: ['石化工厂', '煤矿井下', '天然气站', '化工园区', '油库码头'],
      benefits: ['本质安全设计', '适应恶劣环境', '国际认证标准', '维护操作安全'],
      image: '/images/products/explosion-proof-camera.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'explosion-proof-camera',
      tags: ['防爆摄像机', '危险环境', '石化行业', '安全认证'],
      gradient: 'from-red-600 to-orange-600',
      accentColor: 'red',
    },
    {
      id: 'underwater-monitoring-system',
      category: 'security-monitoring',
      title: '水下监控系统',
      subtitle: 'Underwater Monitoring System',
      description: '专业水下监控系统，适用于港口、水库、河道等水域环境的安全监控和环境监测。',
      features: [
        '水下高清成像',
        '防水密封设计',
        '低照度增强',
        '水质参数检测',
        '远程控制操作',
        '数据无线传输',
      ],
      specifications: [
        { name: '防水深度', value: '50米' },
        { name: '图像分辨率', value: '1080P' },
        { name: '可视距离', value: '水下20米' },
        { name: '材质', value: '316L不锈钢+钛合金' },
      ],
      applications: ['港口码头', '水库大坝', '河道治理', '海洋牧场', '水产养殖'],
      benefits: ['水域安全监控', '环境保护监测', '渔业资源管理', '基础设施保护'],
      image: '/images/products/underwater-monitoring-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'underwater-monitoring-system',
      tags: ['水下监控', '海洋监测', '港口安全', '环境保护'],
      gradient: 'from-blue-600 to-cyan-600',
      accentColor: 'blue',
    },

    // 特殊应用产品
    {
      id: 'perimeter-intrusion-system',
      category: 'security-monitoring',
      title: '周界入侵检测系统',
      subtitle: 'Perimeter Intrusion Detection System',
      description: '先进的周界入侵检测系统，采用多种检测技术，为重要区域提供全方位的周界安全防护。',
      features: [
        '多技术融合检测',
        '精确入侵定位',
        '低误报率设计',
        '恶劣天气适应',
        '视频联动验证',
        '分级报警处理',
      ],
      specifications: [
        { name: '检测距离', value: '500米连续防护' },
        { name: '定位精度', value: '±5米' },
        { name: '误报率', value: '<0.1%' },
        { name: '响应时间', value: '<2秒' },
      ],
      applications: ['军事基地', '监狱', '核电站', '机场', '重要设施'],
      benefits: ['全天候防护', '精确威胁定位', '快速响应处置', '系统稳定可靠'],
      image: '/images/products/perimeter-intrusion-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'perimeter-intrusion-system',
      tags: ['周界防护', '入侵检测', '安全防范', '重要设施'],
      gradient: 'from-red-600 to-pink-600',
      accentColor: 'red',
    },

    // 环保特色产品
    {
      id: 'waste-gas-monitoring',
      category: 'environmental-monitoring',
      title: '废气排放监测系统',
      subtitle: 'Waste Gas Emission Monitoring System',
      description:
        '工业废气排放在线监测系统，实时监测污染物浓度，确保企业达标排放，满足环保监管要求。',
      features: [
        '污染物浓度监测',
        '排放总量计算',
        '超标自动报警',
        '数据实时上传',
        '设备运行监控',
        '报表自动生成',
      ],
      specifications: [
        { name: '监测因子', value: 'SO2/NOx/颗粒物/流量/温度' },
        { name: '测量精度', value: '±2%F.S.' },
        { name: '响应时间', value: '<60秒' },
        { name: '数据传输', value: '4G/有线网络' },
      ],
      applications: ['火电厂', '钢铁厂', '水泥厂', '化工企业', '垃圾焚烧厂'],
      benefits: ['确保达标排放', '满足监管要求', '避免环保处罚', '提升企业形象'],
      image: '/images/products/waste-gas-monitoring.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'waste-gas-monitoring',
      tags: ['废气监测', '环保监管', '达标排放', '在线监测'],
      gradient: 'from-green-600 to-lime-600',
      accentColor: 'green',
    },

    // 新兴技术产品
    {
      id: 'quantum-communication-device',
      category: 'communication-network',
      title: '量子通信设备',
      subtitle: 'Quantum Communication Device',
      description: '基于量子密钥分发技术的超安全通信设备，提供理论上不可破解的通信加密保护。',
      features: [
        '量子密钥分发',
        '理论级安全',
        '实时密钥更新',
        '网络透明接入',
        '状态实时监控',
        '兼容现有网络',
      ],
      specifications: [
        { name: '密钥生成速率', value: '1Mbps' },
        { name: '传输距离', value: '城域网100公里' },
        { name: '量子误码率', value: '<11%' },
        { name: '网络接口', value: '标准以太网' },
      ],
      applications: ['政府通信', '金融交易', '军事通信', '关键基础设施', '科研院所'],
      benefits: ['绝对通信安全', '未来技术储备', '国家安全保障', '技术领先优势'],
      image: '/images/products/quantum-communication-device.jpg',
      status: ProductStatus.COMING_SOON,
      slug: 'quantum-communication-device',
      tags: ['量子通信', '绝对安全', '密钥分发', '未来技术'],
      gradient: 'from-indigo-600 to-blue-600',
      accentColor: 'indigo',
    },

    // 智能化升级产品
    {
      id: 'smart-elevator-system',
      category: 'intelligent-digital',
      title: '智能电梯管理系统',
      subtitle: 'Smart Elevator Management System',
      description:
        '智能电梯管理系统，集成运行监控、故障预警、维保管理、乘客服务等功能，提升电梯安全和服务水平。',
      features: [
        '运行状态监控',
        '故障预测预警',
        '维保计划管理',
        '乘客呼叫服务',
        '能耗优化控制',
        '应急救援联动',
      ],
      specifications: [
        { name: '监控电梯数', value: '500台+' },
        { name: '故障预测', value: '提前7天预警' },
        { name: '响应时间', value: '<30秒' },
        { name: '数据存储', value: '3年运行数据' },
      ],
      applications: ['高层建筑', '商业中心', '住宅小区', '医院', '办公楼'],
      benefits: ['提升运行安全', '降低故障率', '优化维保效率', '改善乘梯体验'],
      image: '/images/products/smart-elevator-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'smart-elevator-system',
      tags: ['智能电梯', '故障预测', '维保管理', '安全监控'],
      gradient: 'from-slate-600 to-gray-600',
      accentColor: 'slate',
    },
  ]

  // 添加特色产品数据
  console.log('开始添加特色产品数据...')
  for (const product of featuredProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {
        ...product,
        features: JSON.stringify(product.features),
        specifications: JSON.stringify(product.specifications),
        applications: JSON.stringify(product.applications),
        benefits: JSON.stringify(product.benefits),
        tags: JSON.stringify(product.tags),
        updatedBy: admin.id,
      },
      create: {
        ...product,
        features: JSON.stringify(product.features),
        specifications: JSON.stringify(product.specifications),
        applications: JSON.stringify(product.applications),
        benefits: JSON.stringify(product.benefits),
        tags: JSON.stringify(product.tags),
        updatedBy: admin.id,
      },
    })
    console.log(`✅ 添加特色产品: ${product.title}`)
  }

  console.log(`🎉 成功添加 ${featuredProducts.length} 个特色产品`)

  // 最终完整统计
  const finalStats = await prisma.product.groupBy({
    by: ['category'],
    _count: { id: true },
  })

  console.log('\n📊 各分类产品数量:')
  finalStats.forEach(stat => {
    console.log(`${stat.category}: ${stat._count.id} 个产品`)
  })

  const statusStats = await prisma.product.groupBy({
    by: ['status'],
    _count: { id: true },
  })

  console.log('\n📈 产品状态统计:')
  statusStats.forEach(stat => {
    console.log(`${stat.status}: ${stat._count.id} 个产品`)
  })

  const totalCount = await prisma.product.count()
  console.log(`\n🎯 产品数据创建完成！总计: ${totalCount} 个产品`)

  console.log('\n✨ 产品模拟数据特点:')
  console.log('- 覆盖6大产品分类')
  console.log('- 包含详细的产品规格和应用场景')
  console.log('- 涵盖传统产品和创新技术')
  console.log('- 适用于多个行业领域')
  console.log('- 包含即将推出的前沿产品')
}

async function main() {
  try {
    await addFeaturedProducts()
  } catch (error) {
    console.error('添加特色产品失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
