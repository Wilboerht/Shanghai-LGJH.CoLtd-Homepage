# 🚀 部署文件目录

## 📁 目录结构

```
deployment/
├── docker/                 # Docker 配置文件
│   ├── docker-compose.yml           # 标准 Docker Compose 配置
│   ├── docker-compose.production.yml # 生产环境配置
│   ├── docker-compose.simple.yml    # 简化配置
│   └── docker-compose.sqlite.yml    # SQLite 专用配置
├── scripts/                # 部署脚本
│   ├── deploy-docker.sh/.bat       # Docker 部署脚本
│   ├── deploy-local.sh/.bat        # 本地部署脚本
│   ├── quick-deploy.sh/.bat        # 快速部署脚本
│   ├── server-setup.sh             # 服务器环境安装脚本
│   ├── check-deployment.sh         # 部署检查脚本
│   └── package-for-server.sh/.bat  # 项目打包脚本
└── configs/                # 配置文件模板
    ├── nginx.conf.example          # Nginx 配置模板
    └── .env.production.example     # 生产环境变量模板
```

## 🚀 快速部署

### Docker 部署

```bash
cd deployment/scripts
./deploy-docker.sh
```

### 本地部署

```bash
cd deployment/scripts
./deploy-local.sh
```

## 📚 详细文档

请查看 `docs/deployment/` 目录中的详细部署文档。
