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

  if (!flag && token && appId) {
    sessionStorage.setItem('token', token)
    sessionStorage.setItem('appId', appId)
    next({ path: '/', query: { appId, token }})
  } else if (flag && token && appId) {
    document.title = getPageTitle(to.meta.title)

    if (flag) {
      try {
        const roles = (await store.getters.userinfo.authority) || sessionStorage.getItem('authority')
        const accessRoutes = await store.dispatch('permission/generateRoutes', roles)
        resetRouter(router)
        router.addRoutes(accessRoutes)
        console.log(to, from, store.getters.userinfo)
        next()
      } catch (error) {
        console.log(error)
        next()
        NProgress.done()
      }
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
