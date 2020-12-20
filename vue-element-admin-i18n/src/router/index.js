import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/complex-table'),
        name: 'ComplexTable',
        meta: { title: '预约管理', icon: 'el-icon-s-check', affix: false }
      }
    ],
    meta: { roles: 1, title: '预约管理' }
  },
  {
    path: '/manage',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/manageUsers/index'),
        name: 'ManageUsers',
        meta: { title: '用户管理', icon: 'el-icon-receiving' }
      }
    ],
    meta: { roles: 0, title: '用户管理' }
  }
]

export const constantRoutes = [
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  },
  {
    path: '/Login',
    component: () => import('@/views/login')
  },
  {
    path: '/',
    component: Layout
  },
  {
    path: '/overall',
    component: Layout,
    redirect: '/overall/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/overall/index'),
        name: 'ReserveOverall',
        meta: {
          title: '预约情况',
          icon: 'el-icon-view',
          affix: true
        }
      }
    ],
    meta: {
      title: '预约情况'
    }
  },
  {
    path: '/myreserve',
    component: Layout,
    redirect: '/myreserve/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/toC/myReserve/index'),
        name: 'MyReserve',
        meta: {
          title: '我的预约',
          icon: 'el-icon-s-claim',
          affix: true
        }
      }
    ],
    meta: {
      title: '我的预约'
    }
  },
  {
    path: '/editreserve',
    component: Layout,
    redirect: '/editreserve/index',
    name: 'editreserve',
    props: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/toC/editReserve/index.vue'),
        name: 'EditReserve',
        meta: {
          title: '编辑预约',
          icon: 'el-icon-s-promotion',
          affix: true
        }
      }
    ],
    meta: {
      title: '编辑预约'
    }
  }

]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
