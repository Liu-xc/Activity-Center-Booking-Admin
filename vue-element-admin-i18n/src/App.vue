<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // const appid = this.$route.query.appid
    // const token = this.$route.query.token

    this.$store.dispatch('user/login', { appId: 52, token: '0fa5f428-82e1-442e-b7e8-c2d15a09ce0f' })
      .then(() => {
        this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
        this.loading = false
      })
      .catch(() => {
        this.loading = false
      })
  }
}
</script>

