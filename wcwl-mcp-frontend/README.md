# WCWL MCP Gateway 前端

基于 Vue 3 + TypeScript + Element Plus 构建的 MCP Gateway 管理界面。

## 技术栈

- Vue 3 + Composition API
- TypeScript
- Vite
- Pinia (状态管理)
- Vue Router
- Element Plus (UI组件库)
- Axios (HTTP客户端)

## 项目结构

```
src/
├── api/index.ts              # API封装（认证、MCP工具、管理接口）
├── layouts/MainLayout.vue    # 主布局（侧边栏+顶部导航）
├── router/index.ts           # 路由配置（含权限守卫）
├── stores/user.ts            # 用户状态管理
├── types/index.ts            # TypeScript类型定义
├── views/
│   ├── Login.vue             # 登录页面
│   ├── ToolList.vue          # MCP工具列表页面
│   └── ToolRegister.vue      # 工具注册页面（仅Admin）
├── App.vue
└── main.ts
```

## 页面说明

### 1. 登录页面 (`/login`)

- 用户名/密码表单验证
- 显示演示账号信息
- 登录成功后自动跳转到工具列表

**演示账号：**
| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 普通用户 | user | user123 |

### 2. MCP工具列表 (`/tools`)

- 展示所有已注册的MCP工具
- 查看工具详情（名称、描述、inputSchema）
- 执行工具：输入JSON参数，查看返回结果

### 3. 工具注册页面 (`/register`)

> 仅 Admin 角色可访问

- 填写工具基本信息：名称、描述、服务端点、请求方法
- 动态添加参数定义：名称、类型、是否必填、描述
- 设置请求超时时间

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

开发服务器运行在 `http://localhost:3000`，自动代理 `/api` 请求到后端 `http://localhost:8080`。

## 后端API对接

| 前端路径 | 后端API | 说明 |
|---------|---------|------|
| /api/auth/login | POST /auth/login | 用户登录 |
| /api/mcp/manifest | GET /mcp/manifest | 获取工具清单 |
| /api/mcp/tools/{name} | POST /mcp/tools/{name} | 执行工具 |
| /api/admin/tools | GET /admin/tools | 获取工具列表 |
| /api/admin/tools/register | POST /admin/tools/register | 注册工具 |
| /api/admin/tools/{name} | DELETE /admin/tools/{name} | 注销工具 |
