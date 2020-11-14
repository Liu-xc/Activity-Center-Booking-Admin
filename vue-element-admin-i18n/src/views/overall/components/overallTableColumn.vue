<template>
  <div class="table-column">
    <div>{{ hall }}</div>
    <template v-for="(item, idx) of approveList">
      <div :key="item.startTime" :style="styleList[idx]">内容</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'OverallTableColumn',
  props: {
    hall: {
      type: String,
      default: ''
    },
    approveList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {

    }
  },
  computed: {
    styleList: function() {
      const list = []
      for (const item of this.approveList) {
        /* 在这里对时间进行判断然后构成对应的样式 */
        console.log(item)
        const style = {
          'grid-row-start': 5,
          'grid-row-end': 9
        }
        list.push(style)
      }
      return list
    }
  }
}
</script>

<style scoped>
.table-column {
  display: grid;
  grid-template-rows: repeat(15, 1fr);
}
</style>
