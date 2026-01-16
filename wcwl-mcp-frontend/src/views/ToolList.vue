<template>
  <div class="tool-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>MCP 工具列表</span>
          <el-button type="primary" :icon="Refresh" @click="loadTools" :loading="loading">刷新</el-button>
        </div>
      </template>

      <el-table :data="tools" v-loading="loading" stripe>
        <el-table-column prop="name" label="工具名称" width="250">
          <template #default="{ row }">
            <el-tag>{{ row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="showDetail(row)">查看详情</el-button>
            <el-button size="small" type="primary" @click="showExecute(row)">执行</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 详情对话框 -->
    <el-dialog v-model="detailVisible" title="工具详情" width="600px">
      <el-descriptions v-if="selectedTool" :column="1" border>
        <el-descriptions-item label="名称">{{ selectedTool.name }}</el-descriptions-item>
        <el-descriptions-item label="描述">{{ selectedTool.description }}</el-descriptions-item>
        <el-descriptions-item label="输入参数Schema">
          <pre class="schema-preview">{{ JSON.stringify(selectedTool.inputSchema, null, 2) }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>

    <!-- 执行对话框 -->
    <el-dialog v-model="executeVisible" title="执行工具" width="600px">
      <template v-if="selectedTool">
        <el-alert type="info" :closable="false" style="margin-bottom: 16px">
          工具: <strong>{{ selectedTool.name }}</strong>
        </el-alert>
        
        <el-form label-position="top">
          <el-form-item label="输入参数 (JSON)">
            <el-input v-model="executeArgs" type="textarea" :rows="6" placeholder='{"key": "value"}' />
          </el-form-item>
        </el-form>

        <el-divider v-if="executeResult">执行结果</el-divider>
        <pre v-if="executeResult" class="result-preview">{{ executeResult }}</pre>
      </template>
      
      <template #footer>
        <el-button @click="executeVisible = false">关闭</el-button>
        <el-button type="primary" :loading="executing" @click="executeTool">执行</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { mcpApi } from '@/api'
import type { ToolDefinition } from '@/types'

const tools = ref<ToolDefinition[]>([])
const loading = ref(false)
const selectedTool = ref<ToolDefinition | null>(null)
const detailVisible = ref(false)
const executeVisible = ref(false)
const executeArgs = ref('{}')
const executeResult = ref('')
const executing = ref(false)

async function loadTools() {
  loading.value = true
  try {
    const { data } = await mcpApi.getManifest()
    tools.value = data.tools
  } catch {
    ElMessage.error('加载工具列表失败')
  } finally {
    loading.value = false
  }
}

function showDetail(tool: ToolDefinition) {
  selectedTool.value = tool
  detailVisible.value = true
}

function showExecute(tool: ToolDefinition) {
  selectedTool.value = tool
  executeArgs.value = '{}'
  executeResult.value = ''
  executeVisible.value = true
}

async function executeTool() {
  if (!selectedTool.value) return

  let args: Record<string, unknown>
  try {
    args = JSON.parse(executeArgs.value)
  } catch {
    ElMessage.error('参数格式错误，请输入有效的JSON')
    return
  }

  executing.value = true
  try {
    const { data } = await mcpApi.executeTool(selectedTool.value.name, args)
    executeResult.value = JSON.stringify(data, null, 2)
    ElMessage.success('执行成功')
  } catch (err: unknown) {
    const error = err as { response?: { data?: { message?: string } } }
    executeResult.value = JSON.stringify(error.response?.data || '执行失败', null, 2)
    ElMessage.error('执行失败')
  } finally {
    executing.value = false
  }
}

onMounted(loadTools)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.schema-preview, .result-preview {
  background: #f5f7fa;
  padding: 12px;
  border-radius: 4px;
  font-size: 12px;
  overflow: auto;
  max-height: 300px;
  margin: 0;
}
</style>
