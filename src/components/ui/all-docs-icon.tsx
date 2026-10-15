import * as React from 'react'

interface LinGangJingHongIconProps {
  className?: string
  size?: number
}

/**
 * Custom 临港景鸿 Logo Icon - Professional Security
 *
 * A refined logo that embodies security and protection:
 * - Shield with security elements
 * - Clean lines with professional appearance
 * - Distinctive silhouette for instant recognition
 * - Timeless design that scales beautifully
 *
 * Design philosophy: Security through professional excellence.
 */
export const LinGangJingHongIcon: React.FC<LinGangJingHongIconProps> = ({
  className = 'h-6 w-6',
  size = 24,
}) => (
  <svg
    width={size}
    height={size}
    viewBox='0 0 24 24'
    fill='none'
    xmlns='http://www.w3.org/2000/svg'
    className={className}
    role='img'
    aria-label='临港景鸿安防解决方案Logo'
    suppressHydrationWarning
  >
    {/* Security shield outline */}
    <path
      d='M12 2 L4 6 L4 12 C4 16.5 7 20.26 12 22 C17 20.26 20 16.5 20 12 L20 6 L12 2 Z'
      fill='currentColor'
      fillOpacity='0.1'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'
    />

    {/* Security checkmark */}
    <path
      d='M9 12 L11 14 L15 10'
      stroke='currentColor'
      strokeWidth='2.5'
      strokeLinecap='round'
      strokeLinejoin='round'
      fill='none'
    />

    {/* Security dot indicator */}
    <circle cx='12' cy='8' r='1.5' fill='currentColor' />
  </svg>
)

// Legacy export for backward compatibility
export const SecureGuardIcon = LinGangJingHongIcon
export const KnoLibIcon = LinGangJingHongIcon
export const AllDocsIcon = LinGangJingHongIcon

export default LinGangJingHongIcon
