# 业务类别图片

此目录包含业务类别展示所需的图片文件。

## 图片要求

### 尺寸规格

- **推荐尺寸**: 800x600 像素 (4:3 比例)
- **最小尺寸**: 600x450 像素
- **最大文件大小**: 500KB

### 图片格式

- **支持格式**: JPG, PNG, WebP
- **推荐格式**: JPG (适合照片) 或 PNG (适合图标/插图)

### 图片内容建议

1. **intelligent-system.jpg** - 智能化弱电系统
   - 弱电机房、网络设备、智能化控制系统等

2. **fire-engineering.jpg** - 消防工程
   - 消防设备、喷淋系统、消防控制室等

3. **intelligent-products.jpg** - 智能化产品
   - 管理平台界面、数据中心、边缘计算设备等

4. **smart-services.jpg** - 智能管家服务
   - 运维团队、现场巡检、设备维护等

5. **risk-assessment.jpg** - 风险评估服务
   - 风险评估报告、专业审核、评估现场等

### 图片优化建议

1. **压缩图片**: 使用工具如 TinyPNG 或 ImageOptim 压缩
2. **统一风格**: 保持图片色调和风格一致性
3. **清晰度**: 确保图片清晰，避免模糊
4. **专业性**: 选择专业、高质量的图片

### 示例文件结构

```
public/images/business/
├── intelligent-system.jpg
├── fire-engineering.jpg
├── intelligent-products.jpg
├── smart-services.jpg
└── risk-assessment.jpg
```

### 备用方案

如果某个业务类别图片暂时不可用，组件会显示带有相应图标的渐变背景作为占位符。您可以随时添加或更新业务图片。

### 更新业务信息

如需修改业务类别的标题、描述或特性，请编辑 `src/components/sections/business-categories.tsx` 文件中的 `businessCategories` 数组。
