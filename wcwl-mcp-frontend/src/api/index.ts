import axios from 'axios'
import type { LoginForm, ManifestResponse, ToolRegisterRequest, ToolListResponse } from '@/types'
import { useUserStore } from '@/stores/user'
import router from '@/router'

const api = axios.create({
  baseURL: '/api',
  timeout: 30000
})

// 请求拦截器：添加JWT Token
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：处理401错误
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      const userStore = useUserStore()
      userStore.logout()
      router.push('/login')
    }
    return Promise.reject(error)
  }
)

// 认证API
export const authApi = {
  // 调用后端登录接口
  login: async (form: LoginForm) => {
    const { data } = await api.post<{
      success: boolean
      token: string
      username: string
      roles: string[]
      message?: string
    }>('/auth/login', form)
    
    if (!data.success) {
      throw new Error(data.message || '登录失败')
    }
    
    return { username: data.username, roles: data.roles, token: data.token }
  }
}

// MCP工具API
export const mcpApi = {
  // 获取工具清单
  getManifest: () => api.get<ManifestResponse>('/mcp/manifest'),
  
  // 执行工具
  executeTool: (toolName: string, args: Record<string, unknown>) => 
    api.post(`/mcp/tools/${toolName}`, args)
}

// 管理API（需要ADMIN角色）
export const adminApi = {
  // 获取工具列表
  listTools: () => api.get<ToolListResponse>('/admin/tools'),
  
  // 注册工具
  registerTool: (data: ToolRegisterRequest) => api.post('/admin/tools/register', data),
  
  // 注销工具
  unregisterTool: (name: string) => api.delete(`/admin/tools/${name}`),

  // 上架工具
  publishTool: (name: string) => api.post(`/admin/tools/${name}/publish`),

  // 下架工具
  offlineTool: (name: string) => api.post(`/admin/tools/${name}/offline`)
}

export default api
