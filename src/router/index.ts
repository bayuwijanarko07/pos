import { createRouter, createWebHistory } from 'vue-router'
import { supabase } from '@/lib/supabase'

const routes = [
  { 
    path: '/', 
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { layout: 'default', requiresAuth: true }
  },
  { 
    path: '/orders', 
    component: () => import('@/pages/OrdersPage.vue'),
    meta: { layout: 'default', requiresAuth: true }
  },
  { 
    path: '/products', 
    component: () => import('@/pages/ProductsPage.vue'),
    meta: { layout: 'default', requiresAuth: true }
  },
  { 
    path: '/user',
    component: () => import('@/pages/UserPage.vue'),
    meta: { layout: 'default', requiresAuth: true }
  },
  { 
    path: '/settings', 
    component: () => import('@/pages/SettingsPage.vue'),
    meta: { layout: 'default', requiresAuth: true }
  },
  { 
    path: '/login', 
    component: () => import('@/pages/LoginPage.vue'),
    meta: { layout: 'auth', requiresAuth: false }
  },
  {
    path: '/:pathMatch(.*)*',
    component: () => import('@/pages/NotFoundPage.vue'),
    meta: { layout: 'auth', requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to) => {
  const { data } = await supabase.auth.getSession()
  const session = data.session

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (to.matched.length === 0) {
    return session ? '/dashboard' : '/login'
  }

  if (requiresAuth && !session) {
    return '/login'
  }

  if (session && to.path === '/login') {
    return '/'
  }

  return true
})

export default router