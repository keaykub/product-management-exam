import { createRouter, createWebHistory } from 'vue-router'
import ProductDashboard from '../views/Product.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: ProductDashboard
  },
  {
    path: '/products',
    name: 'Products',
    component: ProductDashboard
  },
  {
    path: '/categories',
    name: 'Categories',
    component: () => import('../views/Categories.vue')
  },
  {
    path: '/categories/create',
    name: 'CreateCategory',
    component: () => import('../views/CreateCategory.vue')
  },
  {
    path: '/category/:id',
    name: 'CategoryPreview',
    component: () => import('../views/CategoryPreview.vue')
  },
  {
    path: '/categories/edit/:id',
    name: 'CategoryEdit',
    component: () => import('../views/CategoryEdit.vue')
  },
  {
    path: '/products/create',
    name: 'CreateProduct',
    component: () => import('../views/CreateProduct.vue')
  },
  {
    path: '/product/:id',
    name: 'ProductPreview',
    component: () => import('../views/ProductPreview.vue')
  },
  {
    path: '/products/edit/:id',
    name: 'ProductEdit',
    component: () => import('../views/ProductEdit.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router