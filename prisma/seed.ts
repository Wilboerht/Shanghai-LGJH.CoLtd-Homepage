/**
 * 数据库种子文件
 * 用于初始化CMS系统的基础数据
 */

import { PrismaClient, ResearchCategory, ResearchStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化数据库...')

  // 创建默认管理员用户
  console.log('创建管理员用户...')

  let admin
  try {
    // 先检查用户是否已存在
    const existingUser = await prisma.user.findUnique({
      where: { email: 'admin@lgjh.com' },
    })

    if (existingUser) {
      console.log('✅ 管理员用户已存在:', existingUser.email)
      admin = existingUser
    } else {
      // 使用bcrypt加密的密码，默认密码是 "admin123"
      const bcrypt = require('bcryptjs')
      const passwordHash = await bcrypt.hash('admin123', 12)

      admin = await prisma.user.create({
        data: {
          email: 'admin@lgjh.com',
          name: '系统管理员',
          passwordHash,
          isAdmin: true,
        },
      })
      console.log('✅ 创建管理员用户:', admin.email)
      console.log('📝 默认密码: admin123')
    }
  } catch (error) {
    console.error('❌ 创建管理员用户失败:', error)
    return
  }

  // 创建基础网站配置
  const siteConfigs = [
    {
      key: 'site_title',
      value: '临港景鸿 - 专业安防解决方案',
      category: 'general',
      description: '网站标题',
    },
    {
      key: 'site_description',
      value: '专业安防解决方案提供商，提供智能监控系统和全面的安防服务。',
      category: 'general',
      description: '网站描述',
    },
    {
      key: 'company_name',
      value: '临港景鸿',
      category: 'company',
      description: '公司名称',
    },
    {
      key: 'company_phone',
      value: '+86-21-12345678',
      category: 'contact',
      description: '公司电话',
    },
    {
      key: 'company_email',
      value: 'contact@lgjh.com',
      category: 'contact',
      description: '公司邮箱',
    },
    {
      key: 'company_address',
      value: '上海市浦东新区临港新片区',
      category: 'contact',
      description: '公司地址',
    },
  ]

  for (const config of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config,
    })
  }

  console.log('✅ 创建基础网站配置')

  // 创建示例页面
  const pages = [
    {
      title: '首页',
      slug: 'home',
      content: '欢迎来到临港景鸿官网',
      metaTitle: '临港景鸿 - 专业安防解决方案',
      metaDescription: '专业安防解决方案提供商',
      status: 'PUBLISHED' as const,
      updatedBy: admin.id,
    },
    {
      title: '关于我们',
      slug: 'about',
      content: '临港景鸿公司介绍',
      metaTitle: '关于我们 - 临港景鸿',
      metaDescription: '了解临港景鸿的发展历程和企业文化',
      status: 'PUBLISHED' as const,
      updatedBy: admin.id,
    },
  ]

  // 注释：page模型已被移除，跳过页面数据填充
  // for (const page of pages) {
  //   await prisma.page.upsert({
  //     where: { slug: page.slug },
  //     update: { ...page },
  //     create: page,
  //   })
  // }

  console.log('✅ 创建示例页面')

  // 创建产教融合模块数据
  console.log('创建产教融合模块数据...')

  // 首先创建或更新产教融合模块
  const industryEducationModule = await prisma.missionModule.upsert({
    where: { category: 'industry-education' },
    update: {},
    create: {
      id: 'cmdqxt3h70000sd74v5azzc25',
      title: '产教融合',
      subtitle: '产学研合作与人才培养',
      description: '深化产教融合，校企合作，建立产学研一体化平台，培养高素质技术技能人才。',
      icon: 'Target',
      image: '/images/mission/industry-education.jpg',
      highlights: ['校企合作基地', '实习实训平台', '师资队伍共建', '科研成果转化'],
      features: [
        '与多所高校建立深度合作关系',
        '提供实习实训基地和就业机会',
        '共建专业课程和实验室',
        '开展产学研合作创新项目',
        '培养应用型技术人才',
        '推进科技成果产业化',
      ],
      achievements: [
        { value: '15+', label: '合作院校' },
        { value: '500+', label: '实习学生' },
        { value: '20+', label: '科研项目' },
      ],
      gradient: 'from-blue-600 to-cyan-600',
      accentColor: 'blue',
      href: '/mission/industry-education',
      category: 'industry-education',
      status: 'published',
      sortOrder: 1,
      updatedBy: admin.id,
    },
  })

  // 创建合作项目数据
  const cooperationProjects = [
    {
      id: 'cmdqxt3hd0002sd74flspiy9r',
      moduleId: industryEducationModule.id,
      title: '智能制造产教融合基地',
      description: '与上海工程技术大学共建智能制造产教融合基地，培养智能制造领域高技能人才。',
      content: `
        <h2>项目概述</h2>
        <p>智能制造产教融合基地是我们与上海工程技术大学合作建立的重要教育实践平台。基地集教学、实训、科研、生产于一体，为学生提供真实的工业环境和实践机会。</p>

        <h2>合作内容</h2>
        <ul>
          <li>共建智能制造实验室</li>
          <li>开发产教融合课程体系</li>
          <li>提供企业导师和实习岗位</li>
          <li>开展技术研发合作</li>
        </ul>

        <h2>预期成果</h2>
        <p>通过基地建设，预计每年培养智能制造专业人才200余名，完成技术研发项目10余项，推动产业技术升级。</p>
      `,
      summary: '与上海工程技术大学共建智能制造产教融合基地，培养高技能人才。',
      image: '/images/mission/cooperation-base.jpg',
      date: new Date('2024-01-15'),
      tags: ['智能制造', '产教融合', '人才培养'],
      category: '校企合作',
      status: 'published',
      featured: true,
      sortOrder: 1,
      metadata: {
        partner: '上海工程技术大学',
        duration: '3年',
        investment: '500万元',
      },
      authorId: admin.id,
    },
    {
      id: 'cmdqxt3hd0003sd74flspiy9s',
      moduleId: industryEducationModule.id,
      title: '产学研协同创新中心',
      description: '联合多所高校建立产学研协同创新中心，推进科技成果转化和产业化。',
      content: `
        <h2>中心简介</h2>
        <p>产学研协同创新中心汇聚了企业、高校、科研院所的优势资源，形成了产学研深度融合的创新生态系统。</p>

        <h2>主要功能</h2>
        <ul>
          <li>技术研发与创新</li>
          <li>成果转化与产业化</li>
          <li>人才培养与交流</li>
          <li>国际合作与交流</li>
        </ul>

        <h2>合作模式</h2>
        <p>采用"政产学研用"五位一体的合作模式，建立长效合作机制，实现资源共享、优势互补。</p>
      `,
      summary: '联合多所高校建立产学研协同创新中心，推进科技成果转化。',
      image: '/images/mission/research-cooperation.jpg',
      date: new Date('2024-02-20'),
      tags: ['产学研', '协同创新', '成果转化'],
      category: '产学研协同',
      status: 'published',
      featured: true,
      sortOrder: 2,
      metadata: {
        partners: ['同济大学', '华东理工大学', '上海大学'],
        focus: '智能安防技术',
        funding: '1000万元',
      },
      authorId: admin.id,
    },
    {
      id: 'cmdqxt3hd0004sd74flspiy9t',
      moduleId: industryEducationModule.id,
      title: '双师型师资队伍建设',
      description: '与合作院校共同建设双师型师资队伍，提升教学质量和实践能力。',
      content: `
        <h2>建设目标</h2>
        <p>建设一支既有理论功底又有实践经验的双师型师资队伍，提升人才培养质量。</p>

        <h2>建设内容</h2>
        <ul>
          <li>企业工程师进校园</li>
          <li>高校教师企业实践</li>
          <li>联合培养师资</li>
          <li>技能竞赛指导</li>
        </ul>

        <h2>实施效果</h2>
        <p>通过双师型师资队伍建设，有效提升了教学质量，增强了学生的实践能力和就业竞争力。</p>
      `,
      summary: '与合作院校共同建设双师型师资队伍，提升教学质量。',
      image: '/images/mission/faculty-building.jpg',
      date: new Date('2024-03-10'),
      tags: ['师资建设', '双师型', '教学质量'],
      category: '师资队伍',
      status: 'published',
      featured: false,
      sortOrder: 3,
      metadata: {
        teachers: 50,
        programs: ['智能制造', '电子信息', '计算机科学'],
        duration: '长期',
      },
      authorId: admin.id,
    },
  ]

  for (const project of cooperationProjects) {
    await prisma.missionItem.upsert({
      where: { id: project.id },
      update: { ...project },
      create: project,
    })
  }

  // 创建合作院校数据
  const partnerUniversities = [
    {
      id: 'cmdqxt3hd0005sd74flspiy9u',
      moduleId: industryEducationModule.id,
      title: '上海工程技术大学',
      description: '在智能制造、电子信息等领域开展深度合作，共建产教融合基地。',
      content: `
        <h2>合作概况</h2>
        <p>上海工程技术大学是我们重要的合作伙伴，双方在智能制造、电子信息等领域建立了长期稳定的合作关系。</p>

        <h2>合作项目</h2>
        <ul>
          <li>智能制造产教融合基地</li>
          <li>电子信息技术联合实验室</li>
          <li>学生实习实训项目</li>
          <li>教师企业实践项目</li>
        </ul>

        <h2>合作成果</h2>
        <p>累计培养学生500余名，完成科研项目20余项，申请专利15项，实现了校企双赢。</p>
      `,
      summary: '在智能制造、电子信息等领域开展深度合作。',
      image: '/images/partners/sues.jpg',
      date: new Date('2023-09-01'),
      tags: ['合作院校', '智能制造', '电子信息'],
      category: '合作院校',
      status: 'published',
      featured: true,
      sortOrder: 1,
      metadata: {
        established: '2023年',
        students: 200,
        projects: 8,
        website: 'https://www.sues.edu.cn',
      },
      authorId: admin.id,
    },
    {
      id: 'cmdqxt3hd0006sd74flspiy9v',
      moduleId: industryEducationModule.id,
      title: '同济大学',
      description: '在人工智能、自动化控制等前沿技术领域开展产学研合作。',
      content: `
        <h2>合作背景</h2>
        <p>同济大学作为国内知名高校，在人工智能、自动化控制等领域具有强大的科研实力，是我们重要的科研合作伙伴。</p>

        <h2>合作领域</h2>
        <ul>
          <li>人工智能技术研发</li>
          <li>自动化控制系统</li>
          <li>智能安防算法</li>
          <li>研究生联合培养</li>
        </ul>

        <h2>合作成效</h2>
        <p>双方合作开发了多项核心技术，获得国家级科技奖励2项，发表高水平论文30余篇。</p>
      `,
      summary: '在人工智能、自动化控制等前沿技术领域开展合作。',
      image: '/images/partners/tongji.jpg',
      date: new Date('2023-10-15'),
      tags: ['合作院校', '人工智能', '自动化'],
      category: '合作院校',
      status: 'published',
      featured: true,
      sortOrder: 2,
      metadata: {
        established: '2023年',
        focus: '前沿技术研发',
        level: '战略合作',
        website: 'https://www.tongji.edu.cn',
      },
      authorId: admin.id,
    },
    {
      id: 'cmdqxt3hd0007sd74flspiy9w',
      moduleId: industryEducationModule.id,
      title: '华东理工大学',
      description: '在化工安全、环境监测等专业领域建立合作关系。',
      content: `
        <h2>合作特色</h2>
        <p>华东理工大学在化工安全、环境监测等领域具有专业优势，双方合作开发了多项专业安防解决方案。</p>

        <h2>合作内容</h2>
        <ul>
          <li>化工安全监控系统</li>
          <li>环境监测技术</li>
          <li>安全评估方法</li>
          <li>专业人才培养</li>
        </ul>

        <h2>应用成果</h2>
        <p>合作成果已在多个化工企业得到应用，有效提升了安全生产水平。</p>
      `,
      summary: '在化工安全、环境监测等专业领域建立合作关系。',
      image: '/images/partners/ecust.jpg',
      date: new Date('2023-11-20'),
      tags: ['合作院校', '化工安全', '环境监测'],
      category: '合作院校',
      status: 'published',
      featured: false,
      sortOrder: 3,
      metadata: {
        established: '2023年',
        speciality: '化工安全',
        applications: 15,
        website: 'https://www.ecust.edu.cn',
      },
      authorId: admin.id,
    },
  ]

  for (const university of partnerUniversities) {
    await prisma.missionItem.upsert({
      where: { id: university.id },
      update: { ...university },
      create: university,
    })
  }

  console.log('✅ 创建产教融合数据')

  // 创建荣誉活动模块数据
  console.log('创建荣誉活动模块数据...')

  // 首先创建或更新荣誉活动模块
  const honorsActivitiesModule = await prisma.missionModule.upsert({
    where: { category: 'honors-activities' },
    update: {},
    create: {
      id: 'cmdqxt3hm0007sd74q0dkpapu',
      category: 'honors-activities',
      title: '荣誉活动',
      subtitle: '企业荣誉与社会活动',
      description:
        '展示公司获得的各项荣誉认证和参与的社会公益活动，体现企业的社会责任感和行业影响力。',
      icon: 'Award',
      gradient: 'from-yellow-600 to-orange-600',
      accentColor: 'yellow',
      sortOrder: 3,
      status: 'active',
      updatedBy: admin.id,
    },
  })

  // 创建荣誉活动项目数据
  const honorsActivitiesItems = [
    // 荣誉奖项
    {
      id: 'cmdqxt3hd0008sd74flspiy9x',
      moduleId: 'cmdqxt3hm0007sd74q0dkpapu', // 荣誉活动模块ID
      title: '国家高新技术企业认定',
      description: '获得国家高新技术企业认定，体现了公司在技术创新方面的实力和潜力。',
      content: `
        <h2>认定概况</h2>
        <p>经过严格的评审程序，公司正式获得国家高新技术企业认定。这一认定是对公司在技术创新、研发投入、知识产权等方面成效的重要认可。</p>

        <h2>认定意义</h2>
        <ul>
          <li>技术创新能力得到国家认可</li>
          <li>享受相关税收优惠政策</li>
          <li>提升企业品牌形象和市场竞争力</li>
          <li>为未来发展提供更多政策支持</li>
        </ul>

        <h2>未来展望</h2>
        <p>公司将继续加大研发投入，推动技术创新，为智能安防行业发展贡献更多力量。</p>
      `,
      summary: '获得国家高新技术企业认定，技术创新能力得到认可。',
      image: '/images/honors/high-tech-enterprise.jpg',
      date: new Date('2024-02-28'),
      tags: ['高新技术企业', '技术创新', '企业认定'],
      category: '荣誉奖项',
      status: 'published',
      featured: true,
      sortOrder: 1,
      metadata: {
        issuer: '科技部',
        level: '国家级',
        validPeriod: '3年',
      },
      authorId: admin.id,
    },
    {
      id: 'cmdqxt3hd0009sd74flspiy9y',
      moduleId: 'cmdqxt3hm0007sd74q0dkpapu',
      title: '上海市专精特新企业',
      description: '获评上海市专精特新企业，在细分领域具有专业化、精细化、特色化、新颖化特征。',
      content: `
        <h2>评选背景</h2>
        <p>上海市专精特新企业是指在细分市场上专注于某一特定领域，具有专业化、精细化、特色化、新颖化特征的中小企业。</p>

        <h2>企业优势</h2>
        <ul>
          <li>在智能安防领域具有专业技术优势</li>
          <li>产品和服务精细化程度高</li>
          <li>具有独特的技术特色和创新能力</li>
          <li>在细分市场具有较强竞争力</li>
        </ul>
      `,
      summary: '获评上海市专精特新企业，在细分领域具有专业化特征。',
      image: '/images/honors/specialized-enterprise.jpg',
      date: new Date('2024-01-15'),
      tags: ['专精特新', '上海市', '企业认定'],
      category: '荣誉奖项',
      status: 'published',
      featured: true,
      sortOrder: 2,
      metadata: {
        issuer: '上海市经信委',
        level: '市级',
        validPeriod: '3年',
      },
      authorId: admin.id,
    },
    // 公益活动
    {
      id: 'cmdqxt3hd0010sd74flspiy9z',
      moduleId: 'cmdqxt3hm0007sd74q0dkpapu',
      title: '智慧校园安全公益项目',
      description: '为偏远地区学校免费提供智能安防设备和技术支持，保障校园安全。',
      content: `
        <h2>项目背景</h2>
        <p>为响应国家教育扶贫政策，公司发起智慧校园安全公益项目，为偏远地区学校提供免费的智能安防解决方案。</p>

        <h2>项目内容</h2>
        <ul>
          <li>免费提供智能监控设备</li>
          <li>安装门禁控制系统</li>
          <li>提供技术培训和维护服务</li>
          <li>建立应急响应机制</li>
        </ul>

        <h2>项目成果</h2>
        <p>已为20所偏远地区学校提供服务，覆盖师生超过5000人，有效提升了校园安全水平。</p>
      `,
      summary: '为偏远地区学校免费提供智能安防设备，保障校园安全。',
      image: '/images/activities/campus-safety.jpg',
      date: new Date('2024-03-20'),
      tags: ['公益活动', '校园安全', '教育扶贫'],
      category: '公益活动',
      status: 'published',
      featured: true,
      sortOrder: 3,
      metadata: {
        participants: 100,
        beneficiaries: 5000,
        schools: 20,
        participantCount: 100,
      },
      authorId: admin.id,
    },
    {
      id: 'cmdqxt3hd0011sd74flspiy90',
      moduleId: 'cmdqxt3hm0007sd74q0dkpapu',
      title: '智能制造技术交流会',
      description: '举办智能制造技术交流会，分享最新技术成果和行业趋势。',
      content: `
        <h2>会议概况</h2>
        <p>公司主办的智能制造技术交流会在上海临港会展中心成功举办，吸引了来自全国各地的专家学者和企业代表。</p>

        <h2>会议亮点</h2>
        <ul>
          <li>发布3项智能制造新技术</li>
          <li>签署5个产学研合作协议</li>
          <li>10余家媒体现场报道</li>
          <li>200多名行业专家参与</li>
        </ul>

        <h2>会议影响</h2>
        <p>推动了智能制造技术的交流与合作，扩大了公司在行业内的影响力。</p>
      `,
      summary: '举办智能制造技术交流会，推动行业技术交流与合作。',
      image: '/images/activities/tech-conference.jpg',
      date: new Date('2024-03-10'),
      tags: ['技术交流', '智能制造', '行业会议'],
      category: '行业会议',
      status: 'published',
      featured: true,
      sortOrder: 4,
      metadata: {
        participants: 200,
        mediaReports: 10,
        agreements: 5,
        participantCount: 200,
      },
      authorId: admin.id,
    },
  ]

  for (const item of honorsActivitiesItems) {
    await prisma.missionItem.upsert({
      where: { id: item.id },
      update: { ...item },
      create: item,
    })
  }

  console.log('✅ 创建荣誉活动数据')

  // 创建荣誉活动数据
  const honorActivities = [
    {
      id: 'cmdqxt3hd0015sd74flspiy94',
      moduleId: 'cmdqxt3hy000esd744b7w2jzw',
      title: '中国安防行业协会',
      description: '作为中国安防行业协会理事单位，积极参与行业标准制定和技术交流。',
      content: `
        <h2>协会简介</h2>
        <p>中国安防行业协会是全国性的安防行业组织，致力于推动安防行业健康发展。</p>

        <h2>参与活动</h2>
        <ul>
          <li>参与行业标准制定</li>
          <li>组织技术交流活动</li>
          <li>推广先进技术和产品</li>
          <li>维护行业合法权益</li>
        </ul>
      `,
      summary: '作为理事单位参与中国安防行业协会，推动行业发展。',
      image: '/images/alliances/security-association.jpg',
      date: new Date('2023-12-01'),
      tags: ['产业联盟', '行业协会', '安防行业'],
      category: '产业联盟',
      status: 'published',
      featured: true,
      sortOrder: 4,
      metadata: {
        role: '理事单位',
        memberSince: '2023',
        activities: 15,
      },
      authorId: admin.id,
    },
  ]

  // 注释：externalCooperationItems变量未定义，跳过此部分
  // for (const item of externalCooperationItems) {
  //   await prisma.missionItem.upsert({
  //     where: { id: item.id },
  //     update: { ...item },
  //     create: item,
  //   })
  // }

  console.log('✅ 创建对外合作数据')

  // 创建招聘职位数据
  console.log('创建招聘职位数据...')

  const jobPositions = [
    {
      id: 'cmdqxt3jp0001sd74abc123de',
      title: '高级前端开发工程师',
      department: '技术研发部',
      location: '上海临港',
      type: '全职',
      experience: '3-5年',
      salary: '20K-35K',
      description: '负责公司智能安防系统前端界面开发，参与产品架构设计和技术方案制定。',
      requirements: JSON.stringify([
        '本科及以上学历，计算机相关专业',
        '3年以上前端开发经验',
        '熟练掌握React、Vue等前端框架',
        '熟悉TypeScript、JavaScript ES6+',
        '了解Node.js、Webpack等构建工具',
        '有移动端开发经验者优先',
      ]),
      benefits: JSON.stringify([
        '五险一金',
        '年终奖金',
        '带薪年假',
        '技能培训',
        '弹性工作',
        '团建活动',
      ]),
      tags: JSON.stringify(['前端开发', 'React', 'TypeScript', '技术研发']),
      isHot: true,
      isUrgent: false,
      status: 'published',
      createdBy: admin.id,
    },
    {
      id: 'cmdqxt3jp0002sd74abc123df',
      title: '算法工程师',
      department: '技术研发部',
      location: '上海临港',
      type: '全职',
      experience: '2-4年',
      salary: '25K-40K',
      description: '负责计算机视觉算法研发，包括目标检测、人脸识别、行为分析等核心算法。',
      requirements: JSON.stringify([
        '硕士及以上学历，计算机视觉、机器学习相关专业',
        '2年以上算法开发经验',
        '熟练掌握Python、C++编程语言',
        '熟悉深度学习框架如TensorFlow、PyTorch',
        '有计算机视觉项目经验',
        '发表过相关论文者优先',
      ]),
      benefits: JSON.stringify([
        '五险一金',
        '股权激励',
        '年终奖金',
        '学术交流',
        '技术培训',
        '研发津贴',
      ]),
      tags: JSON.stringify(['算法开发', '计算机视觉', 'Python', '深度学习']),
      isHot: true,
      isUrgent: true,
      status: 'published',
      createdBy: admin.id,
    },
    {
      id: 'cmdqxt3jp0003sd74abc123dg',
      title: '产品经理',
      department: '产品部',
      location: '上海临港',
      type: '全职',
      experience: '3-6年',
      salary: '18K-30K',
      description: '负责智能安防产品规划和设计，协调技术团队完成产品开发和迭代。',
      requirements: JSON.stringify([
        '本科及以上学历，产品管理、计算机相关专业',
        '3年以上产品经理经验',
        '有B端产品设计经验',
        '熟悉安防行业者优先',
        '具备良好的沟通协调能力',
        '熟练使用Axure、Figma等产品设计工具',
      ]),
      benefits: JSON.stringify([
        '五险一金',
        '年终奖金',
        '带薪年假',
        '产品培训',
        '行业交流',
        '职业发展',
      ]),
      tags: JSON.stringify(['产品管理', '需求分析', 'B端产品', '安防行业']),
      isHot: false,
      isUrgent: false,
      status: 'published',
      createdBy: admin.id,
    },
    {
      id: 'cmdqxt3jp0004sd74abc123dh',
      title: '销售经理',
      department: '销售部',
      location: '上海临港',
      type: '全职',
      experience: '2-5年',
      salary: '15K-25K + 提成',
      description: '负责智能安防产品的市场推广和客户开发，维护重要客户关系。',
      requirements: JSON.stringify([
        '大专及以上学历，市场营销、商务相关专业',
        '2年以上B端销售经验',
        '有安防、IT行业销售经验者优先',
        '具备良好的客户沟通能力',
        '能够承受一定的工作压力',
        '有驾照，能适应出差',
      ]),
      benefits: JSON.stringify([
        '五险一金',
        '高额提成',
        '年终奖金',
        '销售奖励',
        '出差补贴',
        '团队建设',
      ]),
      tags: JSON.stringify(['销售管理', 'B端销售', '客户开发', '安防行业']),
      isHot: false,
      isUrgent: false,
      status: 'published',
      createdBy: admin.id,
    },
    {
      id: 'cmdqxt3jp0005sd74abc123di',
      title: '实习生（技术方向）',
      department: '技术研发部',
      location: '上海临港',
      type: '实习',
      experience: '在校学生',
      salary: '150-200/天',
      description: '参与公司技术项目开发，学习智能安防相关技术，获得实际项目经验。',
      requirements: JSON.stringify([
        '本科及以上在读，计算机相关专业',
        '掌握至少一门编程语言',
        '对人工智能、计算机视觉感兴趣',
        '学习能力强，有责任心',
        '能保证每周至少3天实习时间',
        '有相关项目经验者优先',
      ]),
      benefits: JSON.stringify([
        '实习津贴',
        '技术指导',
        '项目经验',
        '转正机会',
        '学习资源',
        '团队活动',
      ]),
      tags: JSON.stringify(['实习生', '技术学习', '项目实践', '转正机会']),
      isHot: false,
      isUrgent: false,
      status: 'published',
      createdBy: admin.id,
    },
  ]

  for (const job of jobPositions) {
    await prisma.jobPosition.upsert({
      where: { id: job.id },
      update: { ...job },
      create: job,
    })
  }

  console.log('✅ 创建招聘职位数据')

  // 创建导航菜单
  console.log('🔗 创建导航菜单...')

  // 主导航菜单
  const mainMenus = [
    {
      name: '首页',
      href: '/',
      icon: 'Home',
      sortOrder: 1,
      position: 'main',
    },
    {
      name: '产品',
      href: '/products',
      icon: 'Package',
      description: '我们的产品和服务',
      sortOrder: 2,
      position: 'main',
    },
    {
      name: '解决方案',
      href: '/solutions',
      icon: 'Lightbulb',
      description: '行业解决方案',
      sortOrder: 3,
      position: 'main',
    },
    {
      name: '服务',
      href: '/services',
      icon: 'Wrench',
      description: '专业服务',
      sortOrder: 4,
      position: 'main',
    },
    {
      name: '研究',
      href: '/research',
      icon: 'Search',
      description: '研究成果',
      sortOrder: 5,
      position: 'main',
    },
    {
      name: '使命责任',
      href: '/mission',
      icon: 'Target',
      description: '企业使命与社会责任',
      sortOrder: 6,
      position: 'main',
    },
    {
      name: '联系我们',
      href: '/contact',
      icon: 'Mail',
      description: '联系方式',
      sortOrder: 7,
      position: 'main',
    },
  ]

  // 注释：navigationMenu模型已被移除，跳过导航菜单数据填充
  // for (const menuData of mainMenus) {
  //   await prisma.navigationMenu.upsert({
  //     where: {
  //       name_position: {
  //         name: menuData.name,
  //         position: menuData.position,
  //       },
  //     },
  //     update: { ...menuData, updatedBy: admin.id },
  //     create: { ...menuData, updatedBy: admin.id },
  //   })
  // }

  // 注释：navigationMenu模型已被移除，跳过产品子菜单创建
  // const productMenu = await prisma.navigationMenu.findFirst({
  //   where: { name: '产品', position: 'main' },
  // })

  // 注释：productMenu变量已被注释，跳过子菜单创建
  // if (productMenu) {
  const productSubMenus = [
    {
      name: 'AI智能平台',
      href: '/products/ai-platform',
      icon: 'Lightbulb',
      description: '人工智能解决方案',
      // parentId: productMenu.id,
      sortOrder: 1,
      position: 'main',
    },
    {
      name: '数据分析工具',
      href: '/products/data-analytics',
      icon: 'Activity',
      description: '大数据分析平台',
      // parentId: productMenu.id,
      sortOrder: 2,
      position: 'main',
    },
    {
      name: '云计算服务',
      href: '/products/cloud-services',
      icon: 'Cpu',
      description: '云端计算解决方案',
      // parentId: productMenu.id,
      sortOrder: 3,
      position: 'main',
    },
  ]

  // 注释：navigationMenu模型已被移除，跳过子菜单创建
  // for (const subMenuData of productSubMenus) {
  //   await prisma.navigationMenu.upsert({
  //     where: {
  //       name_position: {
  //         name: subMenuData.name,
  //         position: subMenuData.position,
  //       },
  //     },
  //     update: { ...subMenuData, updatedBy: admin.id },
  //     create: { ...subMenuData, updatedBy: admin.id },
  //   })
  // }
  // }

  console.log('✅ 创建导航菜单数据')

  // 创建研究数据
  console.log('创建研究数据...')

  const researchData = [
    {
      id: 'cmds8hhb00001sdzwp7guddh1',
      title: '基于深度学习的智能视频分析系统',
      subtitle: 'Deep Learning-based Intelligent Video Analysis System',
      description:
        '本研究提出基于深度学习的智能视频分析系统，通过卷积神经网络和循环神经网络的结合，实现对视频内容的自动识别、分类和异常检测。系统在多个公开数据集上取得了优异的性能表现。',
      category: ResearchCategory.AI_RESEARCH,
      content: `
        <h2>研究背景</h2>
        <p>随着视频监控系统的广泛应用，如何从海量视频数据中自动提取有价值的信息成为了一个重要的研究课题。传统的视频分析方法往往依赖于手工设计的特征，难以适应复杂多变的实际场景。</p>

        <h2>技术方案</h2>
        <p>本研究提出了一种基于深度学习的智能视频分析系统，主要包括以下几个核心模块：</p>
        <ul>
          <li><strong>特征提取模块</strong>：采用3D卷积神经网络提取视频的时空特征</li>
          <li><strong>目标检测模块</strong>：基于YOLO算法实现实时目标检测</li>
          <li><strong>行为识别模块</strong>：利用LSTM网络识别人员行为模式</li>
          <li><strong>异常检测模块</strong>：通过自编码器检测异常事件</li>
        </ul>

        <h2>实验结果</h2>
        <p>在UCF-101、HMDB-51等公开数据集上的实验结果表明，本系统在准确率、召回率和F1分数等指标上均优于现有方法：</p>
        <ul>
          <li>目标检测准确率：95.2%</li>
          <li>行为识别准确率：92.8%</li>
          <li>异常检测准确率：89.5%</li>
        </ul>

        <h2>应用前景</h2>
        <p>该系统可广泛应用于智能安防、智慧城市、工业监控等领域，为视频监控系统的智能化升级提供技术支撑。</p>
      `,
      image: '/images/research/video-analysis.jpg',
      slug: 'intelligent-video-analysis-system',
      status: ResearchStatus.PUBLISHED,
      publishedAt: new Date('2024-03-15'),
      tags: ['深度学习', '视频分析', '计算机视觉', '异常检测'],
      authors: [
        { name: '张伟', title: '首席算法工程师', email: 'zhang.wei@lgjh.com' },
        { name: '李明', title: '高级研发工程师', email: 'li.ming@lgjh.com' },
      ],
      featured: true,
      sortOrder: 1,
      updatedBy: admin.id,
    },
    {
      id: 'cmds8hhb00002sdzwp7guddh2',
      title: '边缘计算在智能安防中的应用研究',
      subtitle: 'Application Research of Edge Computing in Intelligent Security',
      description:
        '针对传统云计算在安防场景中存在的延迟高、带宽占用大等问题，本研究探索了边缘计算技术在智能安防系统中的应用，设计了分布式边缘计算架构。',
      category: ResearchCategory.INNOVATION,
      content: `
        <h2>研究动机</h2>
        <p>传统的云计算架构在处理大规模视频数据时面临诸多挑战：</p>
        <ul>
          <li>网络延迟影响实时性要求</li>
          <li>带宽成本高昂</li>
          <li>数据隐私和安全问题</li>
          <li>网络故障时系统可用性下降</li>
        </ul>

        <h2>技术创新</h2>
        <p>本研究提出了一种分布式边缘计算架构，主要创新点包括：</p>
        <ul>
          <li><strong>智能任务调度</strong>：根据设备性能和网络状况动态分配计算任务</li>
          <li><strong>协同推理</strong>：多个边缘节点协同完成复杂的AI推理任务</li>
          <li><strong>增量学习</strong>：边缘设备可以根据本地数据进行模型优化</li>
          <li><strong>故障容错</strong>：设计了完善的故障检测和恢复机制</li>
        </ul>

        <h2>系统架构</h2>
        <p>系统采用三层架构设计：</p>
        <ul>
          <li><strong>设备层</strong>：摄像头、传感器等数据采集设备</li>
          <li><strong>边缘层</strong>：边缘计算节点，负责数据预处理和AI推理</li>
          <li><strong>云端层</strong>：中央管理平台，负责模型训练和系统监控</li>
        </ul>

        <h2>性能评估</h2>
        <p>与传统云计算方案相比，本系统在多个关键指标上表现优异：</p>
        <ul>
          <li>响应延迟降低70%</li>
          <li>带宽使用减少60%</li>
          <li>系统可用性提升至99.9%</li>
          <li>能耗降低40%</li>
        </ul>
      `,
      image: '/images/research/edge-computing.jpg',
      slug: 'edge-computing-intelligent-security',
      status: ResearchStatus.PUBLISHED,
      publishedAt: new Date('2024-02-20'),
      tags: ['边缘计算', '智能安防', '分布式系统', '实时处理'],
      authors: [
        { name: '王芳', title: '系统架构师', email: 'wang.fang@lgjh.com' },
        { name: '陈强', title: '边缘计算专家', email: 'chen.qiang@lgjh.com' },
      ],
      featured: true,
      sortOrder: 2,
      updatedBy: admin.id,
    },
    {
      id: 'cmds8hhb00003sdzwp7guddh3',
      title: '多模态生物识别技术融合算法',
      subtitle: 'Multi-modal Biometric Recognition Fusion Algorithm',
      description:
        '为提高生物识别系统的准确性和安全性，本研究开发了一种多模态生物识别技术融合算法，结合人脸、指纹、虹膜等多种生物特征，实现更可靠的身份认证。',
      category: ResearchCategory.ACHIEVEMENTS,
      content: `
        <h2>技术背景</h2>
        <p>单一生物识别技术存在以下局限性：</p>
        <ul>
          <li>容易受到环境因素影响</li>
          <li>存在欺骗攻击的风险</li>
          <li>对于某些用户群体识别率较低</li>
          <li>无法满足高安全级别的应用需求</li>
        </ul>

        <h2>算法设计</h2>
        <p>本研究设计了一种层次化的多模态融合算法：</p>
        <ul>
          <li><strong>特征级融合</strong>：在特征提取阶段融合不同模态的特征向量</li>
          <li><strong>分数级融合</strong>：对各个模态的识别分数进行加权融合</li>
          <li><strong>决策级融合</strong>：基于投票机制进行最终决策</li>
          <li><strong>自适应权重</strong>：根据各模态的质量动态调整融合权重</li>
        </ul>

        <h2>关键技术</h2>
        <ul>
          <li><strong>质量评估</strong>：实时评估各生物特征的质量</li>
          <li><strong>活体检测</strong>：防止伪造攻击</li>
          <li><strong>模板保护</strong>：采用可撤销生物特征技术保护用户隐私</li>
          <li><strong>快速匹配</strong>：优化算法提高识别速度</li>
        </ul>

        <h2>实验验证</h2>
        <p>在多个公开数据集上的实验结果显示：</p>
        <ul>
          <li>识别准确率：99.8%</li>
          <li>误识率：0.01%</li>
          <li>拒识率：0.1%</li>
          <li>平均识别时间：0.5秒</li>
        </ul>

        <h2>产业化应用</h2>
        <p>该技术已成功应用于：</p>
        <ul>
          <li>金融机构的身份认证系统</li>
          <li>政府部门的门禁控制系统</li>
          <li>企业的考勤管理系统</li>
          <li>机场的安检系统</li>
        </ul>
      `,
      image: '/images/research/biometric-fusion.jpg',
      slug: 'multimodal-biometric-fusion',
      status: ResearchStatus.PUBLISHED,
      publishedAt: new Date('2024-01-10'),
      tags: ['生物识别', '多模态融合', '身份认证', '安全技术'],
      authors: [
        { name: '刘华', title: '生物识别专家', email: 'liu.hua@lgjh.com' },
        { name: '赵敏', title: '算法工程师', email: 'zhao.min@lgjh.com' },
      ],
      featured: true,
      sortOrder: 3,
      updatedBy: admin.id,
    },
    {
      id: 'cmds8hhb00004sdzwp7guddh4',
      title: '基于区块链的安防数据可信存储机制',
      subtitle: 'Blockchain-based Trusted Storage Mechanism for Security Data',
      description:
        '针对安防数据的完整性和可信性要求，本研究提出了基于区块链技术的安防数据存储机制，确保数据的不可篡改性和可追溯性。',
      category: ResearchCategory.PAPERS,
      content: `
        <h2>研究问题</h2>
        <p>传统安防数据存储面临的挑战：</p>
        <ul>
          <li>数据容易被篡改或删除</li>
          <li>缺乏有效的数据溯源机制</li>
          <li>多方数据共享时信任问题</li>
          <li>数据完整性验证困难</li>
        </ul>

        <h2>解决方案</h2>
        <p>本研究设计了一种基于区块链的安防数据可信存储机制：</p>
        <ul>
          <li><strong>数据哈希上链</strong>：将数据摘要存储在区块链上</li>
          <li><strong>智能合约</strong>：自动化数据访问控制和权限管理</li>
          <li><strong>分布式存储</strong>：结合IPFS实现数据的分布式存储</li>
          <li><strong>零知识证明</strong>：在保护隐私的前提下验证数据完整性</li>
        </ul>

        <h2>系统架构</h2>
        <p>系统采用分层架构设计：</p>
        <ul>
          <li><strong>应用层</strong>：用户接口和业务逻辑</li>
          <li><strong>合约层</strong>：智能合约和业务规则</li>
          <li><strong>区块链层</strong>：共识机制和数据存储</li>
          <li><strong>网络层</strong>：P2P网络和通信协议</li>
        </ul>

        <h2>关键技术</h2>
        <ul>
          <li><strong>Merkle树</strong>：高效的数据完整性验证</li>
          <li><strong>时间戳服务</strong>：确保数据的时序性</li>
          <li><strong>多重签名</strong>：提高系统安全性</li>
          <li><strong>侧链技术</strong>：提升系统性能和扩展性</li>
        </ul>

        <h2>性能分析</h2>
        <p>实验结果表明，本系统具有以下优势：</p>
        <ul>
          <li>数据完整性验证准确率：100%</li>
          <li>系统吞吐量：1000 TPS</li>
          <li>数据检索延迟：<100ms</li>
          <li>存储成本降低30%</li>
        </ul>

        <h2>应用场景</h2>
        <p>该机制可应用于：</p>
        <ul>
          <li>司法取证系统</li>
          <li>监管合规平台</li>
          <li>数据共享联盟</li>
          <li>审计追踪系统</li>
        </ul>
      `,
      image: '/images/research/blockchain-storage.jpg',
      slug: 'blockchain-security-data-storage',
      status: ResearchStatus.PUBLISHED,
      publishedAt: new Date('2023-12-05'),
      tags: ['区块链', '数据存储', '可信计算', '隐私保护'],
      authors: [
        { name: '孙杰', title: '区块链技术专家', email: 'sun.jie@lgjh.com' },
        { name: '周丽', title: '密码学研究员', email: 'zhou.li@lgjh.com' },
      ],
      featured: false,
      sortOrder: 4,
      updatedBy: admin.id,
    },
  ]

  for (const research of researchData) {
    await prisma.research.upsert({
      where: { id: research.id },
      update: { ...research },
      create: research,
    })
  }

  console.log('✅ 创建研究数据')

  // 创建解决方案数据
  console.log('创建解决方案数据...')

  const solutionsData = [
    {
      id: 'solution-smart-park',
      category: '园区管理',
      title: '智慧园区管理解决方案',
      subtitle: '全方位数字化园区管理平台',
      description: `
        <h2>方案概述</h2>
        <p>智慧园区管理解决方案是一套集成化的数字化管理平台，通过物联网、大数据、人工智能等先进技术，为园区提供全方位的智能化管理服务。</p>

        <h2>核心功能</h2>
        <ul>
          <li>智能安防监控系统</li>
          <li>访客管理系统</li>
          <li>车辆管理系统</li>
          <li>能耗监控系统</li>
          <li>设备维护管理</li>
          <li>数据分析平台</li>
        </ul>

        <h2>技术特点</h2>
        <p>采用微服务架构，支持云端部署，具备高可用性和可扩展性。集成AI算法，实现智能预警和自动化管理。</p>
      `,
      features: ['智能安防', '访客管理', '车辆管理', '能耗监控', '设备维护', '数据分析'],
      applications: ['产业园区', '科技园区', '商务园区', '物流园区'],
      metrics: [
        { value: '99.9%', label: '系统可用性' },
        { value: '50%', label: '管理效率提升' },
        { value: '30%', label: '能耗降低' },
      ],
      technologies: ['物联网', '大数据', '人工智能', '云计算'],
      benefits: ['降低运营成本', '提升管理效率', '增强安全性', '优化用户体验'],
      image: '/images/solutions/smart-park.jpg',
      slug: 'smart-park-management',
      gradient: 'from-blue-600 to-cyan-600',
      accentColor: 'blue',
      updatedBy: admin.id,
    },
    {
      id: 'solution-smart-community',
      category: '社区管理',
      title: '智慧社区管理平台',
      subtitle: '打造安全便民的智慧社区',
      description: `
        <h2>方案概述</h2>
        <p>智慧社区管理平台通过整合社区各类资源，为居民提供便民服务，为物业提供高效管理工具，构建和谐智慧社区。</p>

        <h2>主要模块</h2>
        <ul>
          <li>居民服务平台</li>
          <li>物业管理系统</li>
          <li>智能门禁系统</li>
          <li>停车管理系统</li>
          <li>社区商务平台</li>
          <li>应急管理系统</li>
        </ul>
      `,
      features: ['居民服务', '物业管理', '智能门禁', '停车管理', '社区商务', '应急管理'],
      applications: ['住宅社区', '商业社区', '混合社区', '高端社区'],
      metrics: [
        { value: '95%', label: '居民满意度' },
        { value: '40%', label: '物业效率提升' },
        { value: '60%', label: '投诉处理速度提升' },
      ],
      technologies: ['移动互联网', '物联网', '云计算', '大数据'],
      benefits: ['提升居民满意度', '降低物业成本', '增强社区安全', '促进邻里和谐'],
      image: '/images/solutions/smart-community.jpg',
      slug: 'smart-community-management',
      gradient: 'from-green-600 to-teal-600',
      accentColor: 'green',
      updatedBy: admin.id,
    },
    {
      id: 'solution-smart-transport',
      category: '公共交通',
      title: '智慧交通管理系统',
      subtitle: '构建高效便民的智慧交通网络',
      description: `
        <h2>系统介绍</h2>
        <p>智慧交通管理系统通过先进的信息技术，实现交通流量监控、信号优化、出行服务等功能，提升城市交通运行效率。</p>

        <h2>核心功能</h2>
        <ul>
          <li>交通流量监控</li>
          <li>智能信号控制</li>
          <li>公交调度优化</li>
          <li>停车诱导系统</li>
          <li>出行信息服务</li>
          <li>应急指挥调度</li>
        </ul>
      `,
      features: ['流量监控', '信号控制', '公交调度', '停车诱导', '出行服务', '应急指挥'],
      applications: ['城市道路', '高速公路', '公交系统', '停车场'],
      metrics: [
        { value: '25%', label: '通行效率提升' },
        { value: '20%', label: '拥堵时间减少' },
        { value: '15%', label: '能耗降低' },
      ],
      technologies: ['视频识别', '大数据分析', '云计算', '5G通信'],
      benefits: ['缓解交通拥堵', '提升出行体验', '降低环境污染', '增强交通安全'],
      image: '/images/solutions/smart-transport.jpg',
      slug: 'smart-transport-management',
      gradient: 'from-purple-600 to-pink-600',
      accentColor: 'purple',
      updatedBy: admin.id,
    },
  ]

  for (const solution of solutionsData) {
    await prisma.solution.upsert({
      where: { id: solution.id },
      update: { ...solution },
      create: solution,
    })
  }

  console.log('✅ 创建解决方案数据')

  // 创建公司动态模块数据
  console.log('创建公司动态模块数据...')

  // 首先创建或更新公司动态模块
  const companyNewsModule = await prisma.missionModule.upsert({
    where: { category: 'company-news' },
    update: {},
    create: {
      id: 'cmdqxt3hy000fsd744b7w2jzx',
      category: 'company-news',
      title: '公司动态',
      subtitle: '企业发展与新闻资讯',
      description: '展示公司最新发展动态、产品发布、合作签约等重要新闻，让您及时了解企业发展历程。',
      icon: 'Newspaper',
      image: '/images/mission/company-news.jpg',
      highlights: JSON.stringify(['产品发布资讯', '企业发展动态', '合作签约新闻', '荣誉奖项公告']),
      features: JSON.stringify([
        '及时发布企业动态',
        '展示产品创新成果',
        '分享合作伙伴关系',
        '传播企业文化价值',
        '提升品牌影响力',
        '增强客户信任度',
      ]),
      achievements: JSON.stringify([
        { value: '100+', label: '新闻发布' },
        { value: '50+', label: '媒体报道' },
        { value: '20+', label: '行业奖项' },
      ]),
      gradient: 'from-orange-600 to-red-600',
      accentColor: 'orange',
      href: '/mission/company-news',
      status: 'active',
      sortOrder: 4,
      updatedBy: admin.id,
    },
  })

  // 创建示例公司动态数据
  const companyNewsItems = [
    {
      id: 'news-product-launch-2024',
      moduleId: companyNewsModule.id,
      title: '新一代智能安防产品正式发布',
      description: '公司最新研发的智能安防产品正式发布，集成了最新的AI技术和物联网技术。',
      content: `
        <h2>产品发布</h2>
        <p>经过两年的精心研发，我们的新一代智能安防产品今日正式发布。该产品集成了最新的人工智能算法、边缘计算技术和物联网通信协议，能够提供更加智能、高效、可靠的安防解决方案。</p>

        <h2>技术亮点</h2>
        <ul>
          <li>AI智能识别：支持人脸、车牌、行为等多种识别功能</li>
          <li>边缘计算：本地处理，降低延迟，提升响应速度</li>
          <li>物联网集成：无缝连接各类传感器和设备</li>
          <li>云端管理：统一的云端管理平台，支持远程监控</li>
        </ul>

        <h2>市场反响</h2>
        <p>产品发布会吸引了来自全国各地的合作伙伴和客户代表，获得了广泛好评。多家知名企业表达了合作意向，预计将为公司带来新的增长机遇。</p>
      `,
      summary: '公司最新研发的智能安防产品正式发布，集成了最新的AI技术和物联网技术。',
      image: '/images/news/product-launch-2024.jpg',
      date: new Date('2024-03-15'),
      tags: JSON.stringify(['产品发布', 'AI技术', '物联网']),
      category: '产品发布',
      status: 'published',
      featured: true,
      sortOrder: 1,
      metadata: JSON.stringify({
        author: '市场部',
        readTime: '3分钟',
        views: 0,
      }),
      authorId: admin.id,
    },
    {
      id: 'news-cooperation-signing-2024',
      moduleId: companyNewsModule.id,
      title: '与华为签署战略合作协议',
      description: '公司与华为技术有限公司正式签署战略合作协议，将在智能安防领域开展深度合作。',
      content: `
        <h2>合作签约</h2>
        <p>2024年2月20日，临港景鸿与华为技术有限公司在上海正式签署战略合作协议。双方将在智能安防、云计算、5G通信等领域开展全面合作。</p>

        <h2>合作内容</h2>
        <ul>
          <li>技术研发：共同开发下一代智能安防解决方案</li>
          <li>市场拓展：联合开拓国内外安防市场</li>
          <li>人才培养：建立联合培训和认证体系</li>
          <li>标准制定：参与行业标准和规范制定</li>
        </ul>

        <h2>合作意义</h2>
        <p>此次合作将充分发挥双方的技术优势和市场资源，推动智能安防行业的技术创新和产业升级，为客户提供更优质的产品和服务。</p>
      `,
      summary: '公司与华为技术有限公司正式签署战略合作协议，将在智能安防领域开展深度合作。',
      image: '/images/news/huawei-cooperation.jpg',
      date: new Date('2024-02-20'),
      tags: JSON.stringify(['合作签约', '华为', '战略合作']),
      category: '合作签约',
      status: 'published',
      featured: true,
      sortOrder: 2,
      metadata: JSON.stringify({
        author: '商务部',
        readTime: '4分钟',
        views: 0,
      }),
      authorId: admin.id,
    },
    {
      id: 'news-award-2024',
      moduleId: companyNewsModule.id,
      title: '荣获"2024年度最佳创新企业"奖项',
      description: '公司在2024年度安防行业评选中荣获"最佳创新企业"奖项，技术创新能力获得行业认可。',
      content: `
        <h2>获奖消息</h2>
        <p>在刚刚结束的2024年度中国安防行业大会上，临港景鸿凭借在智能安防领域的技术创新和产品优势，荣获"2024年度最佳创新企业"奖项。</p>

        <h2>创新成果</h2>
        <ul>
          <li>AI算法创新：自主研发的智能识别算法达到行业领先水平</li>
          <li>产品创新：推出多款具有自主知识产权的安防产品</li>
          <li>应用创新：在多个行业场景中实现技术突破</li>
          <li>服务创新：建立完善的客户服务和技术支持体系</li>
        </ul>

        <h2>未来展望</h2>
        <p>此次获奖是对公司技术创新能力的充分肯定。我们将继续加大研发投入，推动技术创新，为客户提供更优质的产品和服务。</p>
      `,
      summary: '公司在2024年度安防行业评选中荣获"最佳创新企业"奖项，技术创新能力获得行业认可。',
      image: '/images/news/innovation-award-2024.jpg',
      date: new Date('2024-01-10'),
      tags: JSON.stringify(['荣誉奖项', '创新企业', '行业认可']),
      category: '荣誉奖项',
      status: 'published',
      featured: true,
      sortOrder: 3,
      metadata: JSON.stringify({
        author: '企业发展部',
        readTime: '3分钟',
        views: 0,
      }),
      authorId: admin.id,
    },
  ]

  for (const item of companyNewsItems) {
    await prisma.missionItem.upsert({
      where: { id: item.id },
      update: { ...item },
      create: item,
    })
  }

  console.log('✅ 创建公司动态数据')

  // 注释：media模型已被移除，跳过媒体数据创建
  // 注释：media模型已被移除，跳过媒体数据创建
  // console.log('创建示例媒体数据...')
  // await prisma.media.createMany({
  //   data: [
  //     {
  //       filename: 'hero-bg-1.jpg',
  //       originalName: 'hero-background-1.jpg',
  //       mimeType: 'image/jpeg',
  //       fileSize: 1024000,
  //       url: '/images/hero/hero-bg-1.jpg',
  //       altText: '企业服务背景图片1',
  //       metadata: {
  //         width: 1920,
  //         height: 1080,
  //         category: 'background'
  //       },
  //       uploadedBy: admin.id
  //     },
  //     {
  //       filename: 'hero-bg-2.jpg',
  //       originalName: 'hero-background-2.jpg',
  //       mimeType: 'image/jpeg',
  //       fileSize: 1200000,
  //       url: '/images/hero/hero-bg-2.jpg',
  //       altText: '企业服务背景图片2',
  //       metadata: {
  //         width: 1920,
  //         height: 1080,
  //         category: 'background'
  //       },
  //       uploadedBy: admin.id
  //     },
  //     {
  //       filename: 'service-bg-1.jpg',
  //       originalName: 'service-background-1.jpg',
  //       mimeType: 'image/jpeg',
  //       fileSize: 800000,
  //       url: '/images/services/service-bg-1.jpg',
  //       altText: '服务页面背景图片1',
  //       metadata: {
  //         width: 1600,
  //         height: 900,
  //         category: 'service'
  //       },
  //       uploadedBy: admin.id
  //     },
  //     {
  //       filename: 'service-bg-2.jpg',
  //       originalName: 'service-background-2.jpg',
  //       mimeType: 'image/jpeg',
  //       fileSize: 850000,
  //       url: '/images/services/service-bg-2.jpg',
  //       altText: '服务页面背景图片2',
  //       metadata: {
  //         width: 1600,
  //         height: 900,
  //         category: 'service'
  //       },
  //       uploadedBy: admin.id
  //     },
  //     {
  //       filename: 'about-bg.jpg',
  //       originalName: 'about-background.jpg',
  //       mimeType: 'image/jpeg',
  //       fileSize: 900000,
  //       url: '/images/about/about-bg.jpg',
  //       altText: '关于我们背景图片',
  //       metadata: {
  //         width: 1600,
  //         height: 900,
  //         category: 'about'
  //       },
  //       uploadedBy: admin.id
  //     }
  //   ]
  // })
  // console.log('✅ 创建示例媒体数据')

  console.log('🎉 数据库初始化完成!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async e => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
