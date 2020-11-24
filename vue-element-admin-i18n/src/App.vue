<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    this.$store.dispatch('user/login', { appid: 52, token: '93b0fe6d-833c-4db1-b59a-13a003ffd358' })
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

