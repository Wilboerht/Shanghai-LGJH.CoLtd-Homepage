/**
 * 使命责任板块数据结构
 * 包含产教融合、荣誉活动、对外合作、公司动态、加入我们五大板块
 */

import { LucideIcon } from 'lucide-react'
import {
  Target,
  CheckCircle,
  Globe,
  Lightbulb,
  Users,
  GraduationCap,
  Building,
  Handshake,
  Award,
  Newspaper,
  UserPlus,
  BookOpen,
  Trophy,
  Network,
  Briefcase,
  Heart,
} from 'lucide-react'

export interface MissionModule {
  id: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  image: string
  highlights: string[]
  features: string[]
  achievements: Array<{
    value: string
    label: string
  }>
  gradient: string
  accentColor: string
  href: string
}

export interface MissionContent {
  title: string
  description: string
  items: Array<{
    title: string
    description: string
    image?: string
    date?: string
    tags?: string[]
  }>
}

export const missionModules: MissionModule[] = [
  {
    id: 'industry-education',
    title: '产教融合',
    subtitle: '产学研合作与人才培养',
    description: '深化产教融合，校企合作，建立产学研一体化平台，培养高素质技术技能人才。',
    icon: Target,
    image: '/images/mission/industry-education.jpg',
    highlights: ['校企合作基地', '实习实训平台', '师资队伍共建', '科研成果转化'],
    features: [
      '与多所高校建立深度合作关系',
      '提供实习实训基地和就业机会',
      '共建专业课程和实验室',
      '开展产学研协同创新项目',
      '培养应用型技术人才',
      '推动科技成果产业化',
    ],
    achievements: [
      { value: '15+', label: '合作院校' },
      { value: '500+', label: '实习学生' },
      { value: '20+', label: '科研项目' },
    ],
    gradient: 'from-blue-600 to-cyan-600',
    accentColor: 'blue',
    href: '/mission/industry-education',
  },
  {
    id: 'honors-activities',
    title: '荣誉活动',
    subtitle: '企业荣誉与活动展示',
    description: '积极参与行业活动，承担社会责任，获得各级政府和行业组织认可。',
    icon: CheckCircle,
    image: '/images/mission/honors-activities.jpg',
    highlights: ['行业标杆企业', '科技创新奖项', '社会责任活动', '党建工作示范'],
    features: [
      '获得多项行业权威认证',
      '参与制定行业技术标准',
      '承办重要行业会议和活动',
      '开展公益慈善活动',
      '加强党建和企业文化建设',
      '推动行业健康发展',
    ],
    achievements: [
      { value: '50+', label: '荣誉奖项' },
      { value: '100+', label: '活动参与' },
      { value: '10+', label: '标准制定' },
    ],
    gradient: 'from-emerald-600 to-teal-600',
    accentColor: 'emerald',
    href: '/mission/honors-activities',
  },

  {
    id: 'company-news',
    title: '公司动态',
    subtitle: '公司最新动态和新闻',
    description: '及时发布公司重要动态，展示企业发展成果，传播企业文化理念。',
    icon: Lightbulb,
    image: '/images/mission/company-news.jpg',
    highlights: ['重大项目进展', '技术创新成果', '企业文化活动', '媒体报道'],
    features: [
      '发布重要项目进展信息',
      '展示技术创新和研发成果',
      '分享企业文化和团队活动',
      '及时回应社会关切',
      '传播正能量和价值观',
      '加强与媒体的良性互动',
    ],
    achievements: [
      { value: '200+', label: '新闻发布' },
      { value: '50+', label: '媒体报道' },
      { value: '100+', label: '文化活动' },
    ],
    gradient: 'from-orange-600 to-red-500',
    accentColor: 'orange',
    href: '/mission/company-news',
  },
  {
    id: 'join-us',
    title: '加入我们',
    subtitle: '企业招聘信息',
    description: '诚邀优秀人才加入我们的团队，共同推动智能安防技术发展。',
    icon: Users,
    image: '/images/mission/join-us.jpg',
    highlights: ['技术研发岗位', '市场销售岗位', '管理支持岗位', '实习培训机会'],
    features: [
      '提供有竞争力的薪酬待遇',
      '完善的职业发展通道',
      '良好的工作环境和氛围',
      '丰富的培训和学习机会',
      '灵活的工作方式',
      '全面的福利保障体系',
    ],
    achievements: [
      { value: '200+', label: '团队成员' },
      { value: '50+', label: '开放职位' },
      { value: '95%', label: '员工满意度' },
    ],
    gradient: 'from-slate-600 to-gray-600',
    accentColor: 'slate',
    href: '/careers',
  },
]

// 各板块详细内容
export const missionContents: Record<string, MissionContent> = {
  'industry-education': {
    title: '产教融合',
    description: '深化产教融合，校企合作，建立产学研一体化平台，培养高素质技术技能人才。',
    items: [
      {
        title: '校企合作基地建设',
        description: '与重点院校共建实习实训基地，为学生提供真实的工作环境和项目实践机会。',
        image: '/images/mission/cooperation-base.jpg',
        date: '2024-01',
        tags: ['校企合作', '实训基地', '人才培养'],
      },
      {
        title: '产学研协同创新',
        description: '与高校科研院所开展深度合作，共同承担重大科研项目，推动技术创新。',
        image: '/images/mission/research-cooperation.jpg',
        date: '2024-02',
        tags: ['科研合作', '技术创新', '产学研'],
      },
      {
        title: '师资队伍共建',
        description: '选派优秀工程师担任高校兼职教师，邀请知名教授担任技术顾问。',
        image: '/images/mission/faculty-building.jpg',
        date: '2024-03',
        tags: ['师资建设', '人才交流', '教育合作'],
      },
    ],
  },
  'honors-activities': {
    title: '荣誉活动',
    description: '积极参与行业活动，承担社会责任，获得各级政府和行业组织认可。',
    items: [
      {
        title: '国家高新技术企业认定',
        description: '获得国家高新技术企业认定，体现了公司在技术创新方面的实力。',
        image: '/images/mission/high-tech-enterprise.jpg',
        date: '2024-01',
        tags: ['国家认定', '高新技术', '企业荣誉'],
      },
      {
        title: '行业技术创新奖',
        description: '在智能安防技术创新方面获得行业权威机构颁发的技术创新奖。',
        image: '/images/mission/innovation-award.jpg',
        date: '2024-02',
        tags: ['技术创新', '行业奖项', '专业认可'],
      },
      {
        title: '社会责任实践活动',
        description: '积极参与公益慈善活动，履行企业社会责任，回馈社会。',
        image: '/images/mission/social-responsibility.jpg',
        date: '2024-03',
        tags: ['社会责任', '公益活动', '企业文化'],
      },
    ],
  },

  'company-news': {
    title: '公司动态',
    description: '及时发布公司重要动态，展示企业发展成果，传播企业文化理念。',
    items: [
      {
        title: '新产品发布会成功举办',
        description: '公司最新智能安防产品正式发布，获得行业和客户的高度关注。',
        image: '/images/mission/product-launch.jpg',
        date: '2024-03-15',
        tags: ['产品发布', '技术创新', '市场拓展'],
      },
      {
        title: '技术研发中心正式启用',
        description: '投资建设的技术研发中心正式启用，为技术创新提供强有力支撑。',
        image: '/images/mission/rd-center.jpg',
        date: '2024-03-10',
        tags: ['研发中心', '技术创新', '基础设施'],
      },
      {
        title: '员工技能培训活动',
        description: '组织开展员工技能培训活动，提升团队专业能力和综合素质。',
        image: '/images/mission/training-activity.jpg',
        date: '2024-03-05',
        tags: ['员工培训', '技能提升', '团队建设'],
      },
    ],
  },
}

// 获取指定模块
export function getMissionModule(id: string): MissionModule | undefined {
  return missionModules.find(module => module.id === id)
}

// 获取指定模块的详细内容
export function getMissionContent(id: string): MissionContent | undefined {
  return missionContents[id]
}

// 公司动态新闻数据
export interface NewsItem {
  id: string
  title: string
  summary: string
  content: string
  image: string
  date: string
  category: string
  tags: string[]
  author: string
  readTime: string
}

export const companyNews: NewsItem[] = [
  {
    id: 'product-launch-2024',
    title: '新一代智能安防产品正式发布',
    summary: '公司最新研发的智能安防产品正式发布，集成了最新的AI技术和物联网技术。',
    content:
      '经过两年的精心研发，我们的新一代智能安防产品今日正式发布。该产品集成了最新的人工智能算法、边缘计算技术和物联网通信协议，能够提供更加智能、高效、可靠的安防解决方案。产品发布会吸引了来自全国各地的合作伙伴和客户代表，获得了广泛好评。',
    image: '/images/news/product-launch-2024.jpg',
    date: '2024-03-15',
    category: '产品发布',
    tags: ['产品发布', 'AI技术', '物联网'],
    author: '市场部',
    readTime: '3分钟',
  },
  {
    id: 'rd-center-opening',
    title: '技术研发中心正式启用',
    summary: '投资5000万元建设的技术研发中心正式启用，为公司技术创新提供强有力支撑。',
    content:
      '公司投资5000万元建设的技术研发中心今日正式启用。该中心占地面积3000平方米，配备了最先进的研发设备和测试环境，将为公司在人工智能、物联网、大数据等前沿技术领域的研发工作提供强有力的支撑。研发中心的启用标志着公司在技术创新方面迈出了重要一步。',
    image: '/images/news/rd-center-opening.jpg',
    date: '2024-03-10',
    category: '企业发展',
    tags: ['研发中心', '技术创新', '投资建设'],
    author: '技术部',
    readTime: '4分钟',
  },
  {
    id: 'partnership-signing',
    title: '与知名高校签署战略合作协议',
    summary: '公司与清华大学、北京理工大学等知名高校签署战略合作协议，深化产学研合作。',
    content:
      '公司与清华大学、北京理工大学等多所知名高校签署战略合作协议，将在人才培养、技术研发、成果转化等方面开展深度合作。此次合作将有助于公司获得更多优秀人才，提升技术创新能力，推动产学研一体化发展。',
    image: '/images/news/partnership-signing.jpg',
    date: '2024-03-05',
    category: '合作签约',
    tags: ['校企合作', '产学研', '人才培养'],
    author: '人力资源部',
    readTime: '3分钟',
  },
  {
    id: 'award-ceremony',
    title: '荣获国家高新技术企业认定',
    summary: '公司正式获得国家高新技术企业认定，这是对公司技术创新能力的重要认可。',
    content:
      '经过严格的评审程序，公司正式获得国家高新技术企业认定。这一认定是对公司在技术创新、研发投入、知识产权等方面成果的重要认可，也将为公司未来的发展提供更多政策支持和发展机遇。',
    image: '/images/news/award-ceremony.jpg',
    date: '2024-02-28',
    category: '荣誉奖项',
    tags: ['高新技术企业', '技术创新', '企业认定'],
    author: '行政部',
    readTime: '2分钟',
  },
  {
    id: 'team-building',
    title: '员工技能培训活动圆满结束',
    summary: '为期一周的员工技能培训活动圆满结束，全体员工的专业技能得到显著提升。',
    content:
      '公司组织的为期一周的员工技能培训活动圆满结束。本次培训涵盖了技术技能、管理能力、沟通协作等多个方面，邀请了行业专家和内部资深员工担任讲师。通过培训，全体员工的专业技能和综合素质得到了显著提升，为公司的持续发展奠定了坚实的人才基础。',
    image: '/images/news/team-building.jpg',
    date: '2024-02-20',
    category: '员工发展',
    tags: ['员工培训', '技能提升', '团队建设'],
    author: '人力资源部',
    readTime: '3分钟',
  },
  {
    id: 'market-expansion',
    title: '成功拓展海外市场业务',
    summary: '公司成功拓展海外市场业务，与多个国际客户签署合作协议。',
    content:
      '经过半年的市场调研和商务洽谈，公司成功拓展海外市场业务，与来自美国、欧洲、东南亚等地区的多个国际客户签署了合作协议。这标志着公司国际化战略取得重要进展，为公司未来的全球化发展奠定了基础。',
    image: '/images/news/market-expansion.jpg',
    date: '2024-02-15',
    category: '市场拓展',
    tags: ['海外市场', '国际合作', '业务拓展'],
    author: '市场部',
    readTime: '4分钟',
  },
]

// 新闻数据获取函数
export function getNewsById(id: string): NewsItem | undefined {
  return companyNews.find(news => news.id === id)
}

export function getRelatedNews(currentNewsId: string, limit: number = 3): NewsItem[] {
  return companyNews.filter(news => news.id !== currentNewsId).slice(0, limit)
}

export function getNewsByCategory(category: string, limit?: number): NewsItem[] {
  const filtered = companyNews.filter(news => news.category === category)
  return limit ? filtered.slice(0, limit) : filtered
}
