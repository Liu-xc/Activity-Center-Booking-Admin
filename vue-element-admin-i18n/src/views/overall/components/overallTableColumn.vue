<template>
  <div class="table-column">
    <div class="booked-hall">{{ hall }}</div>
    <template v-for="(item, idx) of approveList">
      <div :key="item.startTime" class="book-item" :style="styleList[idx]">
        <div class="book-detail-wrapper">
          <div
            class="department book-detail-item"
            :title="Department[item.activityDepartment + '']"
          >
            部门：
            <br>
            {{ Department[item.activityDepartment + ''] }}
          </div>
          <div class="period book-detail-item">
            时间：
            <br>
            {{ item.formalStart | parseTime('{h}:{i}') }} --- {{ item.formalEnd | parseTime('{h}:{i}') }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import { Department } from '@/utils/StaticData'
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
      Department
    }
  },
  computed: {
    styleList: function() {
      const list = []
      for (const item of this.approveList) {
        /* 在这里对时间进行判断然后构成对应的样式 */
        const baseHour = 7
        const startHour = (new Date(item.formalStart)).getHours()
        const endHour = (new Date(item.formalEnd)).getHours()
        const start = startHour - baseHour
        const end = endHour - baseHour
        const style = {
          'grid-row-start': start,
          'grid-row-end': end
        }
        list.push(style)
      }
      return list
    }
  },
  methods: {
    parseTime
  }
}
</script>

<style scoped>
.table-column {
  display: grid;
  grid-template-rows: repeat(15, 1fr);
  max-width: 200px;
}
.table-column div {
  white-space: wrap;
}
.book-detail-item {
  max-width: 200px;
  margin-bottom: 7px;
  font-size: 0.6rem;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}
.book-item {
  position: relative;
  width: 200px;
}
.book-detail-wrapper {
  padding: 5px;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: rgb(152, 219, 250);
  border: 1px solid rgb(153, 183, 197);
  z-index: 1;
  transition: all 0.3s;
}
.book-detail-wrapper:hover {
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto;
  overflow: visible;
  z-index: 1000;
  transform: scale(1.1);
  box-shadow: 10px 10px 10px rgba(77, 72, 67, 0.767);
}
.booked-hall {
  text-align: center;
}
</style>
