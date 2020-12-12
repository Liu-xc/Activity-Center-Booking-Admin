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
    // const appid = this.$route.query.appid
    // const token = this.$route.query.token

    this.$store.dispatch('user/login', { appId: 52, token: '0d8c5f48-38ab-4ad2-80bb-8ba584cf5aaf' })
      .then(() => {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
    this.$root.editForm = cloneDeep(presetForm)
    this.$root.isEdit = false
  }
}
</script>

