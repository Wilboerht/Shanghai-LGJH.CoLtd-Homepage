'use client'

import React, { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface SecurityNode {
  id: string
  name: string
  description: string
  color: string
  icon: string
  x?: number
  y?: number
  fx?: number | null
  fy?: number | null
}

interface SecurityLink {
  source: string
  target: string
}

const securityData: SecurityNode[] = [
  // 中心节点
  {
    id: 'center',
    name: '四防合一',
    description: '全方位安全防护体系',
    color: '#6366f1',
    icon: '🛡️',
  },

  // 消防系统
  {
    id: 'fire',
    name: '消防',
    description: '消防安全防护系统',
    color: '#ef4444',
    icon: '🔥',
  },
  {
    id: 'fire-detection',
    name: '火灾探测',
    description: '烟感、温感、火焰探测',
    color: '#f87171',
    icon: '🚨',
  },
  {
    id: 'fire-alarm',
    name: '报警系统',
    description: '声光报警、广播疏散',
    color: '#fca5a5',
    icon: '📢',
  },
  {
    id: 'fire-suppression',
    name: '灭火系统',
    description: '喷淋、气体、泡沫灭火',
    color: '#fecaca',
    icon: '🚿',
  },

  // 技防系统
  {
    id: 'tech',
    name: '技防',
    description: '技术防范监控系统',
    color: '#3b82f6',
    icon: '📹',
  },
  {
    id: 'video-surveillance',
    name: '视频监控',
    description: '高清摄像、智能分析',
    color: '#60a5fa',
    icon: '📷',
  },
  {
    id: 'access-control',
    name: '门禁系统',
    description: '刷卡、指纹、人脸识别',
    color: '#93c5fd',
    icon: '🚪',
  },
  {
    id: 'perimeter-protection',
    name: '周界防护',
    description: '红外对射、电子围栏',
    color: '#bfdbfe',
    icon: '🚧',
  },

  // 人防系统
  {
    id: 'human',
    name: '人防',
    description: '人员防护管理体系',
    color: '#10b981',
    icon: '👥',
  },
  {
    id: 'security-patrol',
    name: '安保巡逻',
    description: '定点值守、巡逻检查',
    color: '#34d399',
    icon: '👮',
  },
  {
    id: 'emergency-response',
    name: '应急响应',
    description: '事故处理、紧急疏散',
    color: '#6ee7b7',
    icon: '🚑',
  },
  {
    id: 'training-drill',
    name: '培训演练',
    description: '安全培训、应急演练',
    color: '#9decb7',
    icon: '📚',
  },

  // 智防系统
  {
    id: 'smart',
    name: '智防',
    description: '智能防护AI系统',
    color: '#8b5cf6',
    icon: '🧠',
  },
  {
    id: 'ai-analysis',
    name: 'AI分析',
    description: '行为分析、异常检测',
    color: '#a78bfa',
    icon: '🤖',
  },
  {
    id: 'iot-sensors',
    name: 'IoT传感',
    description: '环境监测、设备状态',
    color: '#c4b5fd',
    icon: '📡',
  },
  {
    id: 'data-platform',
    name: '数据平台',
    description: '大数据分析、预警预测',
    color: '#ddd6fe',
    icon: '📊',
  },
]

const links: SecurityLink[] = [
  // 中心到四防主类
  { source: 'center', target: 'fire' },
  { source: 'center', target: 'tech' },
  { source: 'center', target: 'human' },
  { source: 'center', target: 'smart' },

  // 四防主类之间的连接
  { source: 'fire', target: 'tech' },
  { source: 'tech', target: 'human' },
  { source: 'human', target: 'smart' },
  { source: 'smart', target: 'fire' },

  // 消防子类连接
  { source: 'fire', target: 'fire-detection' },
  { source: 'fire', target: 'fire-alarm' },
  { source: 'fire', target: 'fire-suppression' },

  // 技防子类连接
  { source: 'tech', target: 'video-surveillance' },
  { source: 'tech', target: 'access-control' },
  { source: 'tech', target: 'perimeter-protection' },

  // 人防子类连接
  { source: 'human', target: 'security-patrol' },
  { source: 'human', target: 'emergency-response' },
  { source: 'human', target: 'training-drill' },

  // 智防子类连接
  { source: 'smart', target: 'ai-analysis' },
  { source: 'smart', target: 'iot-sensors' },
  { source: 'smart', target: 'data-platform' },

  // 跨系统协作连接
  { source: 'fire-detection', target: 'ai-analysis' },
  { source: 'video-surveillance', target: 'ai-analysis' },
  { source: 'emergency-response', target: 'fire-alarm' },
  { source: 'security-patrol', target: 'video-surveillance' },
  { source: 'iot-sensors', target: 'fire-detection' },
]

export function D3SecuritySystem() {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)

    // 清除之前的内容
    svg.selectAll('*').remove()

    // 获取容器尺寸（使用屏幕宽度）
    const containerRect = container.getBoundingClientRect()
    const width = containerRect.width || window.innerWidth
    const height = 500

    // 定义边界边距（非常保守的设置）
    const margin = 50 // 大幅增加基础边距
    const textOffsetY = 20 // 文字在圆点下方的偏移量
    const textHeight = 15 // 文字高度估算
    const textWidth = 60 // 大幅增加文字宽度估算
    const totalBottomSpace = textOffsetY + textHeight + 20 // 底部需要的总空间，大幅增加安全边距

    // 定义节点半径函数（适中大小的圆点）
    const nodeRadius = (d: any) => {
      if (d.id === 'center') return 12
      return 8
    }

    svg.attr('width', width).attr('height', height)

    // 不需要复杂的滤镜，保持简洁

    // 创建极简力导向图
    const simulation = d3
      .forceSimulation(securityData as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => {
            // 主类到中心的距离更远，子类到主类的距离较近
            if (d.source.id === 'center' || d.target.id === 'center') return 100
            if (
              ['fire', 'tech', 'human', 'smart'].includes(d.source.id) &&
              ['fire', 'tech', 'human', 'smart'].includes(d.target.id)
            )
              return 120
            return 60 // 主类到子类的距离
          })
      )
      .force(
        'charge',
        d3.forceManyBody().strength((d: any) => {
          // 更小的斥力，适应小圆点
          if (d.id === 'center') return -800
          if (['fire', 'tech', 'human', 'smart'].includes(d.id)) return -400
          return -200 // 子类节点斥力较小
        })
      )
      .force('center', d3.forceCenter(width / 2, (height - textHeight) / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => {
          // 增大碰撞半径防止文字重叠（适应更大圆点）
          if (d.id === 'center') return 40
          if (['fire', 'tech', 'human', 'smart'].includes(d.id)) return 35
          return 30
        })
      )
      // 添加边界约束力（确保文字完全可见）
      .force('boundary', () => {
        securityData.forEach((d: any) => {
          // 限制X轴边界（考虑文字宽度）
          d.x = Math.max(margin + textWidth, Math.min(width - margin - textWidth, d.x))
          // 限制Y轴边界（考虑文字在圆点下方的位置）
          d.y = Math.max(margin + 10, Math.min(height - margin - totalBottomSpace, d.y))
        })
      })

    // 固定中心节点
    const centerNode = securityData.find(d => d.id === 'center')
    if (centerNode) {
      centerNode.fx = width / 2
      centerNode.fy = height / 2
    }

    // 创建极简的连接线
    const link = svg
      .append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#e5e7eb')
      .attr('stroke-width', 0.5)
      .style('opacity', 0.4)

    // 创建节点组
    const node = svg
      .append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(securityData)
      .enter()
      .append('g')
      .attr('class', 'node')
      .style('cursor', 'pointer')

    // 添加适中大小的圆点
    node
      .append('circle')
      .attr('r', (d: any) => {
        if (d.id === 'center') return 12
        return 8
      })
      .attr('fill', (d: any) => {
        if (d.id === 'center') return '#3b82f6'
        return d.color
      })
      .attr('stroke', 'none')

    // 添加清晰的文字标签
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', (d: any) => (d.id === 'center' ? '25px' : '22px'))
      .style('font-size', (d: any) => (d.id === 'center' ? '14px' : '12px'))
      .style('font-weight', '500')
      .style('fill', '#374151')
      .style('font-family', 'system-ui, -apple-system, sans-serif')
      .text((d: any) => d.name)

    // 添加清晰的交互效果
    node
      .on('mouseover', function (event, d: any) {
        const originalRadius = d.id === 'center' ? 12 : 8

        d3.select(this)
          .select('circle')
          .transition()
          .duration(150)
          .attr('r', originalRadius + 3)

        // 高亮相关连接线
        link
          .transition()
          .duration(150)
          .style('opacity', (l: any) => (l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.1))
      })
      .on('mouseout', function (event, d: any) {
        const originalRadius = d.id === 'center' ? 12 : 8

        d3.select(this).select('circle').transition().duration(150).attr('r', originalRadius)

        // 恢复连接线
        link.transition().duration(150).style('opacity', 0.4)
      })

    // 添加拖拽功能（带边界限制）
    const drag = d3
      .drag<any, any>()
      .on('start', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x
        d.fy = d.y
      })
      .on('drag', (event, d: any) => {
        if (d.id !== 'center') {
          // 中心节点不可拖拽
          // 限制拖拽边界（确保文字完全可见）
          const constrainedX = Math.max(
            margin + textWidth,
            Math.min(width - margin - textWidth, event.x)
          )
          const constrainedY = Math.max(
            margin + 10,
            Math.min(height - margin - totalBottomSpace, event.y)
          )

          d.fx = constrainedX
          d.fy = constrainedY
        }
      })
      .on('end', (event, d: any) => {
        if (!event.active) simulation.alphaTarget(0)
        if (d.id !== 'center') {
          d.fx = null
          d.fy = null
        }
      })

    node.call(drag)

    // 更新位置
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y)

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`)
    })

    // 添加连接线动画
    const animateLinks = () => {
      link
        .attr('stroke-dashoffset', 0)
        .transition()
        .duration(3000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', -20)
        .on('end', animateLinks)
    }

    animateLinks()

    // 响应式处理
    const handleResize = () => {
      const newRect = container.getBoundingClientRect()
      const newWidth = newRect.width || window.innerWidth
      const newHeight = 500

      svg.attr('width', newWidth).attr('height', newHeight)

      // 更新边界约束力
      simulation
        .force('center', d3.forceCenter(newWidth / 2, newHeight / 2))
        .force('boundary', () => {
          securityData.forEach((d: any) => {
            // 限制X轴边界（考虑文字宽度）
            d.x = Math.max(margin + textWidth, Math.min(newWidth - margin - textWidth, d.x))
            // 限制Y轴边界（考虑文字在圆点下方的位置）
            d.y = Math.max(margin + 10, Math.min(newHeight - margin - totalBottomSpace, d.y))
          })
        })
        .alpha(0.3)
        .restart()

      if (centerNode) {
        centerNode.fx = newWidth / 2
        centerNode.fy = newHeight / 2
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      simulation.stop()
    }
  }, [])

  return (
    <div ref={containerRef} className='h-[500px] w-full overflow-hidden p-8'>
      <svg ref={svgRef} className='h-full w-full' />
    </div>
  )
}
