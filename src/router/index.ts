import { createRouter, createWebHistory } from 'vue-router'

import CashierPage from '@/pages/CashierPage.vue'
import ReportPage from '@/pages/ReportPage.vue'
import ProductsPage from '@/pages/ProductsPage.vue'

const routes = [
    {
        path: '/',
        redirect: '/cashier'
    },
    {
        path: '/cashier',
        name: 'Cashier',
        component: CashierPage
    },
    {
        path: '/products',
        name: 'Products',
        component: ProductsPage
    },
    {
        path: '/report',
        name: 'Report',
        component: ReportPage
    },
]

export default createRouter({
  history: createWebHistory(),
  routes
})