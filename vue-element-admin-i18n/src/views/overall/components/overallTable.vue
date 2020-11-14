<template>
  <div class="overall-table">
    <div class="time-line">
      <div>时间</div>
      <template v-for="i in 14">
        <div :key="i">{{ (i + 7 + ':00').padStart(5, '0') }}</div>
      </template>
    </div>
    <div class="table-body">
      <overall-table-column hall="求实厅" :approve-list="approveList" />
    </div>
  </div>
</template>

<script>
import OverallTableColumn from './overallTableColumn'
export default {
  name: 'OverallTable',
  components: {
    OverallTableColumn
  },
  data() {
    return {
      approveList: [
        {
          startTime: ''
        }
      ]
    }
  }
}
</script>

<style scoped>
.overall-table {
  display: grid;
  grid-template-columns: 80px 1fr;
  width: 80%;
  height: 700px;
  margin: 0 auto;
  background-color: pink;
}
.time-line {
  display: grid;
  grid-template-rows: repeat(15, 1fr);
}
.table-body {
  height: 100%;
  display: flex;
}
</style>
