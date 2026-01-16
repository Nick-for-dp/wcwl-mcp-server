# WCWL MCP Server

MCP（Model Context Protocol）工具网关平台，提供统一的工具注册、发现和执行能力。

## 项目结构

```
wcwl-mcp-server/
├── wcwl-mcp-gateway/     # 后端服务 (Spring Boot)
└── wcwl-mcp-frontend/    # 前端界面 (Vue 3)
```

## 快速开始

### 1. 启动后端

```bash
cd wcwl-mcp-gateway
mvn spring-boot:run
```

后端运行在 http://localhost:8080

### 2. 启动前端

```bash
cd wcwl-mcp-frontend
npm install
npm run dev
```

前端运行在 http://localhost:3000

### 3. 访问系统

打开浏览器访问 http://localhost:3000

测试账号：
| 角色 | 用户名 | 密码 |
|------|--------|------|
| 管理员 | admin | admin123 |
| 普通用户 | user | user123 |

## 主要功能

- 用户登录认证（JWT）
- MCP工具列表查看
- MCP工具执行
- 动态注册工具（管理员）
- 工具注销（管理员）

## 技术栈

**后端：** Spring Boot 3.2 + Spring Security + JWT

**前端：** Vue 3 + TypeScript + Element Plus + Vite

## 详细文档

- [后端文档](wcwl-mcp-gateway/README.md)
- [前端文档](wcwl-mcp-frontend/README.md)
