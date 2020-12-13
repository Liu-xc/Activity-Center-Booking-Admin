<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { presetForm } from './views/toC/editReserve/index.js'
import { cloneDeep } from 'lodash'

export default {
  name: 'App',
  created() {
    this.$store.dispatch('user/login', { appId: 52, token: '6719f8bd-ee76-4e6a-90f6-5a064cc7357b' })
      .then(() => {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    this.$root.editForm = cloneDeep(presetForm)
    this.$root.isEdit = false
  },
  mounted() {
    const appid = this.$route.query.appid
    const token = this.$route.query.token
    console.log(appid, token, this.$router)
  }
}
</script>

