/**
 * 产教融合数据种子文件
 * 为新的文章式管理系统创建示例数据
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 开始初始化产教融合数据...\n')

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

    // 1. 确保产教融合模块存在
    console.log('📚 创建/更新产教融合模块...')
    const module = await prisma.missionModule.upsert({
      where: { category: 'industry-education' },
      update: {
        title: '产教融合',
        subtitle: '产学研合作与人才培养',
        description: '深化产教融合，校企合作，建立产学研一体化平台，培养高素质技术技能人才。',
        icon: 'Target',
        image: '/images/mission/industry-education.jpg',
        status: 'active',
        sortOrder: 3,
        updatedBy: admin.id,
      },
      create: {
        category: 'industry-education',
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
        href: '/mission/education-integration',
        status: 'active',
        sortOrder: 3,
        updatedBy: admin.id,
      },
    })

    console.log(`✅ 产教融合模块: ${module.title}`)

    // 2. 创建合作概况内容
    console.log('📝 创建合作概况内容...')
    await prisma.missionItem.upsert({
      where: { id: 'education-overview-001' },
      update: {
        title: '产教融合合作概况',
        description: '深化产教融合，校企合作，建立产学研一体化平台',
        content: `
          <h2>合作理念</h2>
          <p>我们秉承"产教融合、校企合作、协同育人"的理念，坚持以市场需求为导向，以技术创新为驱动，以人才培养为核心，构建产学研深度融合的合作生态。通过整合企业资源和高校优势，实现教育链、人才链与产业链、创新链的有机衔接。</p>

          <h2>合作模式</h2>
          <p>我们采用多元化的合作模式，包括联合培养、科研合作、师资交流、实习实训、技术转化等多种形式。通过建立校企合作基地、产学研协同创新中心等平台，为学生提供真实的工作环境和项目实践机会，为教师提供企业实践和技术研发平台。</p>

          <h2>合作成效</h2>
          <p>经过几年的深度合作，我们在产教融合方面取得了显著成效。截至目前，已累计培养各类专业技术人才300+名，其中包括本科生、硕士研究生、博士研究生等不同层次的人才。这些人才在毕业后大多进入金融科技、网络安全、数据分析等相关行业，就业率达到95%以上，为行业发展提供了有力的人才支撑。</p>

          <p>在科研合作方面，我们与合作院校共同承担了15个重要科研项目，其中包括国家级项目、省部级项目以及企业自主研发项目。这些项目不仅推动了前沿技术的发展，也为学生提供了宝贵的实践机会，实现了理论与实践的有机结合。</p>
        `,
        category: 'cooperation-overview',
        status: 'published',
        sortOrder: 1,
        authorId: admin.id,
      },
      create: {
        id: 'education-overview-001',
        moduleId: module.id,
        title: '产教融合合作概况',
        description: '深化产教融合，校企合作，建立产学研一体化平台',
        content: `
          <h2>合作理念</h2>
          <p>我们秉承"产教融合、校企合作、协同育人"的理念，坚持以市场需求为导向，以技术创新为驱动，以人才培养为核心，构建产学研深度融合的合作生态。通过整合企业资源和高校优势，实现教育链、人才链与产业链、创新链的有机衔接。</p>

          <h2>合作模式</h2>
          <p>我们采用多元化的合作模式，包括联合培养、科研合作、师资交流、实习实训、技术转化等多种形式。通过建立校企合作基地、产学研协同创新中心等平台，为学生提供真实的工作环境和项目实践机会，为教师提供企业实践和技术研发平台。</p>

          <h2>合作成效</h2>
          <p>经过几年的深度合作，我们在产教融合方面取得了显著成效。截至目前，已累计培养各类专业技术人才300+名，其中包括本科生、硕士研究生、博士研究生等不同层次的人才。这些人才在毕业后大多进入金融科技、网络安全、数据分析等相关行业，就业率达到95%以上，为行业发展提供了有力的人才支撑。</p>

          <p>在科研合作方面，我们与合作院校共同承担了15个重要科研项目，其中包括国家级项目、省部级项目以及企业自主研发项目。这些项目不仅推动了前沿技术的发展，也为学生提供了宝贵的实践机会，实现了理论与实践的有机结合。</p>
        `,
        category: 'cooperation-overview',
        status: 'published',
        sortOrder: 1,
        authorId: admin.id,
      },
    })

    console.log('✅ 合作概况内容已创建')

    // 3. 创建合作院校数据
    console.log('🏫 创建合作院校数据...')
    const universities = [
      {
        id: 'university-tsinghua',
        title: '清华大学',
        description: '在网络安全和人工智能领域开展深度合作，共建网络安全联合实验室',
        field: '网络安全',
        timeline: '2020年至今',
        contact: '张教授 - zhang@tsinghua.edu.cn',
        projects: ['网络安全联合实验室', 'AI安全防护技术研究', '态势感知系统开发'],
        achievements: ['培养硕博研究生50余名', '发表高水平论文20余篇', '申请专利10项'],
        content: `
          <h2>合作概况</h2>
          <p>与清华大学在网络安全和人工智能领域开展深度合作，共建网络安全联合实验室，承担国家重点研发项目。合作重点包括网络空间安全态势感知、AI安全防护技术等前沿领域。</p>

          <h2>主要合作项目</h2>
          <ul>
            <li><strong>网络安全联合实验室</strong>：共同建设网络安全技术研发平台</li>
            <li><strong>AI安全防护技术研究</strong>：开展人工智能安全防护关键技术攻关</li>
            <li><strong>态势感知系统开发</strong>：研发新一代网络安全态势感知系统</li>
          </ul>

          <h2>合作成果</h2>
          <p>通过深度合作，双方在网络安全领域取得了丰硕成果。累计培养硕博研究生50余名，发表高水平学术论文20余篇，申请发明专利10项，为国家网络安全事业发展做出了重要贡献。</p>
        `,
        featured: true,
      },
      {
        id: 'university-bit',
        title: '北京理工大学',
        description: '与北京理工大学合作建立金融科技人才培养基地，专注于金融科技和数据分析领域',
        field: '金融科技',
        timeline: '2021年至今',
        contact: '李教授 - li@bit.edu.cn',
        projects: ['金融科技人才培养基地', '量化交易系统研发', '风控模型优化'],
        achievements: ['培养本科生100余名', '完成科研项目8项', '获得软件著作权5项'],
        content: `
          <h2>合作概况</h2>
          <p>与北京理工大学合作建立金融科技人才培养基地，专注于金融科技和数据分析领域的人才培养。通过校企联合培养模式，为金融行业输送了大批高素质专业人才。</p>

          <h2>主要合作项目</h2>
          <ul>
            <li><strong>金融科技人才培养基地</strong>：建立产教融合人才培养平台</li>
            <li><strong>量化交易系统研发</strong>：开发智能化量化交易系统</li>
            <li><strong>风控模型优化</strong>：研究金融风险控制算法模型</li>
          </ul>

          <h2>合作成果</h2>
          <p>合作以来，累计培养金融科技专业本科生100余名，完成相关科研项目8项，获得软件著作权5项。学生就业率达到98%，深受用人单位好评。</p>
        `,
        featured: true,
      },
      {
        id: 'university-ncepu',
        title: '华北电力大学',
        description: '围绕能源安全和工业互联网安全开展合作，重点关注能源互联网安全态势感知',
        field: '能源安全',
        timeline: '2022年至今',
        contact: '王教授 - wang@ncepu.edu.cn',
        projects: ['能源互联网安全研究', '工业控制系统安全', '智能电网安全防护'],
        achievements: ['建立联合研究中心', '培养研究生30余名', '承担国家项目3项'],
        content: `
          <h2>合作概况</h2>
          <p>围绕能源安全和工业互联网安全开展合作，重点关注能源互联网安全态势感知、工业控制系统安全防护等关键技术领域，为国家能源安全提供技术保障。</p>

          <h2>主要合作项目</h2>
          <ul>
            <li><strong>能源互联网安全研究</strong>：开展能源互联网安全关键技术研究</li>
            <li><strong>工业控制系统安全</strong>：研发工业控制系统安全防护技术</li>
            <li><strong>智能电网安全防护</strong>：构建智能电网安全防护体系</li>
          </ul>

          <h2>合作成果</h2>
          <p>双方建立了能源安全联合研究中心，培养相关专业研究生30余名，承担国家级科研项目3项，为保障国家能源安全做出了积极贡献。</p>
        `,
        featured: false,
      },
    ]

    for (const university of universities) {
      await prisma.missionItem.upsert({
        where: { id: university.id },
        update: {
          title: university.title,
          description: university.description,
          content: university.content,
          category: 'university',
          status: 'published',
          featured: university.featured,
          metadata: JSON.stringify({
            field: university.field,
            timeline: university.timeline,
            contact: university.contact,
            projects: university.projects,
            achievements: university.achievements,
          }),
          tags: JSON.stringify([university.field, '产教融合', '人才培养']),
          authorId: admin.id,
        },
        create: {
          id: university.id,
          moduleId: module.id,
          title: university.title,
          description: university.description,
          content: university.content,
          category: 'university',
          status: 'published',
          featured: university.featured,
          sortOrder: universities.indexOf(university) + 1,
          metadata: JSON.stringify({
            field: university.field,
            timeline: university.timeline,
            contact: university.contact,
            projects: university.projects,
            achievements: university.achievements,
          }),
          tags: JSON.stringify([university.field, '产教融合', '人才培养']),
          authorId: admin.id,
        },
      })
    }

    console.log(`✅ 已创建 ${universities.length} 所合作院校`)

    // 4. 创建成功案例数据
    console.log('🏆 创建成功案例数据...')
    const successCases = [
      {
        id: 'case-smart-manufacturing',
        title: '智能制造产教融合基地建设',
        description: '与上海工程技术大学共建智能制造产教融合基地，培养智能制造领域高技能人才',
        partner: '上海工程技术大学',
        year: '2023',
        category: '基地建设',
        content: `
          <h2>项目背景</h2>
          <p>随着智能制造技术的快速发展，行业对高技能人才的需求日益增长。为了培养适应智能制造发展需要的专业人才，我们与上海工程技术大学合作建设智能制造产教融合基地。</p>

          <h2>建设内容</h2>
          <ul>
            <li><strong>实训设备投入</strong>：投资500万元建设智能制造实训车间</li>
            <li><strong>课程体系开发</strong>：联合开发智能制造专业课程体系</li>
            <li><strong>师资队伍建设</strong>：选派工程师担任兼职教师</li>
            <li><strong>学生实习实训</strong>：每年接收200名学生实习实训</li>
          </ul>

          <h2>项目成果</h2>
          <p>基地建成以来，累计培养智能制造专业人才300余名，学生就业率达到100%，获得企业高度认可。基地被评为省级产教融合示范基地。</p>
        `,
        featured: true,
      },
      {
        id: 'case-fintech-talent',
        title: '金融科技人才联合培养项目',
        description: '与中央财经大学开展金融科技人才联合培养，建立校企合作新模式',
        partner: '中央财经大学',
        year: '2022',
        category: '人才培养',
        content: `
          <h2>项目概述</h2>
          <p>金融科技人才联合培养项目是我们与中央财经大学合作开展的创新性人才培养模式。通过"2+2"联合培养方式，学生前两年在学校学习理论知识，后两年在企业进行实践训练。</p>

          <h2>培养模式</h2>
          <ul>
            <li><strong>理论学习阶段</strong>：在校学习金融学、计算机科学基础课程</li>
            <li><strong>实践训练阶段</strong>：在企业参与真实项目开发</li>
            <li><strong>导师制指导</strong>：配备校内导师和企业导师</li>
            <li><strong>项目驱动学习</strong>：以实际项目为载体进行学习</li>
          </ul>

          <h2>培养成果</h2>
          <p>项目实施两年来，已培养金融科技专业人才80余名，学生综合能力显著提升，就业竞争力明显增强，用人单位满意度达到95%以上。</p>
        `,
        featured: true,
      },
      {
        id: 'case-research-cooperation',
        title: '产学研协同创新项目',
        description: '与北京邮电大学合作开展5G安全技术研究，取得重要技术突破',
        partner: '北京邮电大学',
        year: '2024',
        category: '科研合作',
        content: `
          <h2>项目背景</h2>
          <p>5G技术的快速发展带来了新的安全挑战。为了解决5G网络安全关键技术问题，我们与北京邮电大学合作开展5G安全技术研究项目。</p>

          <h2>研究内容</h2>
          <ul>
            <li><strong>5G网络安全架构设计</strong>：研究5G网络安全体系架构</li>
            <li><strong>移动通信加密算法</strong>：开发新一代移动通信加密算法</li>
            <li><strong>安全标准制定</strong>：参与5G安全国际标准制定</li>
            <li><strong>安全产品开发</strong>：研发5G安全防护产品</li>
          </ul>

          <h2>项目成果</h2>
          <p>项目取得了重要技术突破，申请发明专利8项，发表高水平论文12篇，参与制定5G安全标准3项，为5G网络安全发展做出了重要贡献。</p>
        `,
        featured: false,
      },
    ]

    for (const case_ of successCases) {
      await prisma.missionItem.upsert({
        where: { id: case_.id },
        update: {
          title: case_.title,
          description: case_.description,
          content: case_.content,
          category: 'success-case',
          status: 'published',
          featured: case_.featured,
          metadata: JSON.stringify({
            partner: case_.partner,
            year: case_.year,
            category: case_.category,
          }),
          tags: JSON.stringify([case_.category, '产教融合', '成功案例']),
          authorId: admin.id,
        },
        create: {
          id: case_.id,
          moduleId: module.id,
          title: case_.title,
          description: case_.description,
          content: case_.content,
          category: 'success-case',
          status: 'published',
          featured: case_.featured,
          sortOrder: successCases.indexOf(case_) + 1,
          metadata: JSON.stringify({
            partner: case_.partner,
            year: case_.year,
            category: case_.category,
          }),
          tags: JSON.stringify([case_.category, '产教融合', '成功案例']),
          authorId: admin.id,
        },
      })
    }

    console.log(`✅ 已创建 ${successCases.length} 个成功案例`)

    console.log('\n🎉 产教融合数据初始化完成！')
    console.log('📊 数据统计:')
    console.log(`   - 合作概况: 1 篇`)
    console.log(`   - 合作院校: ${universities.length} 所`)
    console.log(`   - 成功案例: ${successCases.length} 个`)
  } catch (error) {
    console.error('❌ 初始化产教融合数据失败:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch(e => {
  console.error(e)
  process.exit(1)
})
