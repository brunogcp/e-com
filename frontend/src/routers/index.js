import {createRouter, createWebHistory} from 'vue-router'

import ProductsView from '../views/ProductsView.vue'
import ProductDetail from '../views/ProductDetail.vue'
import { store } from '../store'

const routes = [
  { 
    path: '/', 
    name: 'Home',
    component: ProductsView,
    meta: { 
      breadcrumbs: [
        { name: 'home', router: 'Home' }
      ]
    }
  },
  { 
    path: '/products', 
    name: 'Products',
    component: ProductsView,
    meta: { 
      requiresAuth: true,
      breadcrumbs: [
        { name: 'home', router: 'Home' },
        { name: 'produtos' }
      ]
    }
  },
  { 
    path: '/product/:id', 
    name: 'Products-Detail',
    component: ProductDetail,
    meta: { 
      requiresAuth: true,
      breadcrumbs: [
        { name: 'home', router: 'Home' },
        { name: 'produtos', router: 'Products' },
        { name: 'detalhes' }
      ]
    }
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  
  const cart = localStorage.getItem('cart')
  if (cart) {
    store.commit('SET_CART', JSON.parse(cart))
  }
  const token = sessionStorage.getItem('token')
  if (token) {
    const name = sessionStorage.getItem('name')
    const isAdmin = sessionStorage.getItem('isAdmin')
    store.commit('SET_USER', { name, token, isAdmin })
    store.commit('isUserLoggedIn', true);
  }
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: 'Home' });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router