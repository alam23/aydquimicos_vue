import { createRouter, createWebHistory } from 'vue-router'

import store from '../store'

import Home from '../views/Home.vue'

import Producto from '../views/Producto.vue'
import Categoria from '../views/Categoria.vue'
import Busqueda from '../views/Busqueda.vue'
import Cart from '../views/Cart.vue'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import MiCuenta from '../views/MiCuenta.vue'
import Checkout from '../views/Checkout.vue'
import ProcesoExitoso from '../views/ProcesoExitoso.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/sign-up',
    name: 'SignUp',
    component: SignUp
  },
  {
    path: '/log-in',
    name: 'Login',
    component: Login
  },
  {
    path: '/mi-cuenta',
    name: 'MiCuenta',
    component: MiCuenta,
    meta: {
        requireLogin: true
    }
  },
  {
    path: '/busqueda',
    name: 'Busqueda',
    component: Busqueda
  },
  {
    path: '/cart',
    name: 'Cart',
    component: Cart
  },
  {
    path: '/cart/proceso-exitoso',
    name: 'ProcesoExitoso',
    component: ProcesoExitoso
  },
  {
    path: '/cart/checkout',
    name: 'Checkout',
    component: Checkout,
    meta: {
        requireLogin: true
    }
  },
  {
    path: '/:categoria_slug/:producto_slug',
    name: 'Producto',
    component: Producto    
  },
  {
    path: '/:categoria_slug',
    name: 'Categoria',
    component: Categoria
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requireLogin) && !store.state.isAuthenticated) {
    next({ name: 'LogIn', query: { to: to.path } });
  } else {
    next()
  }
})

export default router
