import {
  DollarSign,
  GraduationCap,
  Heart,
  Shield,
  Code,
  TrendingUp,
  Users,
  Briefcase,
  Award,
  Star,
} from 'lucide-react'

// 职位类型
export interface JobPosition {
  id: string
  title: string
  department: string
  location: string
  type: '全职' | '兼职' | '实习'
  experience: string
  salary: string
  description: string
  requirements: string[]
  benefits: string[]
  tags: string[]
  isHot?: boolean
  isUrgent?: boolean
}

// 公司福利类型
export interface CompanyBenefit {
  icon: any
  title: string
  description: string
  color: string
  details?: string[]
}

// 部门信息类型
export interface Department {
  id: string
  name: string
  description: string
  icon: any
  openPositions: number
}

// 职位数据
export const jobPositions: JobPosition[] = [
  {
    id: 'senior-ai-engineer',
    title: '高级AI算法工程师',
    department: '技术研发',
    location: '北京',
    type: '全职',
    experience: '3-5年',
    salary: '25-40K',
    description: '负责计算机视觉、深度学习算法的研发与优化，参与智能安防产品的核心技术开发。',
    requirements: [
      '计算机、人工智能相关专业硕士及以上学历',
      '3年以上深度学习、计算机视觉开发经验',
      '熟练掌握Python、PyTorch/TensorFlow等框架',
      '有目标检测、人脸识别、行为分析等项目经验',
      '具备良好的团队协作和沟通能力',
    ],
    benefits: ['五险一金', '年终奖', '股权激励', '技术培训', '弹性工作'],
    tags: ['AI', '深度学习', '计算机视觉', 'Python'],
    isHot: true,
  },
  {
    id: 'frontend-developer',
    title: '前端开发工程师',
    department: '技术研发',
    location: '北京',
    type: '全职',
    experience: '2-4年',
    salary: '18-30K',
    description: '负责智能安防管理平台的前端开发，参与用户界面设计与交互优化。',
    requirements: [
      '计算机相关专业本科及以上学历',
      '2年以上前端开发经验',
      '熟练掌握React、Vue.js、TypeScript',
      '熟悉现代前端工程化工具和流程',
      '有移动端开发经验者优先',
    ],
    benefits: ['五险一金', '年终奖', '技术培训', '健身补贴', '团建活动'],
    tags: ['React', 'Vue.js', 'TypeScript', '前端'],
  },
  {
    id: 'backend-engineer',
    title: '后端开发工程师',
    department: '技术研发',
    location: '北京',
    type: '全职',
    experience: '2-5年',
    salary: '20-35K',
    description: '负责智能安防系统后端服务开发，参与系统架构设计与性能优化。',
    requirements: [
      '计算机相关专业本科及以上学历',
      '2年以上后端开发经验',
      '熟练掌握Java/Go/Python等编程语言',
      '熟悉微服务架构、分布式系统设计',
      '有高并发、大数据处理经验者优先',
    ],
    benefits: ['五险一金', '年终奖', '股权激励', '技术培训', '弹性工作'],
    tags: ['Java', 'Go', '微服务', '分布式'],
  },
  {
    id: 'product-manager',
    title: '产品经理',
    department: '产品运营',
    location: '北京',
    type: '全职',
    experience: '3-5年',
    salary: '20-35K',
    description: '负责智能安防产品的规划与设计，协调技术团队完成产品开发与迭代。',
    requirements: [
      '产品管理、计算机相关专业本科及以上学历',
      '3年以上B端产品管理经验',
      '熟悉安防行业或IoT产品者优先',
      '具备优秀的需求分析和项目管理能力',
      '良好的沟通协调和团队合作能力',
    ],
    benefits: ['五险一金', '年终奖', '股权激励', '培训发展', '带薪年假'],
    tags: ['产品管理', 'B端产品', '安防', 'IoT'],
    isUrgent: true,
  },
  {
    id: 'ui-ux-designer',
    title: 'UI/UX设计师',
    department: '产品运营',
    location: '北京',
    type: '全职',
    experience: '2-4年',
    salary: '15-25K',
    description: '负责智能安防产品的用户界面设计，提升用户体验和产品易用性。',
    requirements: [
      '设计相关专业本科及以上学历',
      '2年以上UI/UX设计经验',
      '熟练掌握Figma、Sketch、Adobe Creative Suite',
      '有B端产品设计经验者优先',
      '具备良好的审美能力和创新思维',
    ],
    benefits: ['五险一金', '年终奖', '设计培训', '创意奖金', '弹性工作'],
    tags: ['UI设计', 'UX设计', 'Figma', '用户体验'],
  },
  {
    id: 'sales-manager',
    title: '销售经理',
    department: '市场销售',
    location: '上海',
    type: '全职',
    experience: '2-4年',
    salary: '15-25K+提成',
    description: '负责智能安防解决方案的销售推广，维护客户关系，完成销售目标。',
    requirements: [
      '市场营销、商务相关专业本科及以上学历',
      '2年以上B端销售经验',
      '有安防、智能化项目销售经验者优先',
      '具备优秀的客户沟通和谈判能力',
      '能够承受一定的工作压力',
    ],
    benefits: ['五险一金', '高额提成', '销售奖金', '出差补贴', '职业发展'],
    tags: ['销售', 'B端', '安防', '客户关系'],
  },
  {
    id: 'marketing-specialist',
    title: '市场推广专员',
    department: '市场销售',
    location: '上海',
    type: '全职',
    experience: '1-3年',
    salary: '12-20K',
    description: '负责品牌推广、市场活动策划执行，提升品牌知名度和市场影响力。',
    requirements: [
      '市场营销、广告学相关专业本科及以上学历',
      '1年以上市场推广经验',
      '熟悉数字营销、社交媒体运营',
      '具备优秀的文案策划和执行能力',
      '有B端市场推广经验者优先',
    ],
    benefits: ['五险一金', '年终奖', '培训发展', '团建活动', '创意奖金'],
    tags: ['市场推广', '品牌营销', '数字营销', '文案策划'],
  },
  {
    id: 'hr-specialist',
    title: '人力资源专员',
    department: '管理支持',
    location: '北京',
    type: '全职',
    experience: '1-3年',
    salary: '10-18K',
    description: '负责招聘、培训、员工关系管理等人力资源工作，支持公司人才发展。',
    requirements: [
      '人力资源、心理学相关专业本科及以上学历',
      '1年以上人力资源工作经验',
      '熟悉招聘流程和人力资源管理制度',
      '具备良好的沟通协调能力',
      '有互联网或科技公司HR经验者优先',
    ],
    benefits: ['五险一金', '年终奖', '培训发展', '弹性工作', '员工关怀'],
    tags: ['人力资源', '招聘', '培训', '员工关系'],
  },
  {
    id: 'intern-developer',
    title: '技术实习生',
    department: '技术研发',
    location: '北京',
    type: '实习',
    experience: '在校学生',
    salary: '150-250/天',
    description: '参与智能安防产品的开发工作，在导师指导下完成技术学习和项目实践。',
    requirements: [
      '计算机相关专业在校学生',
      '熟悉至少一门编程语言',
      '对人工智能、安防技术有浓厚兴趣',
      '具备良好的学习能力和团队合作精神',
      '能够保证3个月以上实习时间',
    ],
    benefits: ['实习津贴', '导师指导', '技术培训', '转正机会', '项目经验'],
    tags: ['实习', '技术学习', '项目实践', '导师指导'],
  },
]

// 公司福利
export const companyBenefits: CompanyBenefit[] = [
  {
    icon: DollarSign,
    title: '薪酬福利',
    description: '具有竞争力的薪酬体系，年终奖金，股权激励计划',
    color: 'emerald',
    details: ['13薪+年终奖', '股权激励计划', '绩效奖金', '项目奖金', '年度调薪'],
  },
  {
    icon: GraduationCap,
    title: '学习发展',
    description: '完善的培训体系，技术分享，外部培训支持',
    color: 'blue',
    details: ['新员工培训', '技术分享会', '外部培训支持', '职业发展规划', '导师制度'],
  },
  {
    icon: Heart,
    title: '工作环境',
    description: '现代化办公环境，弹性工作制，团建活动',
    color: 'pink',
    details: ['现代化办公空间', '弹性工作时间', '远程办公支持', '团建活动', '员工关怀'],
  },
  {
    icon: Shield,
    title: '保障体系',
    description: '五险一金，商业保险，带薪年假，健康体检',
    color: 'purple',
    details: ['五险一金', '补充商业保险', '带薪年假', '年度体检', '节日福利'],
  },
]

// 部门信息
export const departments: Department[] = [
  {
    id: 'tech',
    name: '技术研发',
    description: '负责产品技术研发、算法优化、系统架构设计',
    icon: Code,
    openPositions: 15,
  },
  {
    id: 'product',
    name: '产品运营',
    description: '负责产品规划、用户体验设计、运营推广',
    icon: TrendingUp,
    openPositions: 8,
  },
  {
    id: 'sales',
    name: '市场销售',
    description: '负责市场拓展、客户关系维护、销售目标达成',
    icon: Users,
    openPositions: 12,
  },
  {
    id: 'support',
    name: '管理支持',
    description: '负责人力资源、财务管理、行政支持',
    icon: Briefcase,
    openPositions: 5,
  },
]

// 公司统计数据
export const companyStats = {
  totalEmployees: '200+',
  openPositions: '50+',
  employeeSatisfaction: '95%',
  averageAge: '28岁',
  techRatio: '70%',
  growthRate: '150%',
}

// 招聘流程
export const recruitmentProcess = [
  {
    step: '01',
    title: '简历投递',
    description: '在线投递简历，我们会在3个工作日内回复',
  },
  {
    step: '02',
    title: '初步筛选',
    description: 'HR初步筛选，符合条件的候选人进入下一轮',
  },
  {
    step: '03',
    title: '技术面试',
    description: '技术团队面试，考察专业技能和项目经验',
  },
  {
    step: '04',
    title: '综合面试',
    description: '管理层面试，了解综合素质和团队适配度',
  },
  {
    step: '05',
    title: '发放Offer',
    description: '确定录用后发放正式Offer，欢迎加入团队',
  },
]
