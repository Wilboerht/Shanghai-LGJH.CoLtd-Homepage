# 企业资质证书图片

## 图片要求

请将您的企业资质证书图片放置在此目录中，并按以下要求命名：

### 文件命名规范

- `cmmi5.jpg` - CMMI5认证证书
- `iso9001.jpg` - ISO9001质量管理体系认证
- `iso20000.jpg` - ISO20000信息技术服务管理体系认证
- `iso27001.jpg` - ISO27001信息安全管理体系认证
- `iso27017.jpg` - ISO27017云服务信息安全管理体系认证
- `iso27018.jpg` - ISO27018公有云个人信息保护认证
- `iso27701.jpg` - ISO27701隐私信息管理体系认证
- `publishing-license.jpg` - 出版物经营许可证
- `broadcasting-license.jpg` - 广播电视节目制作经营许可证
- `high-tech-enterprise.jpg` - 国家高新技术企业认定证书
- `credit-rating.jpg` - 企业信用等级证书
- `data-management.jpg` - 数据管理能力成熟度评估证书

### 图片规格建议

- **格式**: JPG, PNG, WebP
- **分辨率**: 建议 800x600 或更高
- **宽高比**: 4:3 或 3:4 (证书通常为竖版)
- **文件大小**: 建议小于 2MB
- **质量**: 清晰可读，确保证书内容清楚可见

### 图片优化建议

1. **压缩图片**: 使用工具如 TinyPNG 或 ImageOptim 压缩
2. **统一尺寸**: 保持证书图片尺寸一致性
3. **清晰度**: 确保证书文字和印章清晰可见
4. **背景**: 建议使用白色或浅色背景

### 示例文件结构

```
public/images/certificates/
├── cmmi5.jpg
├── iso9001.jpg
├── iso20000.jpg
├── iso27001.jpg
├── iso27017.jpg
├── iso27018.jpg
├── iso27701.jpg
├── publishing-license.jpg
├── broadcasting-license.jpg
├── high-tech-enterprise.jpg
├── credit-rating.jpg
└── data-management.jpg
```

### 备用方案

如果某个证书图片暂时不可用，组件会显示占位符图片。您可以随时添加或更新证书图片。

### 更新证书信息

如需修改证书标题、描述或分类，请编辑 `src/components/sections/qualifications.tsx` 文件中的 `qualifications` 数组。
