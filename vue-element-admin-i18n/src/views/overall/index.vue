<template>
  <div class="overall-container">
    <div class="header">
      <!-- 选择日期、校区、会议室 -->
      <el-date-picker v-model="listQuery.date" class="filter-item" type="date" placeholder="选择日期" />
      <el-select
        v-model="listQuery.campus"
        placeholder="校区"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in Campuses" :key="item" :label="Campuses[item]" :value="item" />
      </el-select>

      <el-button
        style="height: 35px;"
        type="primary"
        size="mini"
        icon="el-icon-search"
        @click="getTimeTable"
      >查询</el-button>
    </div>
    <div class="overall-table">
      <overall-table :query="listQuery" :approve-list="approveList" />
    </div>
  </div>
</template>

<script>
import { Campuses, Halls, QSHalls, SHHalls } from '../../utils/StaticData'
import OverallTable from './components/overallTable'
import { filterTimeTable } from '@/api/overall'

export default {
  name: 'BookOverall',
  components: {
    OverallTable
  },
  data() {
    return {
      listQuery: {
        date: (new Date(Date.now())),
        campus: '清水河'
        // ReserveHall: ''
      },
      Campuses,
      Halls,
      QSHalls,
      SHHalls,
      halls: this.Halls,
      approveList: []
    }
  },
  created() {
    this.getTimeTable()
  },
  methods: {
    /* 获取时间表 */
    getTimeTable() {
      filterTimeTable({ date: this.formatDate(), campus: this.listQuery.campus }).then(res => {
        const approveList = res.data
        // 处理数据，将同一个厅同一天的放在一起
        const divide = {}
        for (const item of approveList) {
          if (divide[item.reserveHall + '']) {
            divide[item.reserveHall + ''].list.push(item)
          } else {
            divide[item.reserveHall + ''] = {
              reserveHall: Halls[item.reserveHall + ''],
              list: [item]
            }
          }
        }
        const handledList = []
        for (const key of Object.keys(divide)) {
          handledList.push(divide[key])
        }
        this.approveList = handledList
      })
    },
    formatDate() {
      return `${this.listQuery.date.getFullYear()}/${this.listQuery.date.getMonth() + 1}/${this.listQuery.date.getDate()}`
    }
  }
}
</script>

<style scoped>
.header {
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.header .filter-item {
  margin: 10px;
}
</style>
