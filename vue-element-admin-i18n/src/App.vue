<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { presetForm } from './views/toC/editReserve/index.js'
import { getUrlParams } from '@/utils/getURLParams'

let loginTimes = true

export default {
  name: 'App',
  created() {
    this.$root.editForm = cloneDeep(presetForm)
    this.$root.isEdit = false
  },
  async mounted() {
    const appId = getUrlParams(window.location.href, 'appId') || sessionStorage.getItem('appId') || 52
    const token = getUrlParams(window.location.href, 'token') || sessionStorage.getItem('token')
    if (loginTimes) {
      loginTimes = false
      await this.$store.dispatch('user/login', { appId: appId, token: token })
        .then(() => {
          this.$router.push({ path: '/overall' })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
    window.onbeforeunload = async e => { // 刷新时弹出提示
      loginTimes = true
      return ''
    }
  }
}
</script>

