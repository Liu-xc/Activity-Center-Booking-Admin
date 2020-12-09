import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

export const asyncRoutes = [
  {
    path: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/table/complex-table'),
        name: 'ComplexTable',
        meta: { title: '预约管理', icon: 'el-icon-s-check', affix: true }
      }
    ],
    meta: { roles: 1 }
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
    meta: { roles: 0 }
  }
]
/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
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
        component: () => import('@/views/toC/overall/index'),
        name: 'ReserveOverall',
        meta: {
          title: '预约情况',
          icon: 'el-icon-view',
          affix: false
        }
      }
    ]
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
          affix: false
        }
      }
    ]
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
        component: () => import('@/views/toC/editReserve/index'),
        name: 'EditReserve',
        meta: {
          title: '编辑预约',
          icon: 'el-icon-s-promotion',
          affix: true
        }
      }
    ]
  }
  // {
  //   path: '/account',
  //   component: Layout,
  //   redirect: '/account/index',
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import('@/views/account/index'),
  //       name: 'Account',
  //       meta: { title: '账号管理', icon: 'el-icon-s-custom', affix: false }
  //     }
  //   ]
  // }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
