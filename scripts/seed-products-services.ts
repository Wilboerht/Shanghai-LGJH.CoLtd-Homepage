import { PrismaClient, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function seedProductsAndServices() {
  console.log('🔄 开始填充产品和服务数据到数据库...\n')

  try {
    // 获取管理员用户
    const admin = await prisma.user.findFirst({
      where: { isAdmin: true },
    })

    if (!admin) {
      console.error('❌ 未找到管理员用户，请先创建管理员账户')
      return
    }

    console.log(`👤 使用管理员账户: ${admin.email}\n`)

    // 1. 同步产品数据
    console.log('📦 同步产品数据...')
    let productsCreated = 0

    const productsData = [
      // 智能数字化产品
      {
        category: '智能数字化产品',
        title: '综合管理集成平台',
        subtitle: 'Integrated Management Platform',
        description:
          '统一的智能化管理平台，集成安防、消防、能耗、设备等多个子系统，实现统一监控和管理。支持多种协议接入，提供丰富的数据分析和报表功能。',
        features: [
          '多系统集成',
          '统一监控界面',
          '实时数据展示',
          '智能报警管理',
          '移动端支持',
          '数据分析报告',
        ],
        specifications: [
          { name: '支持子系统', value: '20+', unit: '个' },
          { name: '并发用户', value: '1000+', unit: '人' },
          { name: '数据处理', value: '实时', unit: '' },
          { name: '部署方式', value: '云端/本地', unit: '' },
        ],
        applications: ['智慧园区', '商业综合体', '工业园区', '政府机构'],
        benefits: ['提升管理效率40%', '降低运营成本30%', '提高安全保障99%', '减少人工巡检80%'],
        image: '/images/products/integrated-platform.jpg',
        priceInfo: { type: 'quote', currency: 'CNY', note: '根据项目规模定制报价' },
        status: ProductStatus.AVAILABLE,
        slug: 'integrated-management-platform',
        tags: ['集成平台', '智能管理', '数据分析', '多系统'],
        gradient: 'from-blue-600 to-cyan-600',
        accentColor: 'blue',
      },
      {
        category: '智能数字化产品',
        title: '智能数据分析平台',
        subtitle: 'Intelligent Data Analytics Platform',
        description:
          '基于大数据和AI技术的智能数据分析平台，提供实时数据处理、智能分析、预测建模等功能，帮助企业实现数据驱动决策。',
        features: [
          '实时数据处理',
          '智能分析算法',
          '预测建模',
          '可视化报表',
          '自定义仪表板',
          'API接口',
        ],
        specifications: [
          { name: '数据处理能力', value: 'TB级', unit: '' },
          { name: '分析算法', value: '50+', unit: '种' },
          { name: '响应时间', value: '<100ms', unit: '' },
          { name: '数据源支持', value: '100+', unit: '种' },
        ],
        applications: ['金融分析', '零售预测', '制造优化', '物流调度'],
        benefits: ['提升决策效率60%', '降低分析成本50%', '提高预测准确率85%', '减少人工分析70%'],
        image: '/images/products/data-analytics.jpg',
        priceInfo: {
          type: 'range',
          value: '50万-200万',
          currency: 'CNY',
          note: '按功能模块和用户数量计费',
        },
        status: ProductStatus.AVAILABLE,
        slug: 'intelligent-data-analytics-platform',
        tags: ['大数据', 'AI分析', '预测建模', '可视化'],
        gradient: 'from-purple-600 to-blue-600',
        accentColor: 'purple',
      },
      // 智能安防产品
      {
        category: '智能安防产品',
        title: 'AI视频监控系统',
        subtitle: 'AI Video Surveillance System',
        description:
          '基于深度学习的智能视频监控系统，支持人脸识别、行为分析、异常检测等功能，提供7x24小时智能安防保障。',
        features: ['人脸识别', '行为分析', '异常检测', '智能跟踪', '夜视功能', '云端存储'],
        specifications: [
          { name: '识别准确率', value: '99.5%', unit: '' },
          { name: '支持摄像头', value: '1000+', unit: '路' },
          { name: '存储时长', value: '90天', unit: '' },
          { name: '响应时间', value: '<3秒', unit: '' },
        ],
        applications: ['园区安防', '商场监控', '交通监管', '工厂安全'],
        benefits: ['提升安防效率80%', '降低误报率90%', '减少人工监控60%', '提高响应速度5倍'],
        image: '/images/products/ai-surveillance.jpg',
        priceInfo: {
          type: 'range',
          value: '10万-100万',
          currency: 'CNY',
          note: '按摄像头数量和功能配置计费',
        },
        status: ProductStatus.AVAILABLE,
        slug: 'ai-video-surveillance-system',
        tags: ['AI监控', '人脸识别', '行为分析', '智能安防'],
        gradient: 'from-red-600 to-orange-600',
        accentColor: 'red',
      },
      {
        category: '智能安防产品',
        title: '智能门禁控制系统',
        subtitle: 'Smart Access Control System',
        description:
          '集成多种身份验证技术的智能门禁系统，支持人脸识别、指纹识别、刷卡等多种认证方式，提供完整的出入管理解决方案。',
        features: ['多重身份验证', '远程控制', '访客管理', '时间权限', '实时监控', '数据统计'],
        specifications: [
          { name: '识别速度', value: '<1秒', unit: '' },
          { name: '支持门点', value: '500+', unit: '个' },
          { name: '用户容量', value: '10万+', unit: '人' },
          { name: '工作温度', value: '-20°C~60°C', unit: '' },
        ],
        applications: ['办公楼宇', '住宅小区', '工业园区', '学校医院'],
        benefits: ['提升安全等级95%', '简化管理流程70%', '降低管理成本40%', '提高通行效率3倍'],
        image: '/images/products/access-control.jpg',
        priceInfo: {
          type: 'range',
          value: '5万-50万',
          currency: 'CNY',
          note: '按门点数量和功能配置计费',
        },
        status: ProductStatus.AVAILABLE,
        slug: 'smart-access-control-system',
        tags: ['门禁系统', '身份验证', '访客管理', '安全控制'],
        gradient: 'from-green-600 to-teal-600',
        accentColor: 'green',
      },
      // 智能消防产品
      {
        category: '智能消防产品',
        title: '智能消防报警系统',
        subtitle: 'Smart Fire Alarm System',
        description:
          '基于物联网技术的智能消防报警系统，实现火灾早期预警、自动报警、联动控制等功能，保障生命财产安全。',
        features: ['早期预警', '自动报警', '联动控制', '远程监控', '数据记录', '移动推送'],
        specifications: [
          { name: '响应时间', value: '<30秒', unit: '' },
          { name: '监控点位', value: '10000+', unit: '个' },
          { name: '误报率', value: '<0.1%', unit: '' },
          { name: '工作温度', value: '-10°C~55°C', unit: '' },
        ],
        applications: ['商业建筑', '工业厂房', '住宅小区', '公共场所'],
        benefits: ['提升消防安全99%', '减少火灾损失80%', '快速应急响应', '降低误报率95%'],
        image: '/images/products/fire-alarm.jpg',
        priceInfo: {
          type: 'range',
          value: '20万-150万',
          currency: 'CNY',
          note: '按监控点位和系统规模计费',
        },
        status: ProductStatus.AVAILABLE,
        slug: 'smart-fire-alarm-system',
        tags: ['消防报警', '物联网', '早期预警', '联动控制'],
        gradient: 'from-red-600 to-pink-600',
        accentColor: 'red',
      },
      {
        category: '智能消防产品',
        title: '消防设备管理平台',
        subtitle: 'Fire Equipment Management Platform',
        description:
          '专业的消防设备管理平台，实现消防设备状态监控、维护管理、巡检记录等功能，确保消防设备正常运行。',
        features: ['设备监控', '维护管理', '巡检记录', '故障预警', '数据分析', '报表生成'],
        specifications: [
          { name: '设备接入', value: '5000+', unit: '台' },
          { name: '巡检效率', value: '提升80%', unit: '' },
          { name: '故障预测', value: '准确率90%', unit: '' },
          { name: '数据存储', value: '5年', unit: '' },
        ],
        applications: ['消防部门', '物业公司', '工业企业', '商业综合体'],
        benefits: ['提升管理效率70%', '降低维护成本50%', '预防设备故障85%', '确保设备可用性99%'],
        image: '/images/products/fire-equipment.jpg',
        priceInfo: {
          type: 'range',
          value: '15万-80万',
          currency: 'CNY',
          note: '按设备数量和功能模块计费',
        },
        status: ProductStatus.AVAILABLE,
        slug: 'fire-equipment-management-platform',
        tags: ['设备管理', '消防维护', '巡检记录', '故障预警'],
        gradient: 'from-orange-600 to-red-600',
        accentColor: 'orange',
      },
      // 智能能耗产品
      {
        category: '智能能耗产品',
        title: '智能能耗监控系统',
        subtitle: 'Smart Energy Monitoring System',
        description:
          '基于物联网和大数据技术的智能能耗监控系统，实现能源消耗实时监控、分析优化、节能管理等功能。',
        features: ['实时监控', '能耗分析', '节能优化', '报表统计', '预警提醒', '移动应用'],
        specifications: [
          { name: '监控精度', value: '±1%', unit: '' },
          { name: '数据采集', value: '秒级', unit: '' },
          { name: '节能效果', value: '15-30%', unit: '' },
          { name: '设备接入', value: '1000+', unit: '台' },
        ],
        applications: ['工业园区', '商业建筑', '学校医院', '政府机关'],
        benefits: ['降低能耗成本25%', '提升能效管理80%', '减少碳排放30%', '优化用能结构'],
        image: '/images/products/energy-monitoring.jpg',
        priceInfo: {
          type: 'range',
          value: '30万-200万',
          currency: 'CNY',
          note: '按监控点位和系统规模计费',
        },
        status: ProductStatus.AVAILABLE,
        slug: 'smart-energy-monitoring-system',
        tags: ['能耗监控', '节能管理', '数据分析', '绿色环保'],
        gradient: 'from-green-600 to-emerald-600',
        accentColor: 'green',
      },
      // 智能设备产品
      {
        category: '智能设备产品',
        title: '物联网网关设备',
        subtitle: 'IoT Gateway Device',
        description:
          '工业级物联网网关设备，支持多种通信协议，实现设备接入、数据采集、边缘计算等功能，是物联网系统的核心组件。',
        features: ['多协议支持', '边缘计算', '数据采集', '远程管理', '安全加密', '本地存储'],
        specifications: [
          { name: '通信协议', value: '20+', unit: '种' },
          { name: '设备接入', value: '500+', unit: '台' },
          { name: '处理能力', value: '1000万次/秒', unit: '' },
          { name: '工作温度', value: '-40°C~85°C', unit: '' },
        ],
        applications: ['工业自动化', '智慧城市', '农业物联网', '环境监测'],
        benefits: ['降低部署成本40%', '提升数据传输效率5倍', '增强系统稳定性99%', '支持离线运行'],
        image: '/images/products/iot-gateway.jpg',
        priceInfo: {
          type: 'fixed',
          value: '5000-50000',
          currency: 'CNY',
          note: '按设备型号和配置计费',
        },
        status: ProductStatus.AVAILABLE,
        slug: 'iot-gateway-device',
        tags: ['物联网', '网关设备', '边缘计算', '数据采集'],
        gradient: 'from-gray-600 to-slate-600',
        accentColor: 'gray',
      },
    ]

    for (const product of productsData) {
      try {
        const existingProduct = await prisma.product.findFirst({
          where: { slug: product.slug },
        })

        if (!existingProduct) {
          await prisma.product.create({
            data: {
              ...product,
              features: JSON.stringify(product.features),
              specifications: JSON.stringify(product.specifications),
              applications: JSON.stringify(product.applications),
              benefits: JSON.stringify(product.benefits),
              // priceInfo字段已从Product模型中移除
              // priceInfo: JSON.stringify(product.priceInfo),
              tags: JSON.stringify(product.tags),
              updatedBy: admin.id,
            },
          })
          productsCreated++
          console.log(`   ✅ 创建产品: ${product.title}`)
        } else {
          console.log(`   ⏭️  产品已存在: ${product.title}`)
        }
      } catch (error) {
        console.error(`   ❌ 创建产品失败 (${product.title}):`, error)
      }
    }

    console.log(`\n📦 产品数据同步完成，共创建 ${productsCreated} 个产品\n`)

    // 2. 同步服务数据
    console.log('🛠️ 同步服务数据...')
    let servicesCreated = 0

    const servicesData = [
      {
        title: '智能运维服务',
        subtitle: 'Smart Operation & Maintenance Service',
        description:
          '基于AI和大数据技术的智能运维服务，提供设备监控、故障预测、维护优化等全方位运维解决方案，帮助企业提升运维效率，降低运营成本。',
        process: [
          {
            step: 1,
            title: '系统部署',
            description: '部署智能监控系统，建立数据采集体系',
            icon: 'Monitor',
          },
          { step: 2, title: '模型训练', description: '基于历史数据训练AI预测模型', icon: 'Brain' },
          {
            step: 3,
            title: '智能监控',
            description: '实时监控设备状态，预测潜在故障',
            icon: 'AlertTriangle',
          },
          {
            step: 4,
            title: '持续优化',
            description: '持续优化算法模型，提升预测准确率',
            icon: 'TrendingUp',
          },
        ],
        visualElements: {
          primaryColor: 'blue-600',
          secondaryColor: 'indigo-600',
          backgroundImage: '/images/services/smart-maintenance-bg.jpg',
          icon: 'Settings',
        },
        ctaConfig: {
          text: '开启智能运维新时代',
          link: '/contact',
          style: 'primary',
        },
        metrics: [
          { label: '设备故障预测准确率', value: '95%', unit: '' },
          { label: '运维成本降低', value: '40%', unit: '' },
          { label: '设备可用性提升', value: '99.5%', unit: '' },
          { label: '响应时间缩短', value: '80%', unit: '' },
        ],
        features: ['智能监控', '故障预测', '预防性维护', '数据分析', '移动应用', '24/7支持'],
        slug: 'smart-operation-maintenance',
        category: '智能运维',
      },
      {
        title: '工程实施服务',
        subtitle: 'Engineering Implementation Service',
        description:
          '专业的智能化工程实施服务，从方案设计到系统集成，提供全流程的工程实施解决方案，确保项目高质量交付。',
        process: [
          {
            step: 1,
            title: '需求分析',
            description: '深入了解客户需求，制定技术方案',
            icon: 'Search',
          },
          {
            step: 2,
            title: '设计规划',
            description: '详细的工程设计和施工计划制定',
            icon: 'FileText',
          },
          {
            step: 3,
            title: '工程实施',
            description: '专业团队进行工程施工和系统集成',
            icon: 'Wrench',
          },
          {
            step: 4,
            title: '验收交付',
            description: '严格验收测试，确保工程质量达标',
            icon: 'CheckCircle',
          },
        ],
        visualElements: {
          primaryColor: 'orange-600',
          secondaryColor: 'red-600',
          backgroundImage: '/images/services/engineering-bg.jpg',
          icon: 'Building2',
        },
        ctaConfig: {
          text: '开启智能化工程新篇章',
          link: '/contact',
          style: 'primary',
        },
        metrics: [
          { label: '项目按时交付率', value: '98%', unit: '' },
          { label: '客户满意度', value: '95%', unit: '' },
          { label: '工程质量合格率', value: '100%', unit: '' },
          { label: '平均项目周期', value: '3-6', unit: '个月' },
        ],
        features: ['方案设计', '系统集成', '工程施工', '质量验收', '技术培训', '售后支持'],
        slug: 'engineering-implementation',
        category: '工程实施',
      },
    ]

    for (const service of servicesData) {
      try {
        const existingService = await prisma.service.findFirst({
          where: { slug: service.slug },
        })

        if (!existingService) {
          await prisma.service.create({
            data: {
              ...service,
              process: JSON.stringify(service.process),
              visualElements: JSON.stringify(service.visualElements),
              ctaConfig: JSON.stringify(service.ctaConfig),
              metrics: JSON.stringify(service.metrics),
              features: JSON.stringify(service.features),
              updatedBy: admin.id,
            },
          })
          servicesCreated++
          console.log(`   ✅ 创建服务: ${service.title}`)
        } else {
          console.log(`   ⏭️  服务已存在: ${service.title}`)
        }
      } catch (error) {
        console.error(`   ❌ 创建服务失败 (${service.title}):`, error)
      }
    }

    console.log(`\n🛠️ 服务数据同步完成，共创建 ${servicesCreated} 个服务\n`)

    console.log('🎉 产品和服务数据同步完成！')
    console.log(`📋 同步结果总结:`)
    console.log(`   - 产品: ${productsCreated} 个新增`)
    console.log(`   - 服务: ${servicesCreated} 个新增`)
  } catch (error) {
    console.error('❌ 同步产品和服务数据时出错:', error)
  }
}

seedProductsAndServices()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
