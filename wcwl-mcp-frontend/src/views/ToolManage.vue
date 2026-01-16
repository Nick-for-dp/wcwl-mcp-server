<template>
  <div class="tool-manage">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>工具管理</span>
          <el-button type="primary" :icon="Refresh" @click="loadTools" :loading="loading">刷新</el-button>
        </div>
      </template>

      <!-- 筛选栏 -->
      <el-form :inline="true" style="margin-bottom: 16px">
        <el-form-item label="状态">
          <el-select v-model="filterStatus" placeholder="全部状态" clearable style="width: 140px">
            <el-option label="草稿" value="DRAFT" />
            <el-option label="待审核" value="PENDING_REVIEW" />
            <el-option label="已发布" value="PUBLISHED" />
            <el-option label="已下架" value="OFFLINE" />
            <el-option label="已拒绝" value="REJECTED" />
          </el-select>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="filterCategory" placeholder="全部分类" clearable style="width: 140px">
            <el-option label="内置" value="builtin" />
            <el-option label="数据查询" value="data_query" />
            <el-option label="仓库管理" value="warehouse" />
            <el-option label="贸易服务" value="trade" />
            <el-option label="其他" value="custom" />
          </el-select>
        </el-form-item>
        <el-form-item label="来源">
          <el-select v-model="filterSource" placeholder="全部来源" clearable style="width: 140px">
            <el-option label="内置工具" value="BUILTIN" />
            <el-option label="动态注册" value="DYNAMIC" />
          </el-select>
        </el-form-item>
      </el-form>

      <el-table :data="filteredTools" v-loading="loading" stripe>
        <el-table-column prop="name" label="工具名称" width="200">
          <template #default="{ row }">
            <el-tag>{{ row.name }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" min-width="200" show-overflow-tooltip />
        <el-table-column prop="category" label="分类" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.statusDisplay }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="sourceType" label="来源" width="100">
          <template #default="{ row }">
            <span>{{ row.sourceType === 'BUILTIN' ? '内置' : '动态' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createdBy" label="创建人" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="170">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <template v-if="row.status !== 'PUBLISHED'">
              <el-button size="small" type="success" @click="handlePublish(row)">上架</el-button>
            </template>
            <template v-if="row.status === 'PUBLISHED'">
              <el-button size="small" type="warning" @click="handleOffline(row)">下架</el-button>
            </template>
            <el-button 
              size="small" 
              type="danger" 
              @click="handleDelete(row)"
              :disabled="row.sourceType === 'BUILTIN'"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Refresh } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { adminApi } from '@/api'
import type { ToolInfo } from '@/types'

const tools = ref<ToolInfo[]>([])
const loading = ref(false)
const filterStatus = ref('')
const filterCategory = ref('')
const filterSource = ref('')

const filteredTools = computed(() => {
  return tools.value.filter(tool => {
    if (filterStatus.value && tool.status !== filterStatus.value) return false
    if (filterCategory.value && tool.category !== filterCategory.value) return false
    if (filterSource.value && tool.sourceType !== filterSource.value) return false
    return true
  })
})

function getStatusType(status: string) {
  const map: Record<string, string> = {
    DRAFT: 'info',
    PENDING_REVIEW: 'warning',
    PUBLISHED: 'success',
    OFFLINE: 'danger',
    REJECTED: 'danger'
  }
  return map[status] || 'info'
}

function formatTime(timeStr: string) {
  if (!timeStr) return ''
  return timeStr.replace('T', ' ').substring(0, 19)
}

async function loadTools() {
  loading.value = true
  try {
    const { data } = await adminApi.listTools()
    tools.value = data.tools
  } catch {
    ElMessage.error('加载工具列表失败')
  } finally {
    loading.value = false
  }
}

async function handlePublish(tool: ToolInfo) {
  try {
    await ElMessageBox.confirm(
      `确定要上架工具 "${tool.name}" 吗？上架后用户可以使用该工具。`,
      '确认上架',
      { type: 'warning' }
    )
    await adminApi.publishTool(tool.name)
    ElMessage.success('上架成功')
    loadTools()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('上架失败')
    }
  }
}

async function handleOffline(tool: ToolInfo) {
  try {
    await ElMessageBox.confirm(
      `确定要下架工具 "${tool.name}" 吗？下架后用户将无法使用该工具。`,
      '确认下架',
      { type: 'warning' }
    )
    await adminApi.offlineTool(tool.name)
    ElMessage.success('下架成功')
    loadTools()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('下架失败')
    }
  }
}

async function handleDelete(tool: ToolInfo) {
  try {
    await ElMessageBox.confirm(
      `确定要删除工具 "${tool.name}" 吗？此操作不可恢复。`,
      '确认删除',
      { type: 'error' }
    )
    await adminApi.unregisterTool(tool.name)
    ElMessage.success('删除成功')
    loadTools()
  } catch (err) {
    if (err !== 'cancel') {
      ElMessage.error('删除失败')
    }
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
</style>
