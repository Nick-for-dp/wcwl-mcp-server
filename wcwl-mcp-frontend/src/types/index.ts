// 用户相关类型
export interface LoginForm {
  username: string
  password: string
}

export interface UserInfo {
  username: string
  roles: string[]
  token: string
}

// MCP工具相关类型
export interface ToolDefinition {
  name: string
  description: string
  inputSchema?: Record<string, unknown>
}

export interface ParamDefinition {
  name: string
  type: 'string' | 'integer' | 'number' | 'boolean' | 'array' | 'object'
  required: boolean
  description: string
  defaultValue?: unknown
}

export interface ToolRegisterRequest {
  name: string
  description: string
  endpoint: string
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  params: ParamDefinition[]
  headers?: Record<string, string>
  timeout?: number
  requiredRoles?: string[]
}

// API响应类型
export interface ApiResponse<T = unknown> {
  result?: T
  error?: string
  message?: string
  code?: number
}

export interface ManifestResponse {
  tools: ToolDefinition[]
}

export interface ToolListResponse {
  count: number
  tools: { name: string; description: string }[]
}
