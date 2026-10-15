import * as React from 'react'

interface AssistantIconProps {
  className?: string
  size?: number
}

export function AssistantIcon({ className = '', size = 24 }: AssistantIconProps) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox='0 0 24 24'
      fill='none'
      xmlns='http://www.w3.org/2000/svg'
    >
      {/* 外圈 */}
      <circle cx='12' cy='12' r='10' fill='currentColor' opacity='0.1' />
      <circle cx='12' cy='12' r='8' fill='currentColor' opacity='0.2' />

      {/* 主体圆形 */}
      <circle cx='12' cy='12' r='6' fill='currentColor' opacity='0.9' />

      {/* 智能脑波纹 */}
      <path
        d='M8 10c1-1 2-1 4 0s3 1 4 0'
        stroke='white'
        strokeWidth='1.5'
        strokeLinecap='round'
        fill='none'
        opacity='0.8'
      />

      {/* AI眼睛 */}
      <circle cx='10' cy='11.5' r='1' fill='white' />
      <circle cx='14' cy='11.5' r='1' fill='white' />

      {/* 嘴巴 */}
      <path
        d='M10 14c0 1 0.9 2 2 2s2-1 2-2'
        stroke='white'
        strokeWidth='1.2'
        strokeLinecap='round'
        fill='none'
      />

      {/* 智能光点 */}
      <circle cx='12' cy='8' r='0.8' fill='white' opacity='0.6' />
      <circle cx='15.5' cy='9.5' r='0.5' fill='white' opacity='0.4' />
      <circle cx='8.5' cy='9.5' r='0.5' fill='white' opacity='0.4' />
    </svg>
  )
}
