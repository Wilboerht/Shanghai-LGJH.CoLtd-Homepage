/**
 * Solutions页面7大分类数据结构
 * 根据开发计划文档定义的解决方案分类
 */

import { LucideIcon } from 'lucide-react'
import {
  Building2,
  Users,
  Truck,
  Factory,
  Package,
  Activity,
  ShoppingBag,
  Shield,
  Camera,
  Wifi,
  Zap,
  Settings,
  AlertTriangle,
  Heart,
  Hotel,
  Flame,
  Bell,
  MapPin,
  Eye,
  BarChart3,
  Glasses,
  Monitor,
  Server,
  Thermometer,
  Lock,
  Home,
  Grid3X3,
  Layers,
} from 'lucide-react'

export interface Solution {
  id: string
  title: string
  subtitle: string
  description: string
  content?: string // 新增富文本内容字段
  icon: LucideIcon
  image: string
  category: string
  features: string[]
  applications: string[]
  metrics: Array<{
    value: string
    label: string
  }>
  gradient: string
  accentColor: string
  slug: string
  benefits: string[]
  technologies: string[]
}

export interface SolutionCategory {
  id: string
  name: string
  description: string
  icon: LucideIcon
  gradient: string
  solutions: Solution[]
}

// 7大解决方案分类
export const solutionCategories: SolutionCategory[] = [
  {
    id: 'park-management',
    name: '园区管理',
    description: '智慧园区管理解决方案',
    icon: Building2,
    gradient: 'from-blue-600 to-cyan-600',
    solutions: [
      {
        id: 'smart-park-integrated',
        title: '智慧园区综合管理平台',
        subtitle: 'Smart Park Integrated Management',
        description:
          '基于物联网、大数据、AI技术的智慧园区综合管理解决方案，实现园区安防、消防、能耗、设备等统一管理。',
        icon: Building2,
        image: '/images/solutions/smart-park.jpg',
        category: 'park-management',
        features: [
          '统一管理平台',
          '智能安防系统',
          '消防联动控制',
          '能耗监控管理',
          '设备运维管理',
          '访客管理系统',
        ],
        applications: ['工业园区', '科技园区', '商务园区', '物流园区'],
        metrics: [
          { value: '40%', label: '管理效率提升' },
          { value: '30%', label: '能耗降低' },
          { value: '99%', label: '安全保障率' },
        ],
        gradient: 'from-blue-600 to-cyan-600',
        accentColor: 'blue',
        slug: 'smart-park-integrated',
        benefits: ['提升园区管理效率', '降低运营成本', '增强安全保障', '优化能源使用'],
        technologies: ['物联网技术', '大数据分析', '人工智能', '云计算平台'],
      },
      {
        id: 'smart-fire-safety',
        title: '智慧消防物联网平台',
        subtitle: 'Smart Fire Safety IoT Platform',
        description:
          '基于物联网技术的智能消防安全管理系统，实现火灾预防、监测和应急响应，提升99.9%系统可靠性，保障生命财产安全。',
        icon: Flame,
        image: '/images/solutions/smart-fire.jpg',
        category: 'park-management',
        features: [
          '智能火灾检测',
          '自动报警系统',
          '应急疏散指导',
          '消防设备监控',
          '预警分析系统',
          '应急响应联动',
        ],
        applications: ['商业建筑', '工业厂房', '住宅社区', '公共场所'],
        metrics: [
          { value: '99.9%', label: '系统可靠性' },
          { value: '90%', label: '响应时间节省' },
          { value: '95%', label: '火灾预防率' },
        ],
        gradient: 'from-orange-600 to-red-600',
        accentColor: 'orange',
        slug: 'smart-fire-safety',
        benefits: ['全方位安全防护', '快速响应预警', '智能分析预防', '降低安全风险'],
        technologies: ['物联网传感器', 'AI预测分析', '自动报警系统', '应急响应平台'],
      },
      {
        id: 'smart-patrol-system',
        title: '智能巡逻管理平台',
        subtitle: 'Smart Patrol Management System',
        description:
          '基于AI和物联网技术的智能巡逻解决方案，实现99.8%识别准确率，提升70%巡逻效率，降低50%安全风险。',
        icon: Shield,
        image: '/images/solutions/smart-patrol.jpg',
        category: 'park-management',
        features: [
          'AI智能识别',
          '智能路线规划',
          '实时视频监控',
          '异常行为检测',
          '巡逻数据分析',
          '应急响应联动',
        ],
        applications: ['园区巡逻', '社区安防', '工厂巡检', '商业巡逻'],
        metrics: [
          { value: '99.8%', label: '识别准确率' },
          { value: '70%', label: '巡逻效率提升' },
          { value: '50%', label: '安全风险降低' },
        ],
        gradient: 'from-blue-600 to-indigo-600',
        accentColor: 'blue',
        slug: 'smart-patrol-system',
        benefits: ['AI智能识别', '全方位安防', '高效巡逻管理', '实时监控预警'],
        technologies: ['人工智能', '视频分析', '路径优化', '实时通信'],
      },
      {
        id: 'vr-smart-park',
        title: 'VR智慧园区平台',
        subtitle: 'VR Smart Park Platform',
        description:
          '基于虚拟现实技术的智慧园区管理平台，提供沉浸式体验和智能化管理，提升90%管理效率，打造未来园区新模式。',
        icon: Glasses,
        image: '/images/solutions/vr-park.jpg',
        category: 'park-management',
        features: [
          'VR园区导览',
          '虚拟现实培训',
          '3D设施管理',
          '沉浸式体验',
          '智能化管理',
          '创新培训模式',
        ],
        applications: ['科技园区', '工业园区', '商业园区', '教育园区'],
        metrics: [
          { value: '360°', label: '全景体验' },
          { value: '90%', label: '管理效率提升' },
          { value: '80%', label: '培训成本降低' },
        ],
        gradient: 'from-violet-600 to-purple-600',
        accentColor: 'violet',
        slug: 'vr-smart-park',
        benefits: ['沉浸式体验', '智能化管理', '创新培训模式', '未来园区新模式'],
        technologies: ['虚拟现实技术', '3D建模', '沉浸式交互', '云计算平台'],
      },
    ],
  },
  {
    id: 'community-management',
    name: '社区管理',
    description: '智慧社区管理系统',
    icon: Users,
    gradient: 'from-green-600 to-emerald-600',
    solutions: [
      {
        id: 'smart-community-platform',
        title: '智慧社区管理平台',
        subtitle: 'Smart Community Management',
        description:
          '面向住宅社区的智能化管理解决方案，集成环境监测、门禁管理、安防监控、物业服务等功能，打造安全舒适的智慧社区生活环境。',
        icon: Users,
        image: '/images/solutions/smart-community.jpg',
        category: 'community-management',
        features: [
          '智能门禁系统',
          '视频监控联动',
          '环境监测管理',
          '物业服务平台',
          '便民服务系统',
          '停车管理系统',
          '社区公告发布',
          '能耗监控分析',
        ],
        applications: ['住宅小区', '高档社区', '老旧小区改造', '新建社区'],
        metrics: [
          { value: '50%', label: '服务效率提升' },
          { value: '95%', label: '居民满意度' },
          { value: '24×7', label: '环境监控' },
          { value: '99%', label: '安全保障率' },
        ],
        gradient: 'from-green-600 to-emerald-600',
        accentColor: 'green',
        slug: 'smart-community-platform',
        benefits: ['提升居住体验', '增强社区安全', '环境质量保障', '便民服务升级', '物业管理优化'],
        technologies: [
          '人脸识别',
          '环境传感器',
          '物联网监控',
          '移动互联网',
          '云服务平台',
          '智能硬件',
        ],
      },
      {
        id: 'smart-apartment-management',
        title: '智慧公寓管理平台',
        subtitle: 'Smart Apartment Management',
        description:
          '数字化公寓运营管理平台，提升40%运营效率，降低30%人工成本，实现租户满意度95%以上的智能化公寓管理体验。',
        icon: Building2,
        image: '/images/solutions/smart-apartment.jpg',
        category: 'community-management',
        features: [
          '智能门禁系统',
          '租户信息管理',
          '在线缴费服务',
          '设施报修系统',
          '访客管理',
          '能耗监控分析',
        ],
        applications: ['长租公寓', '青年公寓', '人才公寓', '服务式公寓'],
        metrics: [
          { value: '40%', label: '运营效率提升' },
          { value: '30%', label: '人工成本降低' },
          { value: '95%', label: '租户满意度' },
        ],
        gradient: 'from-blue-600 to-indigo-600',
        accentColor: 'blue',
        slug: 'smart-apartment-management',
        benefits: ['提升运营效率', '降低管理成本', '改善租户体验', '优化资源配置'],
        technologies: ['物联网技术', '人脸识别', '移动应用', '云计算平台'],
      },
      {
        id: 'residential-safety-system',
        title: '住宅小区安消一体平台',
        subtitle: 'Residential Safety System',
        description:
          '集成安防和消防功能的住宅小区综合安全管理系统，提供全方位的安全保障，实现智能化的社区安全管理。',
        icon: Home,
        image: '/images/solutions/residential-safety.jpg',
        category: 'community-management',
        features: [
          '安防消防联动',
          '智能门禁管理',
          '火灾报警联网',
          '视频监控系统',
          '应急响应管理',
          '居民安全服务',
        ],
        applications: ['住宅小区', '高档社区', '老旧小区改造', '新建住宅区'],
        metrics: [
          { value: '100%', label: '安全覆盖率' },
          { value: '24×7', label: '监控服务' },
          { value: '< 5分钟', label: '响应时间' },
        ],
        gradient: 'from-orange-600 to-red-600',
        accentColor: 'orange',
        slug: 'residential-safety-system',
        benefits: ['安消一体化', '智能化管理', '全方位保障', '快速响应'],
        technologies: ['物联网传感器', '智能门禁', '视频监控', '应急联动'],
      },
    ],
  },
  {
    id: 'public-transport',
    name: '公共交通',
    description: '公共交通智能化方案',
    icon: Truck,
    gradient: 'from-purple-600 to-indigo-600',
    solutions: [
      {
        id: 'intelligent-transport-system',
        title: '智能交通管理系统',
        subtitle: 'Intelligent Transport System',
        description:
          '基于大数据和AI技术的智能交通管理解决方案，实现交通流量监控、信号优化、事故预警等功能。',
        icon: Truck,
        image: '/images/solutions/intelligent-transport.jpg',
        category: 'public-transport',
        features: [
          '交通流量监控',
          '智能信号控制',
          '事故预警系统',
          '路况实时分析',
          '公交调度优化',
          '停车引导系统',
        ],
        applications: ['城市道路', '高速公路', '公交系统', '地铁站点'],
        metrics: [
          { value: '25%', label: '通行效率提升' },
          { value: '30%', label: '事故率降低' },
          { value: '20%', label: '拥堵减少' },
        ],
        gradient: 'from-purple-600 to-indigo-600',
        accentColor: 'purple',
        slug: 'intelligent-transport-system',
        benefits: ['缓解交通拥堵', '提升通行效率', '减少交通事故', '优化出行体验'],
        technologies: ['视频识别', '大数据分析', '边缘计算', '5G通信'],
      },
    ],
  },
  {
    id: 'industrial-manufacturing',
    name: '工业制造',
    description: '工业4.0智能制造方案',
    icon: Factory,
    gradient: 'from-orange-600 to-red-600',
    solutions: [
      {
        id: 'smart-manufacturing-platform',
        title: '智能制造管理平台',
        subtitle: 'Smart Manufacturing Platform',
        description: '面向工业4.0的智能制造解决方案，实现生产过程数字化、设备智能化、管理精细化。',
        icon: Factory,
        image: '/images/solutions/smart-manufacturing.jpg',
        category: 'industrial-manufacturing',
        features: [
          '生产过程监控',
          '设备状态管理',
          '质量控制系统',
          '能耗监测分析',
          '安全生产管理',
          '供应链协同',
        ],
        applications: ['制造工厂', '化工企业', '汽车制造', '电子制造'],
        metrics: [
          { value: '35%', label: '生产效率提升' },
          { value: '25%', label: '成本降低' },
          { value: '99%', label: '设备可用率' },
        ],
        gradient: 'from-orange-600 to-red-600',
        accentColor: 'orange',
        slug: 'smart-manufacturing-platform',
        benefits: ['提升生产效率', '降低运营成本', '保障生产安全', '优化资源配置'],
        technologies: ['工业物联网', '数字孪生', '机器学习', '边缘计算'],
      },
      {
        id: 'smart-server-room',
        title: '机房智能管理平台',
        subtitle: 'Smart Server Room Management',
        description:
          '基于物联网和AI技术的下一代数据中心管理平台，实现99.9%系统可用性，降低30%运维成本，提供7×24小时智能监控和预警服务。',
        icon: Server,
        image: '/images/solutions/smart-server-room.jpg',
        category: 'industrial-manufacturing',
        features: ['环境监控', '电源管理', '安全防护', '设备管理', '智能预警', '远程运维'],
        applications: ['企业数据中心', '云计算中心', '通信机房', '金融机房'],
        metrics: [
          { value: '99.9%', label: '系统可用性' },
          { value: '30%', label: '运维成本降低' },
          { value: '24×7', label: '智能监控' },
        ],
        gradient: 'from-blue-600 to-cyan-600',
        accentColor: 'blue',
        slug: 'smart-server-room',
        benefits: ['企业级可靠性', '智能化运维', '全方位监控', '预测性维护'],
        technologies: ['物联网传感器', 'AI预测分析', '实时监控', '云计算平台'],
      },
      {
        id: 'chemical-fire-safety',
        title: '化工厂消防灭火系统',
        subtitle: 'Chemical Fire Safety System',
        description:
          '专为化工行业设计的专业消防灭火系统，实现秒级火灾检测，提供多重安全保障，确保化工生产环境的绝对安全。',
        icon: Factory,
        image: '/images/solutions/chemical-fire.jpg',
        category: 'industrial-manufacturing',
        features: [
          '化学品火灾处理',
          '自动喷淋系统',
          '防爆监控设备',
          '多重安全保障',
          '专业灭火介质',
          '应急响应系统',
        ],
        applications: ['化工厂', '石化企业', '危化品仓库', '实验室'],
        metrics: [
          { value: 'ExdIICT6', label: '防爆等级' },
          { value: '< 3秒', label: '响应时间' },
          { value: '24×7', label: '监控覆盖' },
        ],
        gradient: 'from-red-600 to-orange-600',
        accentColor: 'red',
        slug: 'chemical-fire-safety',
        benefits: ['专业防护等级', '快速响应系统', '全方位监控', '化工专用设计'],
        technologies: ['防爆传感器', '自动喷淋', '专业灭火剂', '应急联动'],
      },
    ],
  },
  {
    id: 'logistics-transport',
    name: '物流运输',
    description: '智能物流运输系统',
    icon: Package,
    gradient: 'from-amber-600 to-yellow-600',
    solutions: [
      {
        id: 'smart-logistics-system',
        title: '智能物流管理系统',
        subtitle: 'Smart Logistics System',
        description:
          '基于物联网和大数据的智能物流解决方案，实现货物追踪、仓储管理、运输优化等功能。',
        icon: Package,
        image: '/images/solutions/smart-logistics.jpg',
        category: 'logistics-transport',
        features: [
          '货物实时追踪',
          '智能仓储管理',
          '运输路径优化',
          '配送调度系统',
          '库存智能预警',
          '客户服务平台',
        ],
        applications: ['物流中心', '配送网络', '仓储基地', '运输车队'],
        metrics: [
          { value: '30%', label: '配送效率提升' },
          { value: '20%', label: '运输成本降低' },
          { value: '99%', label: '货物追踪率' },
        ],
        gradient: 'from-amber-600 to-yellow-600',
        accentColor: 'amber',
        slug: 'smart-logistics-system',
        benefits: ['提升配送效率', '降低物流成本', '优化库存管理', '提升客户满意度'],
        technologies: ['RFID技术', 'GPS定位', '大数据分析', '移动应用'],
      },
    ],
  },
  {
    id: 'healthcare',
    name: '大健康',
    description: '健康医疗智能化方案',
    icon: Activity,
    gradient: 'from-pink-600 to-rose-600',
    solutions: [
      {
        id: 'smart-healthcare-platform',
        title: '智慧医疗管理平台',
        subtitle: 'Smart Healthcare Platform',
        description:
          '面向医疗机构的智能化管理解决方案，提供患者管理、医疗设备监控、健康数据分析等功能。',
        icon: Activity,
        image: '/images/solutions/smart-healthcare.jpg',
        category: 'healthcare',
        features: [
          '患者信息管理',
          '医疗设备监控',
          '健康数据分析',
          '远程医疗服务',
          '药品管理系统',
          '应急响应系统',
        ],
        applications: ['综合医院', '专科医院', '社区卫生中心', '养老机构'],
        metrics: [
          { value: '40%', label: '诊疗效率提升' },
          { value: '30%', label: '管理成本降低' },
          { value: '95%', label: '患者满意度' },
        ],
        gradient: 'from-pink-600 to-rose-600',
        accentColor: 'pink',
        slug: 'smart-healthcare-platform',
        benefits: ['提升医疗质量', '优化资源配置', '改善患者体验', '降低医疗风险'],
        technologies: ['医疗物联网', '健康大数据', '人工智能', '云计算平台'],
      },
      {
        id: 'smart-elderly-care',
        title: '智慧养老服务平台',
        subtitle: 'Smart Elderly Care Platform',
        description:
          '专为养老机构和居家养老设计的智能化服务平台，提升80%护理效率，降低60%安全风险，为老年人提供全方位的健康和安全保障。',
        icon: Heart,
        image: '/images/solutions/smart-elderly.jpg',
        category: 'healthcare',
        features: [
          '健康监测系统',
          '紧急呼叫服务',
          '家属远程关怀',
          '智能护理管理',
          '安全防护系统',
          '健康数据分析',
        ],
        applications: ['养老院', '社区养老', '居家养老', '日间照料'],
        metrics: [
          { value: '80%', label: '护理效率提升' },
          { value: '60%', label: '安全风险降低' },
          { value: '24×7', label: '健康监护' },
        ],
        gradient: 'from-pink-600 to-rose-600',
        accentColor: 'pink',
        slug: 'smart-elderly-care',
        benefits: ['全方位健康监护', '安全保障系统', '智能护理服务', '家属安心关怀'],
        technologies: ['健康监测设备', '紧急呼叫系统', '人工智能', '移动应用'],
      },
    ],
  },
  {
    id: 'commercial-complex',
    name: '商业综合体',
    description: '商业综合体智能管理',
    icon: ShoppingBag,
    gradient: 'from-violet-600 to-purple-600',
    solutions: [
      {
        id: 'smart-mall-management',
        title: '智慧商场管理系统',
        subtitle: 'Smart Mall Management',
        description:
          '面向商业综合体的智能化管理解决方案，实现客流分析、安全管理、能耗控制、商户服务等功能。',
        icon: ShoppingBag,
        image: '/images/solutions/smart-mall.jpg',
        category: 'commercial-complex',
        features: [
          '客流统计分析',
          '智能安防系统',
          '能耗监控管理',
          '商户服务平台',
          '停车管理系统',
          '应急疏散管理',
        ],
        applications: ['购物中心', '商业广场', '百货商场', '商业街区'],
        metrics: [
          { value: '25%', label: '运营效率提升' },
          { value: '20%', label: '能耗降低' },
          { value: '98%', label: '安全保障率' },
        ],
        gradient: 'from-violet-600 to-purple-600',
        accentColor: 'violet',
        slug: 'smart-mall-management',
        benefits: ['提升运营效率', '优化客户体验', '降低运营成本', '增强安全保障'],
        technologies: ['客流分析', '智能监控', '数据分析', '移动应用'],
      },
      {
        id: 'smart-hotel-management',
        title: '智慧酒店管理平台',
        subtitle: 'Smart Hotel Management',
        description:
          '为酒店行业打造的智能化服务平台，提升60%运营效率，降低40%人工成本，为客户提供卓越的入住体验。',
        icon: Hotel,
        image: '/images/solutions/smart-hotel.jpg',
        category: 'commercial-complex',
        features: [
          '智能客房控制',
          '自助入住退房',
          '客房服务管理',
          '能耗监控系统',
          '客户关系管理',
          '运营数据分析',
        ],
        applications: ['商务酒店', '度假酒店', '精品酒店', '连锁酒店'],
        metrics: [
          { value: '60%', label: '运营效率提升' },
          { value: '40%', label: '人工成本降低' },
          { value: '95%', label: '客户满意度' },
        ],
        gradient: 'from-purple-600 to-pink-600',
        accentColor: 'purple',
        slug: 'smart-hotel-management',
        benefits: ['提升客户体验', '降低运营成本', '提高服务效率', '增强竞争优势'],
        technologies: ['物联网技术', '移动应用', '人工智能', '云计算平台'],
      },
    ],
  },
  {
    id: 'others',
    name: '其他方案',
    description: '创新解决方案和定制化服务',
    icon: Grid3X3,
    gradient: 'from-gray-600 to-slate-600',
    solutions: [
      {
        id: 'custom-solution-development',
        title: '定制化解决方案开发',
        subtitle: 'Custom Solution Development',
        description:
          '根据客户特定需求，提供量身定制的智能化解决方案开发服务，从需求分析到系统实施的全流程服务。',
        icon: Layers,
        image: '/images/solutions/custom-development.jpg',
        category: 'others',
        features: [
          '需求深度分析',
          '方案设计规划',
          '系统开发实施',
          '集成测试部署',
          '培训与支持',
          '持续优化升级',
        ],
        applications: ['特殊行业需求', '复杂业务场景', '创新应用领域', '定制化项目'],
        metrics: [
          { value: '100%', label: '需求匹配度' },
          { value: '95%', label: '客户满意度' },
          { value: '6个月', label: '平均交付周期' },
        ],
        gradient: 'from-gray-600 to-slate-600',
        accentColor: 'gray',
        slug: 'custom-solution-development',
        benefits: ['完全定制化', '专业技术团队', '全流程服务', '持续技术支持'],
        technologies: ['敏捷开发', '微服务架构', '云原生技术', 'DevOps实践'],
      },
      {
        id: 'integration-consulting',
        title: '系统集成咨询服务',
        subtitle: 'System Integration Consulting',
        description:
          '为企业提供专业的系统集成咨询服务，帮助客户优化现有系统架构，实现不同系统间的无缝集成。',
        icon: Settings,
        image: '/images/solutions/integration-consulting.jpg',
        category: 'others',
        features: [
          '系统架构评估',
          '集成方案设计',
          '技术选型建议',
          '实施路径规划',
          '风险评估管控',
          '项目管理支持',
        ],
        applications: ['企业信息化', '数字化转型', '系统升级改造', '多系统整合'],
        metrics: [
          { value: '50%', label: '集成效率提升' },
          { value: '30%', label: '维护成本降低' },
          { value: '99%', label: '系统稳定性' },
        ],
        gradient: 'from-indigo-600 to-purple-600',
        accentColor: 'indigo',
        slug: 'integration-consulting',
        benefits: ['专业咨询服务', '降低集成风险', '提升系统效率', '优化资源配置'],
        technologies: ['API网关', '消息队列', '数据同步', '服务治理'],
      },
      {
        id: 'pilot-project-service',
        title: '试点项目服务',
        subtitle: 'Pilot Project Service',
        description:
          '为客户提供小规模试点项目服务，验证技术方案可行性，降低大规模部署风险，确保项目成功实施。',
        icon: Eye,
        image: '/images/solutions/pilot-project.jpg',
        category: 'others',
        features: [
          '小规模验证',
          '快速原型开发',
          '效果评估分析',
          '风险识别控制',
          '经验总结提炼',
          '推广方案制定',
        ],
        applications: ['新技术验证', '创新应用探索', '大项目前期', '概念验证'],
        metrics: [
          { value: '2-4周', label: '试点周期' },
          { value: '90%', label: '成功验证率' },
          { value: '80%', label: '后续转化率' },
        ],
        gradient: 'from-emerald-600 to-teal-600',
        accentColor: 'emerald',
        slug: 'pilot-project-service',
        benefits: ['降低项目风险', '快速验证效果', '优化实施方案', '提高成功率'],
        technologies: ['快速开发', '敏捷方法', 'MVP模式', '迭代优化'],
      },
    ],
  },
]

// 获取所有解决方案
export const allSolutions: Solution[] = solutionCategories.flatMap(category => category.solutions)

// 根据分类获取解决方案
export function getSolutionsByCategory(categoryId: string): Solution[] {
  const category = solutionCategories.find(cat => cat.id === categoryId)
  return category ? category.solutions : []
}

// 根据ID获取解决方案
export function getSolutionById(id: string): Solution | undefined {
  return allSolutions.find(solution => solution.id === id)
}

// 根据slug获取解决方案
export function getSolutionBySlug(slug: string): Solution | undefined {
  return allSolutions.find(solution => solution.slug === slug)
}

// 获取分类信息
export function getCategoryById(id: string): SolutionCategory | undefined {
  return solutionCategories.find(category => category.id === id)
}
