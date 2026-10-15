import { PrismaClient, ProductStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function addMoreProducts() {
  console.log('开始添加更多产品数据...')

  // 获取管理员用户
  const admin = await prisma.user.findFirst({
    where: { isAdmin: true },
  })

  if (!admin) {
    console.error('未找到管理员用户')
    return
  }

  // 更多产品数据
  const additionalProducts = [
    // 更多智能数字化产品
    {
      id: 'smart-building-platform',
      category: 'intelligent-digital',
      title: '智慧楼宇管理平台',
      subtitle: 'Smart Building Management Platform',
      description:
        '专为现代楼宇设计的综合管理平台，集成楼宇自控、能耗管理、设备维护、访客管理等功能，实现楼宇的智能化运营。',
      features: [
        '楼宇自控系统集成',
        '能耗优化管理',
        '设备预测性维护',
        '访客智能管理',
        '应急事件响应',
        '运营数据分析',
      ],
      specifications: [
        { name: '管理面积', value: '100万平方米+' },
        { name: '集成子系统', value: '15+个' },
        { name: '设备接入量', value: '10000+台' },
        { name: '用户并发', value: '500+' },
      ],
      applications: ['商务写字楼', '购物中心', '医院', '学校', '政府大楼'],
      benefits: ['降低运营成本25%', '提升管理效率', '优化用户体验', '实现绿色节能'],
      image: '/images/products/smart-building-platform.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'smart-building-platform',
      tags: ['智慧楼宇', '集成管理', '节能优化', '预测维护'],
      gradient: 'from-indigo-600 to-purple-600',
      accentColor: 'indigo',
    },
    {
      id: 'cloud-security-platform',
      category: 'intelligent-digital',
      title: '云安防管理平台',
      subtitle: 'Cloud Security Management Platform',
      description:
        '基于云计算架构的安防管理平台，支持多点部署、统一管理、弹性扩展，为分布式安防系统提供云端解决方案。',
      features: [
        '云端统一管理',
        '多点分布部署',
        '弹性资源扩展',
        '数据安全备份',
        '移动端应用',
        'AI智能分析',
      ],
      specifications: [
        { name: '并发用户', value: '5000+' },
        { name: '数据存储', value: '无限扩展' },
        { name: '系统可用性', value: '99.95%' },
        { name: '部署时间', value: '1天内' },
      ],
      applications: ['连锁企业', '分布式办公', '多园区管理', '远程监控'],
      benefits: ['降低IT投资', '快速部署实施', '统一运维管理', '数据安全可靠'],
      image: '/images/products/cloud-security-platform.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'cloud-security-platform',
      tags: ['云安防', '多点管理', '弹性扩展', 'SaaS服务'],
      gradient: 'from-sky-600 to-blue-600',
      accentColor: 'sky',
    },

    // 更多安防监控设备
    {
      id: 'thermal-imaging-camera',
      category: 'security-monitoring',
      title: '热成像摄像机',
      subtitle: 'Thermal Imaging Camera',
      description:
        '专业热成像摄像机，能够在完全黑暗和恶劣天气条件下进行监控，具备温度检测和异常预警功能。',
      features: [
        '热成像技术',
        '温度异常检测',
        '全黑环境监控',
        '恶劣天气适应',
        '双光谱融合',
        '智能温度分析',
      ],
      specifications: [
        { name: '热敏分辨率', value: '640×480像素' },
        { name: '温度精度', value: '±2°C或±2%' },
        { name: '检测距离', value: '1500米' },
        { name: '工作温度', value: '-40°C至65°C' },
      ],
      applications: ['边境监控', '森林防火', '工业检测', '夜间安防', '疫情防控'],
      benefits: ['全天候监控能力', '早期火灾预警', '远距离目标检测', '恶劣环境适应'],
      image: '/images/products/thermal-imaging-camera.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'thermal-imaging-camera',
      tags: ['热成像', '温度检测', '夜视监控', '异常预警'],
      gradient: 'from-yellow-600 to-orange-600',
      accentColor: 'yellow',
    },
    {
      id: 'license-plate-recognition',
      category: 'security-monitoring',
      title: '车牌识别系统',
      subtitle: 'License Plate Recognition System',
      description:
        '高精度车牌识别系统，支持多种车牌类型识别，集成道闸控制、收费管理、黑白名单等功能。',
      features: [
        '高精度车牌识别',
        '多车牌类型支持',
        '快速通行控制',
        '黑白名单管理',
        '收费系统集成',
        '车辆轨迹追踪',
      ],
      specifications: [
        { name: '识别准确率', value: '99.8%以上' },
        { name: '识别速度', value: '<0.3秒' },
        { name: '支持车牌', value: '蓝牌/黄牌/绿牌/新能源' },
        { name: '工作环境', value: '-30°C至70°C' },
      ],
      applications: ['停车场管理', '小区门禁', '高速收费', '交通执法', '园区管理'],
      benefits: ['提高通行效率', '降低人工成本', '精准数据记录', '无人值守运营'],
      image: '/images/products/license-plate-recognition.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'license-plate-recognition',
      tags: ['车牌识别', '智能停车', '自动收费', '交通管理'],
      gradient: 'from-emerald-600 to-green-600',
      accentColor: 'emerald',
    },

    // 更多消防安全设备
    {
      id: 'smoke-detection-system',
      category: 'fire-safety',
      title: '智能烟感系统',
      subtitle: 'Smart Smoke Detection System',
      description: '新一代智能烟感系统，采用光电感烟技术，具备高灵敏度、低误报率、无线传输等特点。',
      features: [
        '光电感烟技术',
        '高灵敏度检测',
        '误报智能抑制',
        '无线信号传输',
        '电池寿命监测',
        '自检功能完善',
      ],
      specifications: [
        { name: '检测灵敏度', value: '0.08-0.12dB/m' },
        { name: '响应时间', value: '<8秒' },
        { name: '电池寿命', value: '10年+' },
        { name: '无线距离', value: '空旷1500米' },
      ],
      applications: ['住宅建筑', '办公楼宇', '酒店宾馆', '养老院', '文物建筑'],
      benefits: ['早期火灾发现', '降低误报干扰', '安装维护简便', '长期稳定运行'],
      image: '/images/products/smoke-detection-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'smoke-detection-system',
      tags: ['智能烟感', '火灾预警', '无线传输', '长寿命'],
      gradient: 'from-gray-600 to-red-600',
      accentColor: 'gray',
    },
    {
      id: 'emergency-broadcast-system',
      category: 'fire-safety',
      title: '应急广播系统',
      subtitle: 'Emergency Broadcast System',
      description:
        '智能应急广播系统，支持分区广播、语音合成、多语言播报，与消防系统联动实现应急疏散指导。',
      features: [
        '分区域广播控制',
        '语音合成播报',
        '多语言支持',
        '消防联动触发',
        '远程集中控制',
        '音质清晰保真',
      ],
      specifications: [
        { name: '覆盖区域', value: '200个分区' },
        { name: '音频质量', value: 'CD级别48kHz' },
        { name: '功率输出', value: '2000W' },
        { name: '控制方式', value: '本地+网络+移动端' },
      ],
      applications: ['商业综合体', '工业园区', '学校医院', '交通枢纽', '大型场馆'],
      benefits: ['快速应急响应', '精准信息传达', '多语言服务', '智能化管理'],
      image: '/images/products/emergency-broadcast-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'emergency-broadcast-system',
      tags: ['应急广播', '分区播报', '语音合成', '消防联动'],
      gradient: 'from-red-600 to-rose-600',
      accentColor: 'red',
    },

    // 更多通信网络设备
    {
      id: 'fiber-optic-system',
      category: 'communication-network',
      title: '光纤通信系统',
      subtitle: 'Fiber Optic Communication System',
      description: '高性能光纤通信系统，提供超高带宽、长距离传输、抗电磁干扰的网络连接解决方案。',
      features: [
        '超高带宽传输',
        '长距离信号覆盖',
        '抗电磁干扰',
        '超低传输延迟',
        '高可靠性设计',
        '易于扩展升级',
      ],
      specifications: [
        { name: '传输速率', value: '10Gbps-100Gbps' },
        { name: '传输距离', value: '单模80公里+' },
        { name: '信号延迟', value: '<0.5ms' },
        { name: '误码率', value: '<10^-12' },
      ],
      applications: ['数据中心互联', '园区骨干网', '城域网建设', '专网通信', '5G回传'],
      benefits: ['超大带宽容量', '传输稳定可靠', '面向未来扩展', '投资长期保护'],
      image: '/images/products/fiber-optic-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'fiber-optic-system',
      tags: ['光纤通信', '高速网络', '长距离传输', '企业骨干网'],
      gradient: 'from-cyan-600 to-teal-600',
      accentColor: 'cyan',
    },
    {
      id: 'wireless-bridge-system',
      category: 'communication-network',
      title: '无线网桥系统',
      subtitle: 'Wireless Bridge System',
      description:
        '专业无线网桥系统，提供点对点或点对多点的无线网络连接，适用于难以布线的远距离网络传输场景。',
      features: [
        '远距离无线传输',
        '点对点/点对多点',
        '高增益定向天线',
        '自适应调制技术',
        '恶劣天气适应',
        '网络冗余备份',
      ],
      specifications: [
        { name: '传输距离', value: '最远50公里' },
        { name: '传输速率', value: '300Mbps-1Gbps' },
        { name: '工作频段', value: '5.8GHz免许可' },
        { name: '天线增益', value: '23-30dBi' },
      ],
      applications: ['远程监控', '园区互联', '临时网络', '应急通信', '海岛通信'],
      benefits: ['快速部署实施', '避免布线困难', '成本效益显著', '维护简单便捷'],
      image: '/images/products/wireless-bridge-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'wireless-bridge-system',
      tags: ['无线网桥', '远距离传输', '点对点通信', '免布线'],
      gradient: 'from-violet-600 to-purple-600',
      accentColor: 'violet',
    },

    // 更多能耗管理设备
    {
      id: 'hvac-control-system',
      category: 'energy-management',
      title: '暖通空调控制系统',
      subtitle: 'HVAC Control System',
      description:
        '智能暖通空调控制系统，实现精确温控、分区管理、节能运行，为建筑提供舒适节能的环境控制。',
      features: [
        '精确温度控制',
        '分区独立管理',
        '节能算法优化',
        '设备故障诊断',
        '远程监控管理',
        '运行数据分析',
      ],
      specifications: [
        { name: '控制精度', value: '温度±0.5°C，湿度±3%' },
        { name: '节能效果', value: '20-40%' },
        { name: '控制区域', value: '300个区域' },
        { name: '响应时间', value: '<3秒' },
      ],
      applications: ['办公楼宇', '商业中心', '工业厂房', '数据中心', '医院学校'],
      benefits: ['提供舒适环境', '显著节约能源', '延长设备寿命', '降低运维成本'],
      image: '/images/products/hvac-control-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'hvac-control-system',
      tags: ['暖通控制', '节能管理', '温度控制', '智能空调'],
      gradient: 'from-orange-600 to-red-600',
      accentColor: 'orange',
    },

    // 更多环境监测设备
    {
      id: 'water-quality-monitor',
      category: 'environmental-monitoring',
      title: '水质监测系统',
      subtitle: 'Water Quality Monitoring System',
      description: '在线水质监测系统，实时监测水质关键参数，确保用水安全，满足环保监管要求。',
      features: [
        '多参数在线监测',
        '实时数据传输',
        '自动校准功能',
        '超标报警提醒',
        '历史数据存储',
        '趋势分析预测',
      ],
      specifications: [
        { name: '监测参数', value: 'pH/浊度/余氯/COD/氨氮' },
        { name: '测量精度', value: 'pH±0.1，浊度±2%' },
        { name: '响应时间', value: '<30秒' },
        { name: '校准周期', value: '30天自动校准' },
      ],
      applications: ['自来水厂', '污水处理厂', '游泳池', '工业用水', '环保监测'],
      benefits: ['保障用水安全', '实时监控预警', '满足合规要求', '降低检测成本'],
      image: '/images/products/water-quality-monitor.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'water-quality-monitor',
      tags: ['水质监测', '在线检测', '环境保护', '安全保障'],
      gradient: 'from-blue-600 to-teal-600',
      accentColor: 'blue',
    },
    {
      id: 'noise-monitoring-system',
      category: 'environmental-monitoring',
      title: '噪音监测系统',
      subtitle: 'Noise Monitoring System',
      description:
        '专业噪音监测系统，实时监测环境噪音水平，支持多点布控和数据分析，为环境保护提供科学依据。',
      features: [
        '实时噪音监测',
        '多点网络布控',
        '频谱分析功能',
        '超标自动报警',
        '数据统计分析',
        '移动端查看',
      ],
      specifications: [
        { name: '测量范围', value: '30-130dB(A)' },
        { name: '测量精度', value: '±1.5dB' },
        { name: '频率范围', value: '20Hz-20kHz' },
        { name: '数据存储', value: '2年以上' },
      ],
      applications: ['建筑工地', '交通要道', '工业园区', '居民区', '学校医院'],
      benefits: ['环境噪音控制', '合规监管支持', '纠纷处理依据', '城市规划参考'],
      image: '/images/products/noise-monitoring-system.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'noise-monitoring-system',
      tags: ['噪音监测', '环境监控', '数据分析', '合规管理'],
      gradient: 'from-teal-600 to-cyan-600',
      accentColor: 'teal',
    },

    // 更多物联网设备
    {
      id: 'smart-sensor-network',
      category: 'iot-devices',
      title: '智能传感器网络',
      subtitle: 'Smart Sensor Network',
      description: '无线智能传感器网络系统，支持多种传感器类型，实现环境参数的全面感知和智能分析。',
      features: [
        '无线自组网络',
        '多传感器融合',
        '低功耗长续航',
        '边缘智能处理',
        '云端数据管理',
        '可视化监控',
      ],
      specifications: [
        { name: '传感器类型', value: '温湿度/光照/振动/气体/土壤' },
        { name: '通信距离', value: '空旷3公里' },
        { name: '电池寿命', value: '5-10年' },
        { name: '网络容量', value: '2000+节点' },
      ],
      applications: ['智慧农业', '环境监测', '工业4.0', '智能建筑', '城市管理'],
      benefits: ['部署灵活便捷', '维护成本极低', '数据丰富全面', '扩展能力强'],
      image: '/images/products/smart-sensor-network.jpg',
      status: ProductStatus.AVAILABLE,
      slug: 'smart-sensor-network',
      tags: ['传感器网络', '物联网', '无线监测', '边缘计算'],
      gradient: 'from-violet-600 to-purple-600',
      accentColor: 'violet',
    },

    // 即将推出的创新产品
    {
      id: 'ai-behavior-analysis',
      category: 'intelligent-digital',
      title: 'AI行为分析平台',
      subtitle: 'AI Behavior Analysis Platform',
      description:
        '基于深度学习的行为分析平台，能够识别异常行为、预测安全风险，为安防系统提供智能化升级。',
      features: [
        '行为模式识别',
        '异常行为检测',
        '风险等级评估',
        '实时预警推送',
        '学习能力优化',
        '可视化分析',
      ],
      specifications: [
        { name: '识别行为类型', value: '60+种常见行为' },
        { name: '检测准确率', value: '96%以上' },
        { name: '处理延迟', value: '<50ms' },
        { name: '学习优化', value: '自适应算法' },
      ],
      applications: ['公共安全', '工业安全', '交通监控', '商业分析', '智慧城市'],
      benefits: ['预防安全事故', '提升响应效率', '降低安全风险', '支持智能决策'],
      image: '/images/products/ai-behavior-analysis.jpg',
      status: ProductStatus.COMING_SOON,
      slug: 'ai-behavior-analysis',
      tags: ['AI分析', '行为识别', '异常检测', '风险预测'],
      gradient: 'from-violet-600 to-purple-600',
      accentColor: 'violet',
    },
    {
      id: 'smart-patrol-robot',
      category: 'security-monitoring',
      title: '智能巡检机器人',
      subtitle: 'Smart Patrol Robot',
      description: '自主巡检机器人，配备多种传感器和AI算法，能够自动巡逻、检测异常、生成巡检报告。',
      features: [
        '自主导航巡逻',
        '多传感器检测',
        '异常智能识别',
        '自动充电续航',
        '语音交互功能',
        '巡检报告生成',
      ],
      specifications: [
        { name: '续航时间', value: '连续工作10小时' },
        { name: '巡检速度', value: '0.5-1.5m/s可调' },
        { name: '检测距离', value: '15米范围' },
        { name: '工作环境', value: '-10°C至50°C' },
      ],
      applications: ['园区巡检', '仓库监控', '工厂安全', '商场巡逻', '机场安防'],
      benefits: ['24小时无间断', '降低人工成本', '提高巡检效率', '数据记录完整'],
      image: '/images/products/smart-patrol-robot.jpg',
      status: ProductStatus.COMING_SOON,
      slug: 'smart-patrol-robot',
      tags: ['巡检机器人', '自主导航', '智能检测', '无人巡逻'],
      gradient: 'from-blue-600 to-indigo-600',
      accentColor: 'blue',
    },
    {
      id: 'ai-edge-computing-box',
      category: 'intelligent-digital',
      title: 'AI边缘计算盒',
      subtitle: 'AI Edge Computing Box',
      description: '专为边缘AI应用设计的计算设备，支持实时AI推理、本地数据处理、云边协同计算。',
      features: [
        'AI推理加速',
        '本地数据处理',
        '云边协同计算',
        '低延迟响应',
        '模型在线更新',
        '安全加密传输',
      ],
      specifications: [
        { name: 'AI算力', value: '25TOPS INT8' },
        { name: '处理延迟', value: '<5ms' },
        { name: '功耗控制', value: '<40W' },
        { name: '工作温度', value: '-20°C至60°C' },
      ],
      applications: ['智能制造', '自动驾驶', '智慧零售', '医疗影像', '视频分析'],
      benefits: ['实时AI处理', '数据隐私保护', '降低云端成本', '离线独立工作'],
      image: '/images/products/ai-edge-computing-box.jpg',
      status: ProductStatus.COMING_SOON,
      slug: 'ai-edge-computing-box',
      tags: ['AI计算', '边缘计算', '实时推理', '云边协同'],
      gradient: 'from-purple-600 to-indigo-600',
      accentColor: 'purple',
    },
  ]

  // 添加产品数据
  console.log('开始添加产品数据...')
  for (const product of additionalProducts) {
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
    console.log(`✅ 添加产品: ${product.title}`)
  }

  console.log(`🎉 成功添加 ${additionalProducts.length} 个产品`)

  // 最终统计
  const finalStats = await prisma.product.groupBy({
    by: ['category', 'status'],
    _count: { id: true },
  })

  console.log('\n📊 最终产品统计:')
  finalStats.forEach(stat => {
    console.log(`${stat.category} - ${stat.status}: ${stat._count.id} 个`)
  })

  const totalCount = await prisma.product.count()
  const availableCount = await prisma.product.count({ where: { status: ProductStatus.AVAILABLE } })
  const comingSoonCount = await prisma.product.count({
    where: { status: ProductStatus.COMING_SOON },
  })

  console.log(`\n📈 总体统计:`)
  console.log(`总产品数: ${totalCount}`)
  console.log(`可用产品: ${availableCount}`)
  console.log(`即将推出: ${comingSoonCount}`)
}

async function main() {
  try {
    await addMoreProducts()
  } catch (error) {
    console.error('添加产品数据失败:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
