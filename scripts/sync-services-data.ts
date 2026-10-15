import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function syncServicesData() {
  console.log('🔄 开始同步服务页面硬编码数据到数据库...\n')

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

    // 删除现有的服务数据（重新同步）
    console.log('🗑️  清理现有服务数据...')
    await prisma.service.deleteMany({})
    console.log('   ✅ 现有服务数据已清理\n')

    // 同步详细的服务数据
    console.log('🔧 同步详细服务数据...')
    let servicesCreated = 0

    const detailedServicesData = [
      {
        title: '数字化转型',
        subtitle: 'Digital Transformation',
        description:
          '企业数字化转型服务，提供数字化咨询、系统集成、数据治理、流程优化等全方位的数字化转型解决方案。',
        slug: 'digital-transformation',
        process: [
          {
            step: 1,
            title: '现状评估',
            description: '深入分析企业现状，识别数字化转型机会和挑战',
          },
          {
            step: 2,
            title: '战略规划',
            description: '制定数字化转型战略和实施路线图',
          },
          {
            step: 3,
            title: '技术实施',
            description: '部署数字化技术解决方案，实现系统集成',
          },
          {
            step: 4,
            title: '培训支持',
            description: '提供员工培训和持续技术支持服务',
          },
        ],
        visualElements: {
          icon: 'RefreshCw',
          color: 'blue-600',
          gradient: 'from-blue-900 via-indigo-900 to-purple-900',
        },
        ctaConfig: {
          primary: {
            text: '立即咨询',
            action: '/contact?service=digital-transformation',
          },
          secondary: {
            text: '预约演示',
            action: '/demo?service=digital-transformation',
          },
        },
        metrics: [
          { value: '80%', label: '效率提升' },
          { value: '60%', label: '成本降低' },
          { value: '200+', label: '转型项目' },
        ],
        features: [
          '数字化咨询规划',
          '系统集成服务',
          '数据治理平台',
          '流程数字化',
          '云平台迁移',
          '数字化培训',
        ],
      },
      {
        title: '智能运维服务',
        subtitle: 'Intelligent Operation Service',
        description:
          '智能化运维管理服务，基于AI和大数据技术，提供设备监控、故障预测、运维优化等智能运维解决方案。',
        slug: 'intelligent-operation',
        process: [
          {
            step: 1,
            title: '系统部署',
            description: '部署智能监控系统，建立数据采集体系',
          },
          {
            step: 2,
            title: '模型训练',
            description: '基于历史数据训练AI预测模型',
          },
          {
            step: 3,
            title: '智能监控',
            description: '实时监控设备状态，预测潜在故障',
          },
          {
            step: 4,
            title: '持续优化',
            description: '持续优化算法模型，提升预测准确率',
          },
        ],
        visualElements: {
          icon: 'Settings',
          color: 'green-600',
          gradient: 'from-green-900 via-emerald-900 to-teal-900',
        },
        ctaConfig: {
          primary: {
            text: '立即咨询',
            action: '/contact?service=intelligent-operation',
          },
          secondary: {
            text: '预约演示',
            action: '/demo?service=intelligent-operation',
          },
        },
        metrics: [
          { value: '95%', label: '故障预测准确率' },
          { value: '50%', label: '运维成本降低' },
          { value: '24×7', label: '监控服务' },
        ],
        features: [
          '设备智能监控',
          '故障预测分析',
          '运维流程优化',
          '远程运维支持',
          '性能优化建议',
          '运维数据分析',
        ],
      },
      {
        title: '智能化工程',
        subtitle: 'Intelligent Engineering',
        description:
          '智能化系统工程实施，包括智能建筑、智慧园区、工业自动化等各类智能化工程的设计、施工和调试。',
        slug: 'intelligent-engineering',
        process: [
          {
            step: 1,
            title: '需求分析',
            description: '深入了解客户需求，制定技术方案',
          },
          {
            step: 2,
            title: '设计规划',
            description: '详细的工程设计和施工计划制定',
          },
          {
            step: 3,
            title: '工程实施',
            description: '专业团队进行工程施工和系统集成',
          },
          {
            step: 4,
            title: '验收交付',
            description: '严格验收测试，确保工程质量达标',
          },
        ],
        visualElements: {
          icon: 'Building2',
          color: 'orange-600',
          gradient: 'from-orange-900 via-red-900 to-pink-900',
        },
        ctaConfig: {
          primary: {
            text: '立即咨询',
            action: '/contact?service=intelligent-engineering',
          },
          secondary: {
            text: '预约演示',
            action: '/demo?service=intelligent-engineering',
          },
        },
        metrics: [
          { value: '100+', label: '工程项目' },
          { value: '99%', label: '验收通过率' },
          { value: '30天', label: '平均工期' },
        ],
        features: [
          '工程设计规划',
          '系统集成实施',
          '设备安装调试',
          '项目管理服务',
          '验收测试',
          '技术培训',
        ],
      },
      {
        title: '消防工程',
        subtitle: 'Fire Engineering',
        description:
          '专业消防安全工程服务，提供消防系统设计、安装、维护和检测等全方位的消防安全解决方案。',
        slug: 'fire-engineering',
        process: [
          {
            step: 1,
            title: '方案设计',
            description: '根据建筑特点设计消防系统方案',
          },
          {
            step: 2,
            title: '设备安装',
            description: '专业安装消防设备和管网系统',
          },
          {
            step: 3,
            title: '系统调试',
            description: '全面调试测试消防系统功能',
          },
          {
            step: 4,
            title: '验收维护',
            description: '通过验收并提供后续维护服务',
          },
        ],
        visualElements: {
          icon: 'Flame',
          color: 'red-600',
          gradient: 'from-red-900 via-orange-900 to-yellow-900',
        },
        ctaConfig: {
          primary: {
            text: '立即咨询',
            action: '/contact?service=fire-engineering',
          },
          secondary: {
            text: '预约演示',
            action: '/demo?service=fire-engineering',
          },
        },
        metrics: [
          { value: '500+', label: '消防项目' },
          { value: '100%', label: '合规达标率' },
          { value: '24小时', label: '应急响应' },
        ],
        features: [
          '消防系统设计',
          '设备安装施工',
          '系统调试验收',
          '定期维护保养',
          '安全检测评估',
          '应急响应服务',
        ],
      },
      {
        title: '风险检测与评估',
        subtitle: 'Risk Assessment & Detection',
        description:
          '安全风险评估服务，通过专业的检测设备和评估方法，为企业提供全面的安全风险识别和评估服务。',
        slug: 'risk-assessment',
        process: [
          {
            step: 1,
            title: '现场调研',
            description: '深入现场了解实际情况，收集基础信息',
          },
          {
            step: 2,
            title: '风险识别',
            description: '运用专业方法识别各类安全风险',
          },
          {
            step: 3,
            title: '检测评估',
            description: '使用专业设备进行详细检测和评估',
          },
          {
            step: 4,
            title: '报告交付',
            description: '出具专业评估报告和整改建议',
          },
        ],
        visualElements: {
          icon: 'Shield',
          color: 'purple-600',
          gradient: 'from-purple-900 via-indigo-900 to-blue-900',
        },
        ctaConfig: {
          primary: {
            text: '立即咨询',
            action: '/contact?service=risk-assessment',
          },
          secondary: {
            text: '预约演示',
            action: '/demo?service=risk-assessment',
          },
        },
        metrics: [
          { value: '1000+', label: '评估项目' },
          { value: '98%', label: '风险识别率' },
          { value: '7天', label: '评估周期' },
        ],
        features: [
          '安全风险识别',
          '专业检测评估',
          '风险等级分析',
          '整改建议方案',
          '定期复查服务',
          '合规性审核',
        ],
      },
      {
        title: '其他服务',
        subtitle: 'Other Professional Services',
        description: '定制化服务和专业支持，包括技术咨询、培训服务、运维支持等多样化的专业服务。',
        slug: 'other-services',
        process: [
          {
            step: 1,
            title: '需求分析',
            description: '深入了解客户具体需求和期望',
          },
          {
            step: 2,
            title: '方案定制',
            description: '制定个性化的服务解决方案',
          },
          {
            step: 3,
            title: '服务实施',
            description: '专业团队提供高质量服务实施',
          },
          {
            step: 4,
            title: '持续支持',
            description: '提供持续的技术支持和服务保障',
          },
        ],
        visualElements: {
          icon: 'Grid3X3',
          color: 'gray-600',
          gradient: 'from-gray-900 via-slate-900 to-zinc-900',
        },
        ctaConfig: {
          primary: {
            text: '立即咨询',
            action: '/contact?service=other-services',
          },
          secondary: {
            text: '预约演示',
            action: '/demo?service=other-services',
          },
        },
        metrics: [
          { value: '300+', label: '咨询项目' },
          { value: '5000+', label: '培训人次' },
          { value: '24×7', label: '技术支持' },
        ],
        features: [
          '技术咨询服务',
          '专业培训课程',
          '运维支持服务',
          '定制开发服务',
          '系统升级服务',
          '技术支持热线',
        ],
      },
    ]

    for (const service of detailedServicesData) {
      try {
        const existingService = await prisma.service.findFirst({
          where: { slug: service.slug },
        })

        if (existingService) {
          // 更新现有服务
          await prisma.service.update({
            where: { id: existingService.id },
            data: {
              title: service.title,
              subtitle: service.subtitle,
              description: service.description,
              process: JSON.stringify(service.process),
              visualElements: JSON.stringify(service.visualElements),
              ctaConfig: JSON.stringify(service.ctaConfig),
              metrics: JSON.stringify(service.metrics),
              features: JSON.stringify(service.features),
              updatedBy: admin.id,
            },
          })
          console.log(`   ✅ 更新服务: ${service.title}`)
        } else {
          // 创建新服务
          await prisma.service.create({
            data: {
              title: service.title,
              subtitle: service.subtitle,
              description: service.description,
              slug: service.slug,
              category: '数字化服务', // 添加默认分类
              process: JSON.stringify(service.process),
              visualElements: JSON.stringify(service.visualElements),
              ctaConfig: JSON.stringify(service.ctaConfig),
              metrics: JSON.stringify(service.metrics),
              features: JSON.stringify(service.features),
              updatedBy: admin.id,
            },
          })
          console.log(`   ✅ 创建服务: ${service.title}`)
        }
        servicesCreated++
      } catch (error) {
        console.error(`   ❌ 处理服务失败 (${service.title}):`, error)
      }
    }

    console.log(`\n🔧 服务数据同步完成，共处理 ${servicesCreated} 个服务\n`)

    console.log('🎉 服务硬编码数据同步完成！')
  } catch (error) {
    console.error('❌ 同步服务数据时出错:', error)
  }
}

syncServicesData()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
