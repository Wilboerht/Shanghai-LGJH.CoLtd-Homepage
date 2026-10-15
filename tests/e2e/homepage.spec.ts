import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')

    // 检查页面标题
    await expect(page).toHaveTitle(/临港景鸿/)

    // 检查主要导航元素
    await expect(page.locator('nav')).toBeVisible()

    // 检查Hero区域
    await expect(page.locator('[data-testid="hero"]')).toBeVisible()
  })

  test('should navigate to products page', async ({ page }) => {
    await page.goto('/')

    // 点击产品链接
    await page.click('text=产品')

    // 验证URL变化
    await expect(page).toHaveURL(/\/products/)

    // 验证页面内容
    await expect(page.locator('h1')).toContainText('产品')
  })

  test('should navigate to solutions page', async ({ page }) => {
    await page.goto('/')

    // 点击解决方案链接
    await page.click('text=解决方案')

    // 验证URL变化
    await expect(page).toHaveURL(/\/solutions/)

    // 验证页面内容
    await expect(page.locator('h1')).toContainText('解决方案')
  })

  test('should submit contact form', async ({ page }) => {
    await page.goto('/contact')

    // 填写表单
    await page.fill('[name="name"]', '测试用户')
    await page.fill('[name="email"]', 'test@example.com')
    await page.fill('[name="subject"]', '测试主题')
    await page.fill('[name="message"]', '这是一条测试消息')

    // 提交表单
    await page.click('button[type="submit"]')

    // 验证成功消息
    await expect(page.locator('.success-message')).toBeVisible()
  })

  test('should be responsive on mobile', async ({ page }) => {
    // 设置移动端视口
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')

    // 检查移动端导航
    await expect(page.locator('[data-testid="mobile-menu-button"]')).toBeVisible()

    // 点击移动端菜单
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible()
  })

  test('should have good performance', async ({ page }) => {
    await page.goto('/')

    // 等待页面完全加载
    await page.waitForLoadState('networkidle')

    // 检查页面性能指标
    const performanceMetrics = await page.evaluate(() => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming
      return {
        loadTime: navigation.loadEventEnd - navigation.loadEventStart,
        domContentLoaded:
          navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      }
    })

    // 验证加载时间合理（小于3秒）
    expect(performanceMetrics.loadTime).toBeLessThan(3000)
  })
})
