import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue')
    },
    {
      path: '/',
      component: () => import('@/layouts/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/tools'
        },
        {
          path: 'tools',
          name: 'ToolList',
          component: () => import('@/views/ToolList.vue')
        },
        {
          path: 'register',
          name: 'ToolRegister',
          component: () => import('@/views/ToolRegister.vue'),
          meta: { requiresAdmin: true }
        },
        {
          path: 'manage',
          name: 'ToolManage',
          component: () => import('@/views/ToolManage.vue'),
          meta: { requiresAdmin: true }
        }
      ]
    }
  ]
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  userStore.initFromStorage()

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next('/login')
  } else if (to.meta.requiresAdmin && !userStore.isAdmin) {
    next('/tools')
  } else if (to.path === '/login' && userStore.isLoggedIn) {
    next('/tools')
  } else {
    next()
  }
})

export default router
