<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { getUrlParams } from '@/utils/getURLParams'

let loginTimes = 1

export default {
  name: 'App',
  created() {

    // this.$router.push({ path: `/Login?appId=${appId}&token=${token}` })
    // this.loading = false
  },
  mounted() {
    const appId = 52
    const token = getUrlParams(window.location.href, 'token')
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

