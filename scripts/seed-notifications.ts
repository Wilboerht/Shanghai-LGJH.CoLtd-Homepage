import { PrismaClient, NotificationType, NotificationPriority } from '@prisma/client'

const prisma = new PrismaClient()

async function seedNotifications() {
  try {
    // 获取第一个管理员用户
    const adminUser = await prisma.user.findFirst({
      where: { isAdmin: true },
    })

    if (!adminUser) {
      console.log('未找到管理员用户，请先创建管理员账户')
      return
    }

    console.log(`为用户 ${adminUser.name} (${adminUser.email}) 创建示例通知...`)

    // 创建示例通知
    const notifications = [
      {
        title: '新的联系表单提交',
        message: '张先生提交了产品咨询表单，请及时处理',
        type: NotificationType.FORM_SUBMISSION,
        priority: NotificationPriority.HIGH,
        actionUrl: '/admin/forms/contacts',
        actionText: '查看表单',
        userId: adminUser.id,
      },
      {
        title: '新的招聘申请',
        message: '李女士申请了前端开发工程师职位',
        type: NotificationType.FORM_SUBMISSION,
        priority: NotificationPriority.NORMAL,
        actionUrl: '/admin/forms/applications',
        actionText: '查看申请',
        userId: adminUser.id,
      },
      {
        title: '系统更新完成',
        message: '网站系统已成功更新到版本 v2.1.0',
        type: NotificationType.SYSTEM,
        priority: NotificationPriority.NORMAL,
        actionUrl: '/admin/dashboard',
        actionText: '查看详情',
        userId: adminUser.id,
      },
      {
        title: '数据备份完成',
        message: '今日数据备份已成功完成，备份文件已保存',
        type: NotificationType.SUCCESS,
        priority: NotificationPriority.LOW,
        userId: adminUser.id,
      },
      {
        title: '磁盘空间警告',
        message: '服务器磁盘使用率已达到85%，建议清理无用文件',
        type: NotificationType.WARNING,
        priority: NotificationPriority.HIGH,
        actionUrl: '/admin/settings',
        actionText: '查看设置',
        userId: adminUser.id,
      },
      {
        title: '新产品发布',
        message: '智能监控摄像头 Pro 版本已成功发布',
        type: NotificationType.SUCCESS,
        priority: NotificationPriority.NORMAL,
        actionUrl: '/admin/content/products',
        actionText: '查看产品',
        userId: adminUser.id,
      },
      {
        title: '用户活动异常',
        message: '检测到异常登录尝试，请检查安全设置',
        type: NotificationType.ERROR,
        priority: NotificationPriority.URGENT,
        actionUrl: '/admin/users',
        actionText: '查看用户',
        userId: adminUser.id,
      },
      {
        title: '内容审核提醒',
        message: '有3篇文章等待审核发布',
        type: NotificationType.USER_ACTION,
        priority: NotificationPriority.NORMAL,
        actionUrl: '/admin/content',
        actionText: '去审核',
        userId: adminUser.id,
      },
    ]

    // 批量创建通知
    for (const notificationData of notifications) {
      await prisma.notification.create({
        data: {
          ...notificationData,
          createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // 随机时间（过去7天内）
        },
      })
    }

    console.log(`成功创建 ${notifications.length} 条示例通知`)
  } catch (error) {
    console.error('创建示例通知失败:', error)
  } finally {
    await prisma.$disconnect()
  }
}

seedNotifications()
