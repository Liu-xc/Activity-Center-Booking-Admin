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
      <overall-table-column hall="求实厅" :approve-list="approveList" />
      <overall-table-column hall="求实厅" :approve-list="approveList" />
      <overall-table-column hall="求实厅" :approve-list="approveList" />
      <overall-table-column hall="求实厅" :approve-list="approveList" />
      <overall-table-column hall="求实厅" :approve-list="approveList" />
      <overall-table-column hall="求实厅" :approve-list="approveList" />
      <overall-table-column hall="求实厅" :approve-list="approveList" />
      <overall-table-column hall="求实厅" :approve-list="approveList" />
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
          startTime: '',
          department: '学工部学工部学工部学工部学工部学工部学工部学工部',
          period: [new Date(), new Date()],
          tel: '12314'
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
  height: 750px;
  margin: 0 auto;
  overflow: scroll;
}
.time-line {
  display: grid;
  grid-template-rows: repeat(15, 1fr);
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 10;
}
.table-body {
  height: 100%;
  display: flex;
}
</style>
