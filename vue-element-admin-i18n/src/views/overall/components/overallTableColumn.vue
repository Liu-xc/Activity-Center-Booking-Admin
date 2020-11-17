<template>
  <div class="table-column">
    <div class="booked-hall">{{ hall }}</div>
    <template v-for="(item, idx) of approveList">
      <div :key="item.startTime" class="book-item" :style="styleList[idx]">
        <div class="book-detail-wrapper">
          <div class="department book-detail-item" :title="item.department">
            部门：
            <br>
            {{ item.department }}
          </div>
          <div class="period book-detail-item">
            时间：
            <br>
            {{ item.period[0] | parseTime('{h}:{i}') }} --- {{ item.period[1] | parseTime('{h}:{i}') }}
          </div>
          <div class="tel book-detail-item" :title="item.tel">
            联系方式：
            <br>
            {{ item.tel }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
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
        const baseHour = 8
        const start = (new Date(item.period[0])).getHours() - baseHour
        const end = (new Date(item.period[1])).getHours() - baseHour
        const style = {
          'grid-row-start': start - 5,
          'grid-row-end': end - 5
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
