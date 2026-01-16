<template>
  <el-container class="layout-container">
    <el-header class="header">
      <div class="logo">
        <el-icon><Connection /></el-icon>
        <span>WCWL MCP Gateway</span>
      </div>
      <div class="header-right">
        <el-dropdown @command="handleCommand">
          <span class="user-info">
            <el-icon><User /></el-icon>
            {{ userStore.username }}
            <el-tag v-if="userStore.isAdmin" size="small" type="danger">Admin</el-tag>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </el-header>
    
    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu :default-active="route.path" router>
          <el-menu-item index="/tools">
            <el-icon><List /></el-icon>
            <span>工具列表</span>
          </el-menu-item>
          <el-menu-item v-if="userStore.isAdmin" index="/register">
            <el-icon><Plus /></el-icon>
            <span>注册工具</span>
          </el-menu-item>
        </el-menu>
      </el-aside>
      
      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

function handleCommand(command: string) {
  if (command === 'logout') {
    userStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100%;
}

.header {
  background: #409eff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  cursor: pointer;
}

.aside {
  background: #f5f7fa;
  border-right: 1px solid #e4e7ed;
}

.main {
  background: #f0f2f5;
  padding: 20px;
}
</style>
