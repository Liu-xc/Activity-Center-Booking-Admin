import router, { resetRouter } from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getUrlParams } from '@/utils/getURLParams'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  history.pushState = () => {}
  history.go = () => {}
  history.back = () => {}
  // 检查是否登录
  document.title = to.meta.title || '活动中心预约系统'
  const flag = !!sessionStorage.getItem('token')
  const appId = sessionStorage.getItem('appId') || getUrlParams(window.location.href, 'appId') || 52
  const token = sessionStorage.getItem('token') || getUrlParams(window.location.href, 'token')
  if (flag) {
    // 已登录
    const roles = sessionStorage.getItem('authority')
    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
    resetRouter(router)
    router.addRoutes(accessRoutes)
  }
  NProgress.start()
  if (store.getters.userinfo.name) {
    next()
  } else if (!store.getters.userinfo.name && sessionStorage.getItem('name')) {
    // 刷新的情况
    const info = {
      authority: sessionStorage.getItem('authority'),
      name: sessionStorage.getItem('name'),
      uid: sessionStorage.getItem('uid'),
      workId: sessionStorage.getItem('workId'),
      department: sessionStorage.getItem('department')
    }
    store.commit('user/SET_USERINFO', info)
    next(to.path)
  } else if (!sessionStorage.getItem('name')) {
    // 未登录
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('appId', appId)
    await store.dispatch('user/login', { appId: appId, token: token })
      .then(() => {
        next('/overall/index')
      })
      .catch(() => {
      })
  }
})

router.afterEach(() => {
  NProgress.done()
})
