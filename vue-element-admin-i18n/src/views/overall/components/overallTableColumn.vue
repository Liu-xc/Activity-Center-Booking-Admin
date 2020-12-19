<template>
  <div v-if="handledList.length" class="table-column">
    <div class="booked-hall">{{ hall }}</div>
    <template v-for="item of handledList">
      <div :key="item.startTime" class="book-item" :style="item.style">
        <div
          class="book-detail-wrapper"
          :style="{'background-color': item.style['background-color']}"
        >
          <div class="period book-detail-item" :title="item.activity">活动： {{ item.activity }}</div>
          <div class="period book-detail-item" :title="item.usage">
            用途：
            {{ item.usage }}
          </div>
          <div
            class="department book-detail-item"
            :title="Department[item.activityDepartment + '']"
          >
            部门：
            {{ Department[item.activityDepartment + ''] }}
          </div>
          <div class="period book-detail-item">
            时间：
            {{ item.start | parseTime('{h}:{i}') }} --- {{ item.end | parseTime('{h}:{i}') }}
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
    },
    date: {
      type: Date,
      default: () => {
        return new Date(Date.now())
      }
    }
  },
  data() {
    const today = parseTime(this.date, '{y}-{m}-{d}')
    return {
      today,
      Department
    }
  },
  computed: {
    handledList() {
      const list = []
      for (const item of this.approveList) {
        const { arrangeStart, arrangeEnd, rehearsalStart, rehearsalEnd, formalStart, formalEnd } = item
        const arrange = arrangeStart && arrangeEnd && (parseTime(arrangeStart, '{y}-{m}-{d}') === this.today)
        const rehearsal = rehearsalStart && rehearsalEnd && (parseTime(rehearsalStart, '{y}-{m}-{d}') === this.today)
        const formal = formalStart && formalEnd && (parseTime(formalStart, '{y}-{m}-{d}') === this.today)
        const commonData = {
          activityDepartment: item.activityDepartment,
          activity: item.activity
        }
        if (arrange) {
          list.push({
            usage: '布场',
            start: arrangeStart,
            end: arrangeEnd
          })
        }
        if (rehearsal) {
          list.push({
            usage: '彩排',
            start: rehearsalStart,
            end: rehearsalEnd
          })
        }
        if (formal) {
          list.push({
            usage: '正式使用',
            start: formalStart,
            end: formalEnd
          })
        }

        for (let item of list) {
          item = Object.assign(item, commonData)
          item.style = this.getStyle(item)
        }
      }
      return list
    }
  },
  mounted() {
    console.log(this.handledList)
  },
  updated() {
    console.log('updated', this.approveList, this.date)
  },
  methods: {
    parseTime,
    getStyle(item) {
      const colors = ['#dfe4ea', '#9AECDB', '#7bed9f']
      const usages = ['布场', '彩排', '正式使用']
      const baseHour = 5
      const startHour = (new Date(item.start)).getHours()
      const endHour = (new Date(item.end)).getHours()
      const start = startHour - baseHour
      const end = endHour - baseHour
      const color = colors[usages.indexOf(item.usage)]
      const style = {
        'grid-row-start': start,
        'grid-row-end': end,
        'background-color': color
      }

      return style
    }
  }
}
</script>

<style scoped>
.table-column {
  display: grid;
  grid-template-rows: repeat(18, 1fr);
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
  box-sizing: border-box;
  padding: 5px;
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
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
