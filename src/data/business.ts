/**
 * 7大核心业务领域数据结构
 * 根据开发计划文档定义的新业务板块
 */

import { LucideIcon } from 'lucide-react'
import {
  Cpu,
  Brain,
  RefreshCw,
  Settings,
  HardHat,
  Shield,
  AlertTriangle,
  Grid3X3,
  Layers,
  Users,
  Headphones,
} from 'lucide-react'

export interface BusinessDomain {
  id: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  image: string
  features: string[]
  applications: string[]
  metrics: Array<{
    value: string
    label: string
  }>
  gradient: string
  accentColor: string
  href?: string
}

export const businessDomains: BusinessDomain[] = [
  {
    id: 'intelligent-products',
    title: '智能产品',
    subtitle: 'Intelligent Products',
    description:
      '智能化设备和系统产品，提供综合管理集成平台、综合运维管理平台、安消边缘计算中心、大数据中心等核心产品。',
    icon: Cpu,
    image: '/images/business/intelligent-products.jpg',
    features: [
      '综合管理集成平台',
      '综合运维管理平台',
      '安消边缘计算中心',
      '大数据中心',
      '智能化设备集成',
      '系统平台开发',
    ],
    applications: ['智慧园区', '智慧社区', '商业综合体', '工业制造', '数据中心', '企业总部'],
    metrics: [
      { value: '99.9%', label: '系统可用性' },
      { value: '50+', label: '产品种类' },
      { value: '1000+', label: '项目案例' },
    ],
    gradient: 'from-blue-600 to-cyan-600',
    accentColor: 'blue',
    href: '/products?category=intelligent-products',
  },
  {
    id: 'ai-research',
    title: 'AI研究与应用',
    subtitle: 'AI Research & Applications',
    description:
      '人工智能技术研发和应用，专注于计算机视觉、自然语言处理、机器学习等前沿AI技术在安防领域的创新应用。',
    icon: Brain,
    image: '/images/business/ai-research.svg',
    features: [
      '计算机视觉技术',
      '自然语言处理',
      '机器学习算法',
      '深度学习模型',
      'AI算法优化',
      '智能分析引擎',
    ],
    applications: [
      '智能监控分析',
      '人脸识别系统',
      '行为分析预警',
      '语音识别交互',
      '智能决策支持',
      '预测性维护',
    ],
    metrics: [
      { value: '95%', label: '识别准确率' },
      { value: '20+', label: 'AI算法' },
      { value: '500+', label: '应用场景' },
    ],
    gradient: 'from-purple-600 to-indigo-600',
    accentColor: 'purple',
    href: '/research?category=ai-research',
  },
  {
    id: 'digital-transformation',
    title: '数字化转型',
    subtitle: 'Digital Transformation',
    description:
      '企业数字化转型服务，提供数字化咨询、系统集成、数据治理、流程优化等全方位的数字化转型解决方案。',
    icon: RefreshCw,
    image: '/images/business/digital-transformation.svg',
    features: [
      '数字化咨询规划',
      '系统集成服务',
      '数据治理平台',
      '流程数字化',
      '云平台迁移',
      '数字化培训',
    ],
    applications: ['传统制造业', '物流运输', '零售商业', '政府机构', '教育机构', '医疗健康'],
    metrics: [
      { value: '80%', label: '效率提升' },
      { value: '60%', label: '成本降低' },
      { value: '200+', label: '转型项目' },
    ],
    gradient: 'from-emerald-600 to-teal-600',
    accentColor: 'emerald',
    href: '/services?category=digital-transformation',
  },
  {
    id: 'intelligent-operation',
    title: '智能运维服务',
    subtitle: 'Intelligent O&M Services',
    description:
      '基于AI和大数据技术的智能化运维管理平台，提供全天候系统监控、智能故障预测、自动化运维响应等专业服务，确保业务系统稳定高效运行。',
    icon: Settings,
    image: '/images/business/intelligent-operation.svg',
    features: [
      'AI智能监控预警',
      '自动化故障处理',
      '预测性维护策略',
      '实时性能优化',
      '远程运维管控',
      '应急快速响应',
    ],
    applications: [
      '企业数据中心',
      '云计算平台',
      '智能楼宇系统',
      '工业控制系统',
      '网络基础设施',
      '安防监控系统',
    ],
    metrics: [
      { value: '99.95%', label: '系统可用性' },
      { value: '< 3min', label: '故障响应' },
      { value: '40%', label: '运维成本降低' },
    ],
    gradient: 'from-slate-700 to-gray-700',
    accentColor: 'slate',
    href: '/services?category=intelligent-operation',
  },
  {
    id: 'intelligent-engineering',
    title: '智能化工程',
    subtitle: 'Intelligent Engineering',
    description:
      '专业的智能化系统集成工程服务，从方案设计到项目实施，提供安防、消防、楼控、通信等多系统融合的一站式智能化建设解决方案。',
    icon: HardHat,
    image: '/images/business/intelligent-engineering.jpg',
    features: [
      '系统方案设计',
      '多系统集成实施',
      '专业工程施工',
      '设备调试优化',
      '项目管理交付',
      '售后技术支持',
    ],
    applications: [
      '智慧园区建设',
      '高端写字楼',
      '大型商业综合体',
      '工业园区改造',
      '政府机关大楼',
      '医疗教育机构',
    ],
    metrics: [
      { value: '100%', label: '按期交付率' },
      { value: '99%', label: '验收通过率' },
      { value: '500+', label: '成功案例' },
    ],
    gradient: 'from-cyan-600 to-teal-600',
    accentColor: 'cyan',
    href: '/services?category=intelligent-engineering',
  },
  {
    id: 'fire-engineering',
    title: '消防工程',
    subtitle: 'Fire Protection Engineering',
    description:
      '专业消防安全工程服务商，提供从消防系统设计、工程施工到维护保养的全生命周期服务，确保建筑消防安全合规达标。',
    icon: Shield,
    image: '/images/business/fire-engineering.jpg',
    features: [
      '消防系统专业设计',
      '规范化工程施工',
      '设备安装与调试',
      '定期维护保养',
      '消防安全检测',
      '应急处置培训',
    ],
    applications: [
      '大型商业综合体',
      '高层办公建筑',
      '工业生产厂房',
      '住宅社区项目',
      '公共服务设施',
    ],
    metrics: [
      { value: '100%', label: '消防验收通过率' },
      { value: '24×7', label: '应急响应服务' },
      { value: '800+', label: '消防工程案例' },
    ],
    gradient: 'from-orange-600 to-red-500',
    accentColor: 'orange',
    href: '/solutions?category=fire-protection',
  },
  {
    id: 'risk-assessment',
    title: '风险检测与评估',
    subtitle: 'Risk Detection & Assessment',
    description:
      '安全风险评估服务，提供安防风险审核、专业消防作审、行业专项评估、风险管控等专业的风险评估服务。',
    icon: AlertTriangle,
    image: '/images/business/risk-assessment.jpg',
    features: [
      '安防风险审核',
      '消防安全评估',
      '行业专项评估',
      '风险识别分析',
      '安全隐患排查',
      '风险管控方案',
    ],
    applications: ['化工企业', '制造工厂', '商业场所', '公共建筑', '住宅社区', '特殊行业'],
    metrics: [
      { value: '100%', label: '评估覆盖率' },
      { value: '95%', label: '风险识别率' },
      { value: '1000+', label: '评估项目' },
    ],
    gradient: 'from-yellow-500 to-amber-500',
    accentColor: 'yellow',
    href: '/services?category=risk-assessment',
  },
]

// 按类别分组的业务领域
export const businessCategories = {
  products: businessDomains.filter(domain => ['intelligent-products'].includes(domain.id)),
  research: businessDomains.filter(domain => ['ai-research'].includes(domain.id)),
  services: businessDomains.filter(domain =>
    [
      'digital-transformation',
      'intelligent-operation',
      'intelligent-engineering',
      'risk-assessment',
      'fire-engineering',
    ].includes(domain.id)
  ),
  engineering: businessDomains.filter(domain => ['fire-engineering'].includes(domain.id)),
}

// 获取指定业务领域
export function getBusinessDomain(id: string): BusinessDomain | undefined {
  return businessDomains.find(domain => domain.id === id)
}

// 获取指定类别的业务领域
export function getBusinessDomainsByCategory(
  category: keyof typeof businessCategories
): BusinessDomain[] {
  return businessCategories[category] || []
}
