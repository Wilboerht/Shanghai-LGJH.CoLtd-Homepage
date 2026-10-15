'use client'

import React from 'react'

import Link from 'next/link'
import Image from 'next/image'
import { footerNavigation } from '@/data/navigation'
import { useContactSettings, useGeneralSettings } from '@/hooks/use-site-settings'

export function Footer() {
  const { settings: contactSettings } = useContactSettings()
  const { settings: generalSettings } = useGeneralSettings()

  return (
    <footer className='relative z-20 border-t border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        <div className='py-12'>
          <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-6 lg:gap-16'>
            {/* Company Info */}
            <div className='lg:col-span-2'>
              <div className='mb-5 flex items-center space-x-3'>
                <div className='flex h-9 w-9 items-center justify-center'>
                  <Image
                    src='/logo.png'
                    alt={`${generalSettings.site_name || '临港景鸿'} Logo`}
                    width={36}
                    height={36}
                    className='h-9 w-9 object-contain'
                  />
                </div>
                <span className='text-xl font-bold text-foreground'>
                  {generalSettings.site_name || '临港景鸿'}
                </span>
              </div>
              <p className='mb-5 max-w-sm text-sm leading-relaxed text-muted-foreground'>
                {generalSettings.site_description ||
                  '专业智能化解决方案提供商，致力于为客户提供数字化转型和智能化服务。专注于7大核心业务领域，服务超过1000家客户。'}
              </p>
              <div className='mb-5 space-y-2 text-sm text-muted-foreground'>
                <p className='flex items-center'>
                  <span className='mr-3 text-base'>📍</span>
                  <span>
                    {contactSettings.company_address || '上海市徐汇区 宜山路508号 景鸿大楼 5楼'}
                  </span>
                </p>
                <p className='flex items-center'>
                  <span className='mr-3 text-base'>📞</span>
                  <span>{contactSettings.company_phone || '+86 13816579552 周珺婷'}</span>
                </p>
                <p className='flex items-center'>
                  <span className='mr-3 text-base'>✉️</span>
                  <span>{contactSettings.company_email || 'zhoujunting@lingangjinghong.com'}</span>
                </p>
              </div>
              <div className='flex justify-start'>
                {/* QR Code */}
                <div className='text-center'>
                  <Image
                    src='/images/QR code.png'
                    alt={`${generalSettings.site_name || '临港景鸿'}二维码`}
                    width={80}
                    height={80}
                    className='rounded-lg shadow-sm'
                  />
                  <p className='mt-2 text-xs text-muted-foreground'>微信公众号</p>
                </div>
              </div>
            </div>

            {/* Navigation Columns */}
            <div>
              <h3 className='mb-4 text-base font-semibold text-foreground'>
                {footerNavigation.products.title}
              </h3>
              <ul className='space-y-3'>
                {footerNavigation.products.items.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='mb-4 text-base font-semibold text-foreground'>
                {footerNavigation.solutions.title}
              </h3>
              <ul className='space-y-3'>
                {footerNavigation.solutions.items.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='mb-4 text-base font-semibold text-foreground'>
                {footerNavigation.services.title}
              </h3>
              <ul className='space-y-3'>
                {footerNavigation.services.items.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className='mb-4 text-base font-semibold text-foreground'>
                {footerNavigation.company.title}
              </h3>
              <ul className='space-y-3'>
                {footerNavigation.company.items.map(item => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className='text-sm text-muted-foreground transition-colors hover:text-foreground'
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className='mt-10 border-t border-slate-200 pt-8 dark:border-slate-700'>
            <div className='flex flex-col items-center justify-between space-y-2 md:flex-row md:space-y-0'>
              <p className='text-sm text-muted-foreground'>
                版权所有 © 2016-{new Date().getFullYear()}{' '}
                上海临港景鸿安防科技发展有限公司，保留一切权利。
              </p>
              <div className='flex items-center space-x-4 text-sm text-muted-foreground'>
                {/* ICP备案 */}
                <span>沪ICP备2023003550号</span>

                {/* <span>|</span> */}

                {/* 公安网备 */}
                {/* <div className='flex items-center space-x-1'>
                  <Image
                    src='/Public security ICP filing icon.png'
                    alt='公安网备'
                    width={16}
                    height={16}
                    className='flex-shrink-0'
                  />
                  <span>沪公网安备310xxxxxxxxxxx号</span>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
