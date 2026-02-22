import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { 
    path: '/', 
    component: () => import('@/pages/DashboardPage.vue'),
    meta: { layout: 'default' }
  },
  { 
    path: '/orders', 
    component: () => import('@/pages/OrdersPage.vue'),
    meta: { layout: 'default' }
  },
  { 
    path: '/products', 
    component: () => import('@/pages/ProductsPage.vue'),
    meta: { layout: 'default' }
  },
  { 
    path: '/login', 
    component: () => import('@/pages/LoginPage.vue'),
    meta: { layout: 'auth' }
  },
]

export default createRouter({
  history: createWebHistory(),
  routes
})