# 数字动画组件使用说明

## 概述

本项目包含了专为临港景鸿网站设计的数字动画组件，实现了老虎机式的数字翻滚效果。

## 组件列表

### 1. AnimatedNumber

基础数字动画组件，支持从0到目标值的平滑动画。

```tsx
<AnimatedNumber
  value={100}
  duration={2000}
  decimals={0}
  suffix='+'
  prefix='第'
  className='text-4xl font-bold'
/>
```

### 2. SlotMachineNumber

老虎机式数字翻滚组件，每个数字位独立动画。

```tsx
<SlotMachineNumber value='123' delay={500} duration={2000} className='text-4xl font-bold' />
```

### 3. EnhancedAnimatedStat

完整的统计数据展示组件，包含数字动画和标签。

```tsx
<EnhancedAnimatedStat value='5.2亿' label='年度营收 (2024)' delay={0.1} className='ranking-stat' />
```

## 特性

- **视觉滚动效果**: 数字从随机值逐渐收敛到目标值
- **性能优化**: 根据设备性能自动调整动画复杂度
- **响应式设计**: 支持不同屏幕尺寸
- **可访问性**: 支持减少动画偏好设置
- **自定义样式**: 支持排名统计的特殊样式

## 动画时机

- 动画在元素进入视口时触发
- 使用 `once: true` 确保动画只播放一次
- 支持延迟触发，创建连续动画效果

## 性能考虑

- 自动检测设备性能并调整动画参数
- 使用 `requestAnimationFrame` 确保流畅动画
- 在组件卸载时清理定时器和动画帧

## 样式定制

### 普通统计数据

- 字体大小: `text-3xl md:text-4xl`
- 颜色: `text-red-600`

### 排名统计数据

- 字体大小: `text-2xl md:text-3xl`
- 数字部分: `text-3xl md:text-4xl`
- 特殊类名: `ranking-stat`

## 使用示例

```tsx
// 在 features.tsx 中的使用
<div className='mb-12 grid grid-cols-2 gap-8 md:grid-cols-5'>
  <EnhancedAnimatedStat value='5.2亿' label='年度营收 (2024)' delay={0.1} />

  <EnhancedAnimatedStat
    value='第86位'
    label='《财富》中国上市公司<br />500强(2024)'
    delay={0.6}
    className='ranking-stat'
  />
</div>
```

## 注意事项

1. 确保在使用前导入正确的组件
2. 延迟时间建议递增，创建波浪式动画效果
3. 排名统计需要添加 `ranking-stat` 类名
4. 支持 HTML 标签在 label 中使用 `<br />` 换行
