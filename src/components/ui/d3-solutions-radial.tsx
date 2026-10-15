'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
// Lucide icons removed as not needed for this component

interface Solution {
  id: string
  title: string
  description: string
  category: string
}

interface D3SolutionsRadialProps {
  solutions: Solution[]
  width?: number
  height?: number
  className?: string
  logoUrl?: string
}

export default function D3SolutionsRadial({
  solutions,
  width = 800,
  height = 600,
  className = '',
  logoUrl,
}: D3SolutionsRadialProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [hoveredSolution, setHoveredSolution] = useState<Solution | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0, isRightSide: true })
  const router = useRouter()

  // Icon path mapping for nodes 1-10 using Lucide icons
  const getIconPath = useCallback((index: number): string => {
    const iconPaths = {
      1: 'M9 12l2 2 4-4 M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z', // CheckCircle - 机器智能管理技术方案
      2: 'M8 2v4l-3 3h18l-3-3V2H8z M4 9v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9H4z', // Monitor - VR体验馆管理方案
      3: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10', // Home - 住宅安全一体方案
      4: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z', // Flame - 化工消防安全方案
      5: 'M9 12l2 2 4-4 M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z', // CheckCircle - 智慧社区交防方案
      6: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6zM6 12h4M14 12h4M6 20h4M14 20h4M6 8h4M14 8h4', // Building2 - 智慧公寓管理方案
      7: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5', // Server - 智慧网络管理方案
      8: 'M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z', // Cloud - 智慧云端体系方案
      9: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z', // Users - 智慧养老服务方案
      10: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18H6zM6 12h4M14 12h4M6 20h4M14 20h4M6 8h4M14 8h4', // Building2 - 智慧城市管理方案
    }
    return iconPaths[index as keyof typeof iconPaths] || iconPaths[1]
  }, [])

  // Helper function to calculate text width more accurately
  const getTextWidth = useCallback((text: string, fontSize: number = 14): number => {
    // Create a temporary text element to measure actual width
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    if (context) {
      context.font = `${fontSize}px "AlimamaShuHeiTi", "Source Han Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif`
      return context.measureText(text).width
    }
    // Fallback estimation for Chinese characters (wider than English)
    return text.length * (fontSize * 0.8)
  }, [])

  useEffect(() => {
    if (!svgRef.current || solutions.length === 0) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 4

    // Create gradients
    const defs = svg.append('defs')

    const centerGradient = defs.append('radialGradient').attr('id', 'center-gradient')

    centerGradient.append('stop').attr('offset', '0%').attr('stop-color', '#ffffff')

    centerGradient.append('stop').attr('offset', '100%').attr('stop-color', '#3b82f6')

    // Create Liquid Glasses effect gradients with light gray base
    const liquidGlassGradient = defs
      .append('radialGradient')
      .attr('id', 'liquid-glass-gradient')
      .attr('cx', '30%')
      .attr('cy', '30%')

    liquidGlassGradient
      .append('stop')
      .attr('offset', '0%')
      .attr('stop-color', 'rgba(255, 255, 255, 0.9)')
      .attr('stop-opacity', '0.95')

    liquidGlassGradient
      .append('stop')
      .attr('offset', '50%')
      .attr('stop-color', 'rgba(248, 250, 252, 0.7)')
      .attr('stop-opacity', '0.8')

    liquidGlassGradient
      .append('stop')
      .attr('offset', '100%')
      .attr('stop-color', 'rgba(241, 245, 249, 0.6)')
      .attr('stop-opacity', '0.7')

    // Create backdrop blur filter for glass effect
    const filter = defs
      .append('filter')
      .attr('id', 'glass-blur')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')

    filter.append('feGaussianBlur').attr('in', 'SourceGraphic').attr('stdDeviation', '1')

    filter
      .append('feColorMatrix')
      .attr('type', 'matrix')
      .attr('values', '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.8 0')

    // Create inner shadow for depth
    const shadowFilter = defs
      .append('filter')
      .attr('id', 'inner-shadow')
      .attr('x', '-50%')
      .attr('y', '-50%')
      .attr('width', '200%')
      .attr('height', '200%')

    shadowFilter.append('feOffset').attr('dx', '2').attr('dy', '2')

    shadowFilter.append('feGaussianBlur').attr('stdDeviation', '2').attr('result', 'offset-blur')

    shadowFilter.append('feFlood').attr('flood-color', 'rgba(0, 0, 0, 0.2)')

    shadowFilter.append('feComposite').attr('in2', 'offset-blur').attr('operator', 'in')

    // Create main group
    const mainGroup = svg.append('g')

    // Calculate positions for solution nodes
    const solutionData = solutions.slice(0, 10).map((solution, i) => {
      const angle = (i * 2 * Math.PI) / solutions.length
      const nodeX = centerX + radius * Math.cos(angle - Math.PI / 2)
      const nodeY = centerY + radius * Math.sin(angle - Math.PI / 2)
      const isRightSide = nodeX > centerX

      // Calculate label distance and positioning
      const labelDistance = 220 // Distance to extend horizontally
      let verticalOffset = 0
      let forceDirection = null // Force specific direction for certain nodes
      let needsLShape = false // Whether this node needs L-shaped line

      // Only apply L-shape to nodes 1 and 6 (based on index)
      if (i === 0) {
        // Node 1 (index 0)
        verticalOffset = -50 // Move up
        forceDirection = 'left'
        needsLShape = true
      } else if (i === 5) {
        // Node 6 (index 5)
        verticalOffset = 50 // Move down
        forceDirection = 'right'
        needsLShape = true
      }

      // Determine final direction (use forced direction if specified, otherwise use position)
      const finalDirection = forceDirection || (isRightSide ? 'right' : 'left')

      // Calculate text box dimensions based on actual text
      const textWidth = getTextWidth(solution.title, 14) // Accurate text width measurement
      const boxWidth = textWidth + 20 // Text width + padding (10px each side)
      const boxHeight = 24 // Slightly taller for better text spacing

      // Calculate box position
      const boxX =
        finalDirection === 'right' ? nodeX + labelDistance : nodeX - labelDistance - boxWidth
      const boxY = needsLShape ? nodeY + verticalOffset - boxHeight / 2 : nodeY - boxHeight / 2

      // Line should connect to the edge of the box
      const lineEndX = finalDirection === 'right' ? boxX : boxX + boxWidth
      const lineEndY = needsLShape ? nodeY + verticalOffset : nodeY

      // Text position (center of box)
      const textX = boxX + boxWidth / 2
      const textY = needsLShape ? nodeY + verticalOffset : nodeY

      return {
        ...solution,
        x: nodeX,
        y: nodeY,
        boxX,
        boxY,
        boxWidth,
        boxHeight,
        lineEndX,
        lineEndY,
        textX,
        textY,
        angle: (angle * 180) / Math.PI,
        isRightSide: finalDirection === 'right',
        verticalOffset,
        forceDirection,
        needsLShape,
      }
    })

    // Add solution nodes with Liquid Glasses effect
    const nodes = mainGroup
      .selectAll('.solution-node')
      .data(solutionData)
      .enter()
      .append('circle')
      .attr('class', 'solution-node')
      .attr('cx', d => d.x)
      .attr('cy', d => d.y)
      .attr('r', 0)
      .attr('fill', 'url(#liquid-glass-gradient)')
      .attr('stroke', 'rgba(255, 255, 255, 0.6)')
      .attr('stroke-width', 1.5)
      .style('backdrop-filter', 'blur(10px)')
      .style('filter', 'url(#glass-blur)')
      .style('cursor', 'pointer')
      .style('opacity', 0)

    // Animate nodes
    nodes
      .transition()
      .duration(600)
      .delay((d, i) => 400 + i * 100)
      .attr('r', 25)
      .style('opacity', 1)

    // Add icons to nodes with glass-compatible style
    const nodeIcons = mainGroup
      .selectAll('.node-icon')
      .data(solutionData)
      .enter()
      .append('path')
      .attr('class', 'node-icon')
      .attr('d', (d, i) => getIconPath(i + 1))
      .attr('transform', d => `translate(${d.x - 12}, ${d.y - 12})`)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(55, 65, 81, 0.8)')
      .attr('stroke-width', 1.8)
      .attr('stroke-linecap', 'round')
      .attr('stroke-linejoin', 'round')
      .style('filter', 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))')
      .style('opacity', 0)

    // Animate icons
    nodeIcons
      .transition()
      .duration(400)
      .delay((d, i) => 800 + i * 100)
      .style('opacity', 1)

    // Add label lines - L-shaped for nodes 1&6, straight for others
    const labelLineGroups = mainGroup
      .selectAll('.label-line-group')
      .data(solutionData)
      .enter()
      .append('g')
      .attr('class', 'label-line-group')

    // For L-shaped lines (nodes 1 & 6): First segment - vertical offset
    const verticalLines = labelLineGroups
      .filter(d => d.needsLShape)
      .append('line')
      .attr('class', 'label-line-vertical')
      .attr('x1', d => d.x)
      .attr('y1', d => {
        // Start from the edge of the circle, not the center
        const nodeRadius = 25
        const verticalOffset = d.verticalOffset || 0
        // If going down (positive offset), start from bottom of circle
        // If going up (negative offset), start from top of circle
        return d.y + (verticalOffset > 0 ? nodeRadius : -nodeRadius)
      })
      .attr('x2', d => d.x)
      .attr('y2', d => d.y + (d.verticalOffset || 0))
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('opacity', 0)

    // For L-shaped lines (nodes 1 & 6): Second segment - horizontal line to label
    const horizontalLines = labelLineGroups
      .filter(d => d.needsLShape)
      .append('line')
      .attr('class', 'label-line-horizontal')
      .attr('x1', d => d.x)
      .attr('y1', d => d.y + (d.verticalOffset || 0))
      .attr('x2', d => d.x)
      .attr('y2', d => d.y + (d.verticalOffset || 0))
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('opacity', 0)

    // For straight lines (nodes 2,5,7,10): Direct line to label
    const straightLines = labelLineGroups
      .filter(d => !d.needsLShape)
      .append('line')
      .attr('class', 'label-line-straight')
      .attr('x1', d => {
        // Start from the edge of the circle towards the label
        const nodeRadius = 25
        const dx = d.lineEndX - d.x
        const dy = d.lineEndY - d.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return d.x + (dx / distance) * nodeRadius
      })
      .attr('y1', d => {
        // Start from the edge of the circle towards the label
        const nodeRadius = 25
        const dx = d.lineEndX - d.x
        const dy = d.lineEndY - d.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return d.y + (dy / distance) * nodeRadius
      })
      .attr('x2', d => {
        // Initial end position same as start (from circle edge)
        const nodeRadius = 25
        const dx = d.lineEndX - d.x
        const dy = d.lineEndY - d.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return d.x + (dx / distance) * nodeRadius
      })
      .attr('y2', d => {
        // Initial end position same as start (from circle edge)
        const nodeRadius = 25
        const dx = d.lineEndX - d.x
        const dy = d.lineEndY - d.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        return d.y + (dy / distance) * nodeRadius
      })
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('opacity', 0)

    // Animate vertical lines first (L-shaped only)
    verticalLines
      .transition()
      .duration(400)
      .delay((d, i) => 1000 + i * 80)
      .attr('opacity', 0.7)

    // Then animate horizontal lines (L-shaped only)
    horizontalLines
      .transition()
      .duration(400)
      .delay((d, i) => 1200 + i * 80)
      .attr('x2', d => d.lineEndX)
      .attr('opacity', 0.7)

    // Animate straight lines (direct to label)
    straightLines
      .transition()
      .duration(600)
      .delay((d, i) => 1000 + i * 80)
      .attr('x2', d => d.lineEndX)
      .attr('y2', d => d.lineEndY)
      .attr('opacity', 0.7)

    // Add label boxes (rectangles to frame the text)
    const labelBoxes = mainGroup
      .selectAll('.solution-label-box')
      .data(solutionData)
      .enter()
      .append('rect')
      .attr('class', 'solution-label-box')
      .attr('x', d => d.boxX)
      .attr('y', d => d.boxY)
      .attr('width', d => d.boxWidth)
      .attr('height', d => d.boxHeight)
      .attr('fill', 'none') // No background
      .attr('stroke', '#94a3b8')
      .attr('stroke-width', 1)
      .attr('rx', 4) // Rounded corners
      .attr('ry', 4)
      .style('opacity', 0)
      .style('cursor', 'pointer')

    // Add solution titles inside the boxes
    const labels = mainGroup
      .selectAll('.solution-label')
      .data(solutionData)
      .enter()
      .append('text')
      .attr('class', 'solution-label')
      .attr('x', d => d.textX)
      .attr('y', d => d.textY)
      .attr('text-anchor', 'middle') // Center text in box
      .attr('dominant-baseline', 'middle')
      .attr('fill', '#374151')
      .attr('font-size', '14px')
      .attr(
        'font-family',
        '"AlimamaShuHeiTi", "Source Han Sans SC", "Noto Sans CJK SC", "PingFang SC", "Microsoft YaHei", sans-serif'
      )
      .attr('font-weight', '500')
      .style('opacity', 0)
      .style('cursor', 'pointer')
      .text(d => d.title)

    // Animate label boxes first
    labelBoxes
      .transition()
      .duration(500)
      .delay((d, i) => 1200 + i * 80)
      .style('opacity', 1)

    // Then animate labels
    labels
      .transition()
      .duration(500)
      .delay((d, i) => 1300 + i * 80)
      .style('opacity', 1)

    // Center logo with pulse effect
    const centerGroup = mainGroup.append('g').attr('transform', `translate(${centerX}, ${centerY})`)

    // Add pulse effect circles (multiple layers for better effect)
    const pulseGroup = centerGroup.append('g').attr('class', 'pulse-group')

    // Create multiple pulse circles for layered effect
    const pulseCircles: d3.Selection<SVGCircleElement, unknown, null, undefined>[] = []
    for (let i = 0; i < 3; i++) {
      const pulseCircle = pulseGroup
        .append('circle')
        .attr('class', `pulse-circle-${i}`)
        .attr('r', 45)
        .attr('fill', 'none')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 2 - i * 0.3)
        .attr('opacity', 0)

      pulseCircles.push(pulseCircle)
    }

    // Function to create continuous pulse animation
    const createPulseAnimation = () => {
      pulseCircles.forEach((circle, i) => {
        const animatePulse = () => {
          circle
            .attr('r', 50)
            .attr('opacity', 0.6 - i * 0.15)
            .attr('stroke-width', 3 - i * 0.5)
            .transition()
            .duration(2500)
            .ease(d3.easeQuadOut)
            .attr('r', 120 + i * 20)
            .attr('opacity', 0)
            .attr('stroke-width', 1)
            .on('end', () => {
              // Restart the animation immediately for continuous effect
              setTimeout(animatePulse, 100)
            })
        }

        // Start each pulse with a different delay for layered effect
        setTimeout(animatePulse, i * 600 + 1200) // Start after logo appears
      })
    }

    // Start the pulse animation
    createPulseAnimation()

    if (logoUrl) {
      // Add logo image directly without background circle
      centerGroup
        .append('image')
        .attr('href', logoUrl)
        .attr('x', -60) // Center the logo (assuming 120px width)
        .attr('y', -60) // Center the logo (assuming 120px height)
        .attr('width', 120)
        .attr('height', 120)
        .style('opacity', 0)
        .style('filter', 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.15))')
        .transition()
        .duration(800)
        .delay(400)
        .style('opacity', 1)
    } else {
      // Fallback: Simple center hub with text
      centerGroup
        .append('circle')
        .attr('r', 0)
        .attr('fill', 'url(#center-gradient)')
        .attr('stroke', '#3b82f6')
        .attr('stroke-width', 3)
        .transition()
        .duration(800)
        .delay(200)
        .attr('r', 50)

      centerGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '-0.5em')
        .attr('fill', '#1e293b')
        .attr('font-size', '16px')
        .attr('font-weight', '700')
        .style('opacity', 0)
        .text('临港景鸿')
        .transition()
        .duration(600)
        .delay(800)
        .style('opacity', 1)

      centerGroup
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('dy', '1em')
        .attr('fill', '#64748b')
        .attr('font-size', '12px')
        .attr('font-weight', '500')
        .style('opacity', 0)
        .text('10 Solutions')
        .transition()
        .duration(600)
        .delay(1000)
        .style('opacity', 1)
    }

    // Enhanced hover and click effects with better event handling
    nodes
      .style('pointer-events', 'all')
      .on('mouseenter', function (event, d) {
        // Calculate tooltip position relative to the label box (outside the label)
        if (containerRef.current) {
          // Use the label box position instead of node position
          const labelBoxX = d.boxX
          const labelBoxY = d.boxY
          const labelBoxWidth = d.boxWidth
          const labelBoxHeight = d.boxHeight

          // Position tooltip outside the label box
          let tooltipX, tooltipY

          if (d.isRightSide) {
            // For right side labels, show tooltip to the right of the label
            tooltipX = labelBoxX + labelBoxWidth + 20
            tooltipY = labelBoxY + labelBoxHeight / 2
          } else {
            // For left side labels, show tooltip to the left of the label
            tooltipX = labelBoxX - 20
            tooltipY = labelBoxY + labelBoxHeight / 2
          }

          setTooltipPosition({
            x: tooltipX,
            y: tooltipY,
            isRightSide: d.isRightSide,
          })
          setHoveredSolution(d)
        }

        // Highlight the hovered node
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 30)
          .attr('stroke-width', 3)
          .attr('stroke', '#3b82f6')

        // Highlight corresponding lines
        const targetVerticalLines = verticalLines.filter(lineData => lineData.id === d.id)
        if (!targetVerticalLines.empty()) {
          targetVerticalLines
            .transition()
            .duration(200)
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
        }

        const targetHorizontalLines = horizontalLines.filter(lineData => lineData.id === d.id)
        if (!targetHorizontalLines.empty()) {
          targetHorizontalLines
            .transition()
            .duration(200)
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
        }

        const targetStraightLines = straightLines.filter(lineData => lineData.id === d.id)
        if (!targetStraightLines.empty()) {
          targetStraightLines
            .transition()
            .duration(200)
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
        }

        const targetLabels = labels.filter(labelData => labelData.id === d.id)
        if (!targetLabels.empty()) {
          targetLabels.transition().duration(200).attr('fill', '#3b82f6').attr('font-weight', '600')
        }

        const targetLabelBoxes = labelBoxes.filter(boxData => boxData.id === d.id)
        if (!targetLabelBoxes.empty()) {
          targetLabelBoxes
            .transition()
            .duration(200)
            .attr('stroke', '#3b82f6')
            .attr('stroke-width', 2)
        }
      })
      .on('mouseleave', function (_, d) {
        // Add a small delay to prevent flickering
        setTimeout(() => {
          setHoveredSolution(null)
        }, 100)

        // Reset node appearance to original Liquid Glasses style
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', 25)
          .attr('stroke-width', 1.5)
          .attr('stroke', 'rgba(255, 255, 255, 0.6)')

        // Reset line colors
        const resetVerticalLines = verticalLines.filter(lineData => lineData.id === d.id)
        if (!resetVerticalLines.empty()) {
          resetVerticalLines
            .transition()
            .duration(200)
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1)
        }

        const resetHorizontalLines = horizontalLines.filter(lineData => lineData.id === d.id)
        if (!resetHorizontalLines.empty()) {
          resetHorizontalLines
            .transition()
            .duration(200)
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1)
        }

        const resetStraightLines = straightLines.filter(lineData => lineData.id === d.id)
        if (!resetStraightLines.empty()) {
          resetStraightLines
            .transition()
            .duration(200)
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1)
        }

        const resetLabels = labels.filter(labelData => labelData.id === d.id)
        if (!resetLabels.empty()) {
          resetLabels.transition().duration(200).attr('fill', '#374151').attr('font-weight', '500')
        }

        const resetLabelBoxes = labelBoxes.filter(boxData => boxData.id === d.id)
        if (!resetLabelBoxes.empty()) {
          resetLabelBoxes
            .transition()
            .duration(200)
            .attr('stroke', '#94a3b8')
            .attr('stroke-width', 1)
        }
      })
      .on('click', function (_, d) {
        router.push(`/solutions/${d.id}`)
      })

    // Add click events to label boxes
    labelBoxes.style('pointer-events', 'all').on('click', function (_, d) {
      router.push(`/solutions/${d.id}`)
    })

    // Add click events to labels
    labels.style('pointer-events', 'all').on('click', function (_, d) {
      router.push(`/solutions/${d.id}`)
    })

    // Cleanup function
    const currentSvg = svgRef.current
    return () => {
      if (currentSvg) {
        d3.select(currentSvg).selectAll('*').remove()
      }
      setHoveredSolution(null)
    }
  }, [solutions, width, height, getIconPath, getTextWidth, router, logoUrl])

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      <svg ref={svgRef} width={width} height={height} className='h-full w-full' />

      <AnimatePresence>
        {hoveredSolution && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className='pointer-events-none absolute z-10 rounded-lg border border-gray-200 bg-white p-3 shadow-lg'
            style={{
              left: tooltipPosition.isRightSide ? tooltipPosition.x : tooltipPosition.x - 200, // Adjust for left side
              top: tooltipPosition.y - 40, // Center vertically relative to label
              transform: 'translateY(-50%)',
            }}
          >
            <h3 className='mb-1 text-sm font-semibold text-gray-900'>{hoveredSolution.title}</h3>
            <p className='max-w-48 text-xs text-gray-600'>{hoveredSolution.description}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
