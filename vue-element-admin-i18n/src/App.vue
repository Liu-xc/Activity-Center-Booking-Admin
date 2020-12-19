<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { cloneDeep } from 'lodash'
import { presetForm } from './views/toC/editReserve/index.js'

export default {
  name: 'App',
  created() {
    this.$root.editForm = cloneDeep(presetForm)
    this.$root.isEdit = false
  },
  async mounted() {

  },
  destroyed() { // 销毁vm组件
    // 避免堆栈溢出，多次创建、多次触发
  },
  methods: {

  }
}
</script>

