import * as React from 'react'

interface ChatIconProps {
  className?: string
  size?: number
}

export function ChatIcon({ className = '', size = 24 }: ChatIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* 机器人头部 */}
      <rect x='6' y='7' width='12' height='10' rx='3' fill='currentColor' opacity='0.9' />

      {/* 机器人天线 */}
      <line
        x1='12'
        y1='4'
        x2='12'
        y2='7'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
      />
      <circle cx='12' cy='4' r='1.5' fill='currentColor' />

      {/* 眼睛 */}
      <circle cx='9.5' cy='11' r='1.2' fill='white' />
      <circle cx='14.5' cy='11' r='1.2' fill='white' />

      {/* 眼珠 */}
      <circle cx='9.5' cy='11' r='0.6' fill='currentColor' opacity='0.8' />
      <circle cx='14.5' cy='11' r='0.6' fill='currentColor' opacity='0.8' />

      {/* 嘴巴 - 微笑弧线 */}
      <path
        d='M9.5 14c0 1 1 1.5 2.5 1.5s2.5-0.5 2.5-1.5'
        stroke='white'
        strokeWidth='1.5'
        strokeLinecap='round'
        fill='none'
      />

      {/* 身体 */}
      <rect x='8' y='17' width='8' height='4' rx='1' fill='currentColor' opacity='0.7' />

      {/* 手臂 */}
      <rect x='4' y='18' width='4' height='1.5' rx='0.75' fill='currentColor' opacity='0.6' />
      <rect x='16' y='18' width='4' height='1.5' rx='0.75' fill='currentColor' opacity='0.6' />

      {/* 装饰性的小点点 */}
      <circle cx='12' cy='18.5' r='0.5' fill='white' opacity='0.8' />
      <circle cx='10.5' cy='19.5' r='0.3' fill='white' opacity='0.6' />
      <circle cx='13.5' cy='19.5' r='0.3' fill='white' opacity='0.6' />
    </svg>
  )
}
