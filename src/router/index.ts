import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    { path: '/', redirect: '/cashier' },
    { path: '/cashier', component: () => import('@/pages/CashierPage.vue') },
    { path: '/products', component: () => import('@/pages/ProductsPage.vue') },
    { path: '/report', component: () => import('@/pages/ReportPage.vue')}
]

export default createRouter({
  history: createWebHistory(),
  routes
})