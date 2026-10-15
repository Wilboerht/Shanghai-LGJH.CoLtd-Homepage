# 解决方案页面 Hero 区域设计指南

## 概述

基于参考设计，我们创建了一个统一的 `SolutionHero` 组件，用于所有解决方案页面的 hero 区域。这个组件提供了一致的设计语言，同时允许每个页面有自己的特色。

## 设计特点

- **现代渐变背景** - 支持自定义渐变色彩
- **左右布局** - 左侧内容，右侧视觉元素
- **响应式设计** - 移动端自动调整为上下布局
- **动画效果** - 使用 Framer Motion 提供流畅的进入动画
- **可定制性** - 支持不同的颜色主题和视觉元素

## 使用方法

### 1. 导入组件

```tsx
import { SolutionHero } from '@/components/solutions/solution-hero'
```

### 2. 基本使用

```tsx
<SolutionHero
  badge={{
    icon: YourIcon,
    text: '解决方案类别',
  }}
  title='主标题'
  subtitle='副标题'
  description='详细描述文字...'
  metrics={[
    { value: '99%', label: '指标1' },
    { value: '50%', label: '指标2' },
    { value: '24×7', label: '指标3' },
  ]}
  primaryAction={{
    text: '主要按钮',
    href: '/contact',
    icon: Phone,
  }}
  secondaryAction={{
    text: '次要按钮',
    icon: Download,
    onClick: () => console.log('下载'),
  }}
  visualElement={<CustomVisual />}
  backgroundGradient='from-blue-900 via-indigo-900 to-purple-900'
  accentColor='blue'
/>
```

## 属性说明

### 必需属性

- `title`: 主标题文字
- `description`: 描述文字

### 可选属性

- `badge`: 顶部徽章
  - `icon`: Lucide 图标组件
  - `text`: 徽章文字
- `subtitle`: 副标题（显示在主标题下方，带强调色）
- `metrics`: 关键指标数组
  - `value`: 指标值
  - `label`: 指标标签
- `primaryAction`: 主要行动按钮
  - `text`: 按钮文字
  - `href`: 链接地址
  - `icon`: 按钮图标
- `secondaryAction`: 次要行动按钮
  - `text`: 按钮文字
  - `href`: 链接地址（可选）
  - `icon`: 按钮图标
  - `onClick`: 点击处理函数（当没有 href 时使用）
- `visualElement`: 自定义视觉元素（React 组件）
- `backgroundGradient`: 背景渐变类名
- `accentColor`: 强调色主题（"blue" | "red" | "green" | "purple"）

## 颜色主题

支持四种预设颜色主题：

- **blue**: 蓝色主题（默认）
- **red**: 红色主题（适合消防、安全类）
- **green**: 绿色主题（适合环保、智能家居类）
- **purple**: 紫色主题（适合高科技、AI类）

## 自定义视觉元素

为每个解决方案创建独特的视觉元素：

```tsx
const CustomVisual = () => (
  <div className='relative'>
    <div className='aspect-square rounded-3xl border border-blue-400/30 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 p-8 backdrop-blur-sm'>
      <div className='flex h-full items-center justify-center'>
        <div className='relative'>
          <div className='absolute inset-0 scale-150 animate-pulse rounded-full bg-blue-500/30 blur-3xl'></div>
          <YourIcon className='relative h-32 w-32 text-blue-400' />
        </div>
      </div>
    </div>

    {/* 状态指示器 */}
    <div className='absolute -right-4 -top-4 rounded-xl border border-green-400/30 bg-green-500/20 p-3 backdrop-blur-sm'>
      <CheckIcon className='h-6 w-6 text-green-400' />
    </div>
  </div>
)
```

## 已更新的页面

- ✅ `/solutions/server-room` - 机房智能管理
- ✅ `/solutions/chemical-fire` - 化工消防 (替代smart-fire)
- ✅ `/solutions/smart-apartment` - 智慧公寓
- ✅ `/solutions/residential-safety` - 住宅安全

## 待更新的页面

- `/solutions/smart-community` - 智慧社区
- `/solutions/smart-elderly` - 智慧养老
- `/solutions/smart-hotel` - 智慧酒店
- `/solutions/smart-patrol` - 智慧巡更
- `/solutions/vr-park` - VR 体验园

## 更新步骤

1. 导入 `SolutionHero` 组件
2. 创建自定义视觉元素组件
3. 替换现有的 hero section
4. 调整颜色主题和内容
5. 测试响应式效果

## 注意事项

- 保持内容简洁有力
- 指标数据要真实可信
- 视觉元素要与解决方案主题相关
- 确保在不同设备上的显示效果
- 保持与整体设计系统的一致性
