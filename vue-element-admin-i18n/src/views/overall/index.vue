<template>
  <div class="overall-container">
    <div class="header">
      <!-- 选择日期、校区、会议室 -->
      <el-date-picker v-model="listQuery.date" class="filter-item" type="date" placeholder="选择日期" />
      <el-select
        v-model="listQuery.Campus"
        placeholder="校区"
        clearable
        style="width: 150px"
        class="filter-item"
        @input="_handleFilter"
      >
        <el-option v-for="item in Campuses" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.ReserveHall"
        placeholder="场地"
        clearable
        class="filter-item"
        style="width: 200px"
        @input="_handleFilter"
      >
        <el-option v-for="item in halls || Halls" :key="item" :label="item" :value="item" />
      </el-select>
    </div>
    <div class="overall-table">
      <overall-table />
    </div>
  </div>
</template>

<script>
import { Campuses, Halls, QSHalls, SHHalls } from '../../utils/StaticData'
import { handleCampusAndHalls, handleFilter } from '../../utils/formHandlers'
import OverallTable from './components/overallTable'
export default {
  name: 'BookOverall',
  components: {
    OverallTable
  },
  data() {
    return {
      listQuery: {
        date: new Date(),
        Campus: '',
        ReserveHall: ''
      },
      Campuses,
      Halls,
      QSHalls,
      SHHalls,
      halls: this.Halls

    }
  },
  methods: {
    _handleFilter() {
      handleCampusAndHalls(this)
      handleFilter(this)
    },
    /* 获取时间表 */
    getTimeTable() {
      // filterTimeTable().then()
    }
  }
}
</script>

<style scoped>
.header {
  padding: 10px;
  display: flex;
  justify-content: center;
}
.header .filter-item {
  margin: 10px;
}
</style>
