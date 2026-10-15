/**
 * Utility functions for handling partner data
 */

/**
 * Extract partner name from filename
 * @param filename The filename of the partner logo
 * @returns The extracted partner name
 */
export function extractPartnerName(filename: string): string {
  // Remove file extension and path
  const baseName = filename.split('/').pop()?.split('.')[0] || ''

  // Handle special cases
  if (baseName.includes('logo')) {
    // For files like "logo (1).png", "logo-blue.svg", etc.
    return baseName.replace(/logo[^a-zA-Z0-9]*/, '').trim() || 'Partner'
  }

  // For files with numbers or special characters
  if (/^\d+/.test(baseName) || /^[^a-zA-Z]/.test(baseName)) {
    return 'Partner'
  }

  // For known partner names embedded in filenames
  const knownPartners: Record<string, string> = {
    huawei: 'Huawei',
    panasonic: 'Panasonic',
    tyco: 'Tyco',
    carrier: 'Carrier',
    dhl: 'DHL',
    esr: 'ESR',
    hikvision: 'Hikvision',
    boc: 'Bank of China',
    Kerry: 'Kerry Properties',
    hon: 'Honeywell',
    shac: 'SHAC',
  }

  for (const [key, value] of Object.entries(knownPartners)) {
    if (baseName.toLowerCase().includes(key.toLowerCase())) {
      return value
    }
  }

  // Default: capitalize first letter of each word
  return baseName
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Filter and organize partner logos
 * @param files Array of file paths
 * @returns Organized partner data with name and logo path
 */
export function organizePartnerLogos(files: string[]): { name: string; logo: string }[] {
  // Filter out non-image files and organize
  const imageExtensions = ['.png', '.jpg', '.jpeg', '.svg', '.webp', '.gif', '.avif']

  return files
    .filter(file => {
      const ext = file.substring(file.lastIndexOf('.')).toLowerCase()
      return imageExtensions.includes(ext)
    })
    .map(file => {
      const relativePath = file.startsWith('/') ? file : `/${file}`
      return {
        name: extractPartnerName(file),
        logo: relativePath,
      }
    })
}
