import {
  RefreshCw,
  Settings,
  Building2,
  Flame,
  Shield,
  Grid3X3,
  TrendingUp,
  Users,
  Zap,
  CheckCircle,
  Monitor,
  Brain,
  AlertTriangle,
  Clock,
  Wrench,
  Award,
  Search,
  FileText,
} from 'lucide-react'
import { ServicePageData } from '@/components/services/service-page-template'

// 数字化转型服务数据
export const digitalTransformationData: ServicePageData = {
  id: 'digital-transformation',
  title: '数字化转型',
  subtitle: 'Digital Transformation',
  description:
    '企业数字化转型服务，提供数字化咨询、系统集成、数据治理、流程优化等全方位的数字化转型解决方案。',
  icon: RefreshCw,
  metrics: [
    { value: '80%', label: '效率提升', color: 'text-green-600 dark:text-green-400' },
    { value: '60%', label: '成本降低', color: 'text-blue-600 dark:text-blue-400' },
    { value: '200+', label: '转型项目', color: 'text-purple-600 dark:text-purple-400' },
  ],
  features: [
    '数字化咨询规划',
    '系统集成服务',
    '数据治理平台',
    '流程数字化',
    '云平台迁移',
    '数字化培训',
  ],
  process: [
    {
      step: '01',
      title: '现状评估',
      description: '深入分析企业现状，识别数字化转型机会和挑战',
    },
    {
      step: '02',
      title: '战略规划',
      description: '制定数字化转型战略和实施路线图',
    },
    {
      step: '03',
      title: '技术实施',
      description: '部署数字化技术解决方案，实现系统集成',
    },
    {
      step: '04',
      title: '培训支持',
      description: '提供员工培训和持续技术支持服务',
    },
  ],
  cta: {
    title: '开启您的数字化转型之旅',
    description: '让我们的专业团队为您制定个性化的数字化转型方案',
    primaryButton: '立即咨询',
    secondaryButton: '预约演示',
  },
}

// 智能运维服务数据
export const intelligentOperationData: ServicePageData = {
  id: 'intelligent-operation',
  title: '智能运维服务',
  subtitle: 'Intelligent Operation Service',
  description:
    '智能化运维管理服务，基于AI和大数据技术，提供设备监控、故障预测、运维优化等智能运维解决方案。',
  icon: Settings,
  metrics: [
    { value: '95%', label: '故障预测准确率', color: 'text-green-600 dark:text-green-400' },
    { value: '50%', label: '运维成本降低', color: 'text-blue-600 dark:text-blue-400' },
    { value: '24×7', label: '监控服务', color: 'text-purple-600 dark:text-purple-400' },
  ],
  features: [
    '设备智能监控',
    '故障预测分析',
    '运维流程优化',
    '远程运维支持',
    '性能优化建议',
    '运维数据分析',
  ],
  process: [
    {
      step: '01',
      title: '系统部署',
      description: '部署智能监控系统，建立数据采集体系',
    },
    {
      step: '02',
      title: '模型训练',
      description: '基于历史数据训练AI预测模型',
    },
    {
      step: '03',
      title: '智能监控',
      description: '实时监控设备状态，预测潜在故障',
    },
    {
      step: '04',
      title: '持续优化',
      description: '持续优化算法模型，提升预测准确率',
    },
  ],
  visualElements: [
    { icon: Monitor, title: '智能监控', color: 'blue-600' },
    { icon: Brain, title: 'AI预测', color: 'indigo-600' },
    { icon: AlertTriangle, title: '故障预警', color: 'orange-600' },
    { icon: TrendingUp, title: '性能优化', color: 'green-600' },
  ],
  cta: {
    title: '开启智能运维新时代',
    description: '让AI技术为您的运维管理赋能，提升效率降低成本',
    primaryButton: '立即咨询',
    secondaryButton: '预约演示',
  },
}

// 智能化工程数据
export const intelligentEngineeringData: ServicePageData = {
  id: 'intelligent-engineering',
  title: '智能化工程',
  subtitle: 'Intelligent Engineering',
  description:
    '智能化系统工程实施，包括智能建筑、智慧园区、工业自动化等各类智能化工程的设计、施工和调试。',
  icon: Building2,
  metrics: [
    { value: '100+', label: '工程项目', color: 'text-green-600 dark:text-green-400' },
    { value: '99%', label: '验收通过率', color: 'text-blue-600 dark:text-blue-400' },
    { value: '30天', label: '平均工期', color: 'text-purple-600 dark:text-purple-400' },
  ],
  features: [
    '工程设计规划',
    '系统集成实施',
    '设备安装调试',
    '项目管理服务',
    '验收测试',
    '技术培训',
  ],
  process: [
    {
      step: '01',
      title: '需求分析',
      description: '深入了解客户需求，制定技术方案',
    },
    {
      step: '02',
      title: '设计规划',
      description: '详细的工程设计和施工计划制定',
    },
    {
      step: '03',
      title: '工程实施',
      description: '专业团队进行工程施工和系统集成',
    },
    {
      step: '04',
      title: '验收交付',
      description: '严格验收测试，确保工程质量达标',
    },
  ],
  visualElements: [
    { icon: Building2, title: '工程设计', color: 'orange-600' },
    { icon: Wrench, title: '系统集成', color: 'red-600' },
    { icon: CheckCircle, title: '质量验收', color: 'green-600' },
    { icon: Award, title: '专业认证', color: 'blue-600' },
  ],
  cta: {
    title: '开启智能化工程新篇章',
    description: '专业的工程团队为您提供高质量的智能化工程服务',
    primaryButton: '立即咨询',
    secondaryButton: '预约演示',
  },
}

// 消防工程数据
export const fireEngineeringData: ServicePageData = {
  id: 'fire-engineering',
  title: '消防工程',
  subtitle: 'Fire Engineering Service',
  description:
    '专业消防安全工程服务，提供消防系统设计、安装、维护和检测等全方位的消防安全解决方案。',
  icon: Flame,
  metrics: [
    { value: '500+', label: '消防项目', color: 'text-green-600 dark:text-green-400' },
    { value: '100%', label: '合规达标率', color: 'text-blue-600 dark:text-blue-400' },
    { value: '24小时', label: '应急响应', color: 'text-purple-600 dark:text-purple-400' },
  ],
  features: [
    '消防系统设计',
    '设备安装施工',
    '系统调试验收',
    '定期维护保养',
    '安全检测评估',
    '应急响应服务',
  ],
  process: [
    {
      step: '01',
      title: '方案设计',
      description: '根据建筑特点设计消防系统方案',
    },
    {
      step: '02',
      title: '设备安装',
      description: '专业安装消防设备和管网系统',
    },
    {
      step: '03',
      title: '系统调试',
      description: '全面调试测试消防系统功能',
    },
    {
      step: '04',
      title: '验收维护',
      description: '通过验收并提供后续维护服务',
    },
  ],
  visualElements: [
    { icon: Flame, title: '消防设计', color: 'red-600' },
    { icon: Shield, title: '安全防护', color: 'orange-600' },
    { icon: AlertTriangle, title: '应急响应', color: 'yellow-600' },
    { icon: CheckCircle, title: '合规验收', color: 'green-600' },
  ],
  cta: {
    title: '保障您的消防安全',
    description: '专业的消防工程团队为您提供全方位的消防安全保障',
    primaryButton: '立即咨询',
    secondaryButton: '预约演示',
  },
}

// 风险检测与评估数据
export const riskAssessmentData: ServicePageData = {
  id: 'risk-assessment',
  title: '风险检测与评估',
  subtitle: 'Risk Assessment Service',
  description:
    '安全风险评估服务，通过专业的检测设备和评估方法，为企业提供全面的安全风险识别和评估服务。',
  icon: Shield,
  metrics: [
    { value: '1000+', label: '评估项目', color: 'text-green-600 dark:text-green-400' },
    { value: '98%', label: '风险识别率', color: 'text-blue-600 dark:text-blue-400' },
    { value: '7天', label: '评估周期', color: 'text-purple-600 dark:text-purple-400' },
  ],
  features: [
    '安全风险识别',
    '专业检测评估',
    '风险等级分析',
    '整改建议方案',
    '定期复查服务',
    '合规性审核',
  ],
  process: [
    {
      step: '01',
      title: '现场调研',
      description: '深入现场了解实际情况，收集基础信息',
    },
    {
      step: '02',
      title: '风险识别',
      description: '运用专业方法识别各类安全风险',
    },
    {
      step: '03',
      title: '检测评估',
      description: '使用专业设备进行详细检测和评估',
    },
    {
      step: '04',
      title: '报告交付',
      description: '出具专业评估报告和整改建议',
    },
  ],
  visualElements: [
    { icon: Search, title: '风险识别', color: 'red-600' },
    { icon: Shield, title: '安全评估', color: 'orange-600' },
    { icon: FileText, title: '报告分析', color: 'blue-600' },
    { icon: CheckCircle, title: '合规审核', color: 'green-600' },
  ],
  cta: {
    title: '保障您的安全无忧',
    description: '专业的风险评估团队为您提供全面的安全保障',
    primaryButton: '立即咨询',
    secondaryButton: '预约演示',
  },
}

// 其他服务数据
export const otherServicesData: ServicePageData = {
  id: 'other-services',
  title: '其他服务',
  subtitle: 'Other Professional Services',
  description: '定制化服务和专业支持，包括技术咨询、培训服务、运维支持等多样化的专业服务。',
  icon: Grid3X3,
  metrics: [
    { value: '300+', label: '咨询项目', color: 'text-green-600 dark:text-green-400' },
    { value: '5000+', label: '培训人次', color: 'text-blue-600 dark:text-blue-400' },
    { value: '24×7', label: '技术支持', color: 'text-purple-600 dark:text-purple-400' },
  ],
  features: [
    '技术咨询服务',
    '专业培训课程',
    '运维支持服务',
    '定制开发服务',
    '系统升级服务',
    '技术支持热线',
  ],
  process: [
    {
      step: '01',
      title: '需求分析',
      description: '深入了解客户具体需求和期望',
    },
    {
      step: '02',
      title: '方案定制',
      description: '制定个性化的服务解决方案',
    },
    {
      step: '03',
      title: '服务实施',
      description: '专业团队提供高质量服务实施',
    },
    {
      step: '04',
      title: '持续支持',
      description: '提供持续的技术支持和服务保障',
    },
  ],
  visualElements: [
    { icon: TrendingUp, title: '业务增长', color: 'purple-600' },
    { icon: Users, title: '团队协作', color: 'indigo-600' },
    { icon: Zap, title: '效率提升', color: 'blue-600' },
    { icon: CheckCircle, title: '质量保证', color: 'green-600' },
  ],
  cta: {
    title: '定制您的专属服务',
    description: '我们为您提供灵活多样的专业服务解决方案',
    primaryButton: '立即咨询',
    secondaryButton: '预约演示',
  },
}

// 服务数据映射
export const servicesData = {
  'digital-transformation': digitalTransformationData,
  'intelligent-operation': intelligentOperationData,
  'intelligent-engineering': intelligentEngineeringData,
  'fire-engineering': fireEngineeringData,
  'risk-assessment': riskAssessmentData,
  'other-services': otherServicesData,
}
