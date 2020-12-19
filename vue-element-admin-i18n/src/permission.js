import router, { resetRouter } from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'
import { getUrlParams } from '@/utils/getURLParams'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  const flag = !!sessionStorage.getItem('token')
  const appId = sessionStorage.getItem('appId') || getUrlParams(window.location.href, 'appId') || 52
  const token = sessionStorage.getItem('token') || getUrlParams(window.location.href, 'token')
  NProgress.start()
  if (flag) {
    const roles = (await store.getters.userinfo.authority) || sessionStorage.getItem('authority')
    const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
    resetRouter(router)
    router.addRoutes(accessRoutes)
  }
  if (!store.getters.userinfo.uid) {
    const appId = getUrlParams(window.location.href, 'appId') || sessionStorage.getItem('appId') || 52
    const token = getUrlParams(window.location.href, 'token') || sessionStorage.getItem('token')
    await store.dispatch('user/login', { appId: appId, token: token })
      .then(() => {
        const path = to.path === '/' ? '/overall' : to.path
        router.push({ path: path })
      })
      .catch(() => {
      })
    window.onbeforeunload = async e => { // 刷新时弹出提示
      return ''
    }
  } else if (!flag && token && appId) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('appId', appId)
    next({ path: '/', query: { appId, token }})
  } else if (flag && token && appId) {
    document.title = getPageTitle(to.meta.title)
    if (flag) {
      try {
        const rootRoute = to.path === '/' && from.path === '/'
        if (rootRoute) {
          router.push({ path: '/overall' })
        } else {
          next()
        }
      } catch (error) {
        console.log(error)
        next()
        NProgress.done()
      }
    }
  } else {
    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
