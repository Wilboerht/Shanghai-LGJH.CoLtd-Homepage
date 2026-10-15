'use client'

import * as React from 'react'

export function FontDiagnostic() {
  const [fontLoadStatus, setFontLoadStatus] = React.useState<Record<string, string>>({})
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (!mounted) return
    const checkFontLoad = async () => {
      const fonts = [
        'AliDongfang',
        'AlimamaAgile',
        'AlimamaDaoli',
        'AlimamaFangyuan',
        'AlimamaShuhei',
      ]

      const status: Record<string, string> = {}

      for (const font of fonts) {
        try {
          // 检查字体是否可用
          if (document.fonts && document.fonts.check) {
            const isLoaded = document.fonts.check(`16px ${font}`)
            status[font] = isLoaded ? '✅ 已加载' : '❌ 未加载'
          } else {
            status[font] = '⚠️ 无法检测'
          }
        } catch {
          status[font] = '❌ 错误'
        }
      }

      setFontLoadStatus(status)
    }

    // 立即检查
    checkFontLoad()

    // 等待字体加载完成后再检查一次
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(checkFontLoad, 1000)
      })
    }
  }, [mounted])

  return (
    <div className='rounded-lg border border-yellow-200 bg-yellow-50 p-6 dark:border-yellow-800 dark:bg-yellow-900/20'>
      <h3 className='mb-4 text-lg font-semibold text-yellow-800 dark:text-yellow-200'>
        字体加载诊断
      </h3>

      <div className='space-y-2'>
        {Object.entries(fontLoadStatus).map(([font, status]) => (
          <div key={font} className='flex items-center justify-between'>
            <span className='font-mono text-sm text-gray-700 dark:text-gray-300'>{font}</span>
            <span className='text-sm'>{status}</span>
          </div>
        ))}
      </div>

      <div className='mt-4 border-t border-yellow-200 pt-4 dark:border-yellow-700'>
        <h4 className='mb-2 font-semibold text-yellow-800 dark:text-yellow-200'>字体路径测试</h4>
        <div className='space-y-1 text-xs text-gray-600 dark:text-gray-400'>
          <div>Ali Dongfang: /fonts/Ali Dongfang/AlimamaDaoLiTi.woff2</div>
          <div>Alimama Agile: /fonts/Alimama Agile/AlimamaDaoLiTi.woff2</div>
          <div>Alimama Daoli: /fonts/Alimama Daoli/AlimamaDaoLiTi.woff2</div>
          <div>Alimama Fangyuan: /fonts/Alimama Fangyuan/AlimamaDaoLiTi.woff2</div>
          <div>Alimama Shuhei: /fonts/Alimama Shuhei/AlimamaDaoLiTi.woff2</div>
        </div>
      </div>

      <div className='mt-4 border-t border-yellow-200 pt-4 dark:border-yellow-700'>
        <h4 className='mb-2 font-semibold text-yellow-800 dark:text-yellow-200'>CSS 变量测试</h4>
        <div className='space-y-1 text-xs text-gray-600 dark:text-gray-400'>
          <div>--font-ali-dongfang</div>
          <div>--font-alimama-agile</div>
          <div>--font-alimama-daoli</div>
          <div>--font-alimama-fangyuan</div>
          <div>--font-alimama-shuhei</div>
        </div>
      </div>
    </div>
  )
}
