<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <el-icon size="32"><Connection /></el-icon>
          <h2>WCWL MCP Gateway</h2>
        </div>
      </template>
      
      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" @submit.prevent="handleLogin">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" size="large">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password>
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item>
          <el-button type="primary" size="large" :loading="loading" native-type="submit" style="width: 100%">
            登录
          </el-button>
        </el-form-item>
      </el-form>
      
      <div class="demo-users">
        <el-divider>演示账号</el-divider>
        <el-descriptions :column="1" size="small" border>
          <el-descriptions-item label="管理员">admin / admin123</el-descriptions-item>
          <el-descriptions-item label="普通用户">user / user123</el-descriptions-item>
        </el-descriptions>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { authApi } from '@/api'
import { useUserStore } from '@/stores/user'
import type { LoginForm } from '@/types'

const router = useRouter()
const userStore = useUserStore()
const formRef = ref<FormInstance>()
const loading = ref(false)

const form = reactive<LoginForm>({
  username: '',
  password: ''
})

const rules: FormRules<LoginForm> = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
}

async function handleLogin() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  loading.value = true
  try {
    const userInfo = await authApi.login(form)
    userStore.setUser(userInfo)
    ElMessage.success('登录成功')
    router.push('/tools')
  } catch (err: unknown) {
    ElMessage.error(err instanceof Error ? err.message : '登录失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-card {
  width: 400px;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #409eff;
}

.card-header h2 {
  margin: 0;
  font-size: 20px;
}

.demo-users {
  margin-top: 20px;
}
</style>
