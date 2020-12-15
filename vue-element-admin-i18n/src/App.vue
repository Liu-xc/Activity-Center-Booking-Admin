<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { presetForm } from './views/toC/editReserve/index.js'
import { getUrlParams } from '@/utils/getURLParams'

let loginTimes = 1

export default {
  name: 'App',
  created() {
    // this.$router.push({ path: `/Login?appId=${appId}&token=${token}` })
    // this.loading = false
    this.$root.editForm = cloneDeep(presetForm)
    this.$root.isEdit = false
  },
  mounted() {
    const appId = 52
    const token = getUrlParams(window.location.href, 'token') || this.$store.getters.token
    if (loginTimes--) {
      this.$store.dispatch('user/login', { appId: appId, token: token })
        .then(() => {
          this.$router.push({ path: '/overall' })
          this.loading = false
        })
        .catch(() => {
          this.loading = false
        })
    }
  }
}
</script>

