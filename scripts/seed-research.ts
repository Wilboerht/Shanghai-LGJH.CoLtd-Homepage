/**
 * 研究数据种子文件
 * 专门用于初始化研究数据
 */

import { PrismaClient, ResearchCategory, ResearchStatus } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('开始初始化研究数据...')

  // 获取管理员用户
  const admin = await prisma.user.findUnique({
    where: { email: 'admin@lgjh.com' },
  })

  if (!admin) {
    console.error('❌ 未找到管理员用户，请先运行主种子文件')
    return
  }

  // 创建研究数据
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
  ]

  for (const research of researchData) {
    await prisma.research.upsert({
      where: { id: research.id },
      update: { ...research },
      create: research,
    })
  }

  console.log('✅ 创建研究数据完成')
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
