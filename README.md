# Conjugamos 官网（静态页）

一个基于 **Vite + TypeScript** 的极简静态站点，用于：
- 提供 APK 下载入口
- 跳转现有管理员后台
- 在页面底部做一次现有后端连通性检查（失败不影响按钮使用）

## 技术栈

- Vite
- TypeScript
- 原生 HTML/CSS/TS（无后端框架）

## 目录结构

```txt
conjugamos-official-site/
├── deploy/
│   └── nginx.conjugamos.conf
├── src/
│   ├── env.ts
│   ├── main.ts
│   ├── style.css
│   └── vite-env.d.ts
├── .env.example
├── index.html
├── package.json
├── README.md
└── tsconfig.json
```

## 环境变量

请复制 `.env.example` 为 `.env`，并按实际地址修改。

| 变量名 | 说明 | 示例 |
| --- | --- | --- |
| `VITE_SITE_TITLE` | 页面标题 | `Conjugamos` |
| `VITE_APK_DOWNLOAD_URL` | APK 下载地址（新服务器或 CDN） | `https://NEW_SERVER_OR_CDN/apk/latest.apk` |
| `VITE_ADMIN_URL` | 现有 admin 前端地址 | `https://OLD_SERVER/admin` |
| `VITE_BACKEND_PING_URL` | 现有后端版本/健康检查接口 | `https://OLD_SERVER/api/version` |
| `VITE_REQUEST_TIMEOUT_MS` | 连通性检查超时时间（毫秒） | `5000` |

`.env` 示例：

```env
VITE_SITE_TITLE=Conjugamos
VITE_APK_DOWNLOAD_URL=https://NEW_SERVER_OR_CDN/apk/latest.apk
VITE_ADMIN_URL=https://OLD_SERVER/admin
VITE_BACKEND_PING_URL=https://OLD_SERVER/api/version
VITE_REQUEST_TIMEOUT_MS=5000
```

## 本地启动步骤

1. 安装依赖：

```bash
npm install
```

2. 创建环境变量文件：

```bash
cp .env.example .env
```

3. 启动开发服务器：

```bash
npm run dev
```

默认访问地址通常为 `http://localhost:5173`。

## 生产构建步骤

```bash
npm run build
```

构建产物在 `dist/` 目录。

本地预览构建产物：

```bash
npm run preview
```

## 服务器上配置 .env 并构建

假设项目目录在 `/opt/conjugamos-official-site`：

1. 上传代码到服务器（git clone / rsync 均可）
2. 进入项目目录并安装依赖：

```bash
cd /opt/conjugamos-official-site
npm install
```

3. 配置 `.env`：

```bash
cp .env.example .env
# 然后编辑 .env，填入真实 URL
```

4. 执行构建：

```bash
npm run build
```

## 将 dist 部署到 Nginx（最小示例）

项目已提供示例配置文件：`deploy/nginx.conjugamos.conf`。

示例操作：

1. 将 `dist/` 发布到 Nginx 静态目录：

```bash
sudo mkdir -p /var/www/conjugamos-official-site
sudo rsync -av --delete dist/ /var/www/conjugamos-official-site/dist/
```

2. 启用 Nginx 配置：

```bash
sudo cp deploy/nginx.conjugamos.conf /etc/nginx/conf.d/conjugamos.conf
sudo nginx -t
sudo systemctl reload nginx
```

完成后即可通过服务器 IP 或临时 URL 访问。

## 页面行为说明

- 标题显示 `VITE_SITE_TITLE`
- “立即下载 APK”按钮：新窗口打开 `VITE_APK_DOWNLOAD_URL`
- “管理员后台”按钮：新窗口打开 `VITE_ADMIN_URL`
- 页面加载后会请求 `VITE_BACKEND_PING_URL`，底部展示：
  - `Connected to backend`
  - `Backend unreachable`
- 连通性失败不会影响两个按钮使用

## 常见问题

### 1) 为什么按钮可用但 backend 状态是 unreachable？

这是正常现象。两个按钮只是跳转链接，不依赖连通性检查结果。`unreachable` 表示前端请求 `VITE_BACKEND_PING_URL` 失败（可能超时、接口异常、CORS 等）。

### 2) CORS 会导致连通性检查失败吗？

会。即使接口在服务器可访问，只要浏览器跨域策略不允许该前端域名访问，前端 `fetch` 仍会失败并显示 `Backend unreachable`。

### 3) 如何替换为健康检查接口？

直接把 `.env` 中 `VITE_BACKEND_PING_URL` 改为你的健康检查地址（例如 `/health`），重新构建并发布 `dist/` 即可。
