import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { UserInfo } from '@/types'

export const useUserStore = defineStore('user', () => {
  const userInfo = ref<UserInfo | null>(null)

  const isLoggedIn = computed(() => !!userInfo.value)
  const isAdmin = computed(() => userInfo.value?.roles.includes('ADMIN') ?? false)
  const username = computed(() => userInfo.value?.username ?? '')

  function setUser(info: UserInfo) {
    userInfo.value = info
    localStorage.setItem('token', info.token)
    localStorage.setItem('userInfo', JSON.stringify(info))
  }

  function logout() {
    userInfo.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('userInfo')
  }

  function initFromStorage() {
    const stored = localStorage.getItem('userInfo')
    if (stored) {
      try {
        userInfo.value = JSON.parse(stored)
      } catch {
        logout()
      }
    }
  }

  return { userInfo, isLoggedIn, isAdmin, username, setUser, logout, initFromStorage }
})
