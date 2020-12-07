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

    this.$store.dispatch('user/login', { appId: 52, token: 'c76c1455-993d-4b0e-bb87-31e22d2c89a0' })
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

