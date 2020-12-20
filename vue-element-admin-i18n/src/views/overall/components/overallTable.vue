<template>
  <div class="overall-table">
    <div class="time-line">
      <div>时间</div>
      <template v-for="i in 17">
        <div :key="i">{{ (i + 6 + ':00').padStart(5, '0') }}</div>
      </template>
    </div>
    <div v-if="approveList.length" class="table-body">
      <template v-for="(item) of approveList">
        <overall-table-column
          :key="item.list[0].formalStart"
          :date="query.date"
          :hall="item.reserveHall"
          :approve-list="item.list"
        />
      </template>
    </div>
    <div v-else class="none-reserve">暂无预约</div>
  </div>
</template>

<script>
import OverallTableColumn from './overallTableColumn'
export default {
  name: 'OverallTable',
  components: {
    OverallTableColumn
  },
  props: {
    query: {
      type: Object,
      default() {
        return {
          date: new Date(Date.now()),
          campus: 0
        }
      }
    },
    approveList: {
      type: Array,
      default: () => {
        return []
      }
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
  grid-template-rows: repeat(18, 1fr);
  position: sticky;
  left: 0;
  background-color: white;
  z-index: 10;
}
.table-body {
  height: 100%;
  display: flex;
}
.none-reserve {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 40px;
  letter-spacing: 10px;
  word-break: break-all;
  font-weight: 900;
  color: #ecf0f1;
}
</style>
