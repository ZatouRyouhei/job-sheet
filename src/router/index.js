import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './../store'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

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
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
    meta: {
      isRequestAuth: true
    }
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
    meta: {
      isRequestAuth: true
    },
    children: [
      {
        path: 'table/user',
        name: 'User',
        component: () => import('../views/User.vue')
      },
      {
        path: 'table/business',
        name: 'Business',
        component: () => import('../views/Business.vue')
      },
      {
        path: 'table/system',
        name: 'System',
        component: () => import('../views/System.vue')
      },
      {
        path: 'stats',
        name: 'Stats',
        component: () => import('../views/Stats.vue')
      },
      {
        path: 'userSeq',
        name: 'UserSeq',
        component: () => import('../views/UserSeq.vue')
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

let isAuthed = function() {
  return store.getters.isAuth
}

router.beforeEach((to, from, next) => {
  if (to.matched.some(route => route.meta.isRequestAuth)
      && !isAuthed()) {
        next({ path: '/', query: { path: to.fullPath }})
      } else {
        next()
      }
});

export default router
