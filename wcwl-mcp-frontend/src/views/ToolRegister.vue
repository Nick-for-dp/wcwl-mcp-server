<template>
  <div class="tool-register">
    <el-card>
      <template #header>
        <span>注册新工具</span>
      </template>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="120px" style="max-width: 800px">
        <el-form-item label="工具名称" prop="name">
          <el-input v-model="form.name" placeholder="如: query_trade_data (小写字母、数字、下划线)" />
        </el-form-item>

        <el-form-item label="描述" prop="description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="工具功能描述" />
        </el-form-item>

        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="选择工具分类" style="width: 200px">
            <el-option label="数据查询" value="data_query" />
            <el-option label="仓库管理" value="warehouse" />
            <el-option label="贸易服务" value="trade" />
            <el-option label="系统工具" value="system" />
            <el-option label="其他" value="custom" />
          </el-select>
        </el-form-item>

        <el-form-item label="服务端点" prop="endpoint">
          <el-input v-model="form.endpoint" placeholder="http://api.example.com/path" />
        </el-form-item>

        <el-form-item label="请求方法" prop="method">
          <el-select v-model="form.method" style="width: 120px">
            <el-option label="POST" value="POST" />
            <el-option label="GET" value="GET" />
            <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" />
          </el-select>
        </el-form-item>

        <el-form-item label="超时时间">
          <el-input-number v-model="form.timeout" :min="1000" :max="300000" :step="1000" />
          <span style="margin-left: 8px; color: #909399">毫秒</span>
        </el-form-item>

        <el-divider>参数定义</el-divider>

        <div v-for="(param, index) in form.params" :key="index" class="param-row">
          <el-row :gutter="12">
            <el-col :span="5">
              <el-input v-model="param.name" placeholder="参数名" />
            </el-col>
            <el-col :span="4">
              <el-select v-model="param.type">
                <el-option label="string" value="string" />
                <el-option label="integer" value="integer" />
                <el-option label="number" value="number" />
                <el-option label="boolean" value="boolean" />
              </el-select>
            </el-col>
            <el-col :span="8">
              <el-input v-model="param.description" placeholder="参数描述" />
            </el-col>
            <el-col :span="3">
              <el-checkbox v-model="param.required">必填</el-checkbox>
            </el-col>
            <el-col :span="4">
              <el-button type="danger" :icon="Delete" @click="removeParam(index)" />
            </el-col>
          </el-row>
        </div>

        <el-button type="dashed" style="width: 100%; margin-bottom: 20px" @click="addParam">
          <el-icon><Plus /></el-icon> 添加参数
        </el-button>

        <el-form-item>
          <el-button type="primary" :loading="loading" @click="handleSubmit">注册工具</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { adminApi } from '@/api'
import type { ToolRegisterRequest, ParamDefinition } from '@/types'

const formRef = ref<FormInstance>()
const loading = ref(false)

const createEmptyParam = (): ParamDefinition => ({
  name: '',
  type: 'string',
  required: false,
  description: ''
})

const form = reactive<ToolRegisterRequest>({
  name: '',
  description: '',
  endpoint: '',
  method: 'POST',
  params: [createEmptyParam()],
  timeout: 30000,
  category: 'custom'
})

const rules: FormRules<ToolRegisterRequest> = {
  name: [
    { required: true, message: '请输入工具名称', trigger: 'blur' },
    { pattern: /^[a-z][a-z0-9_]*$/, message: '只能包含小写字母、数字和下划线，且以字母开头', trigger: 'blur' }
  ],
  description: [{ required: true, message: '请输入描述', trigger: 'blur' }],
  endpoint: [
    { required: true, message: '请输入服务端点', trigger: 'blur' },
    { pattern: /^https?:\/\//, message: '必须是有效的HTTP/HTTPS URL', trigger: 'blur' }
  ]
}

function addParam() {
  form.params.push(createEmptyParam())
}

function removeParam(index: number) {
  form.params.splice(index, 1)
}

function resetForm() {
  formRef.value?.resetFields()
  form.params = [createEmptyParam()]
}

async function handleSubmit() {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 过滤空参数
  const params = form.params.filter(p => p.name.trim())

  loading.value = true
  try {
    await adminApi.registerTool({ ...form, params })
    ElMessage.success('工具注册成功')
    resetForm()
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    ElMessage.error(error.response?.data?.message || '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.param-row {
  margin-bottom: 12px;
}
</style>
