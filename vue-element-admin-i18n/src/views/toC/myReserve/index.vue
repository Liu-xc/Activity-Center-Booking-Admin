<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.activity" style="width: 200px;" placeholder="活动名称" />

      <el-select
        v-model.number="listQuery.campus"
        placeholder="校区"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option
          v-for="item in Object.keys(Campuses)"
          :key="item"
          :label="Campuses[item]"
          :value="Campuses[item]"
        />
      </el-select>

      <el-select
        v-model.number="listQuery.reserveHall"
        placeholder="场地"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in Object.keys(Halls)"
          :key="item"
          :label="Halls[item]"
          :value="Halls[item]"
        />
      </el-select>
      <el-select
        v-model.number="listQuery.activityType"
        placeholder="活动类别"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option
          v-for="item in Object.keys(ActivityType)"
          :key="item"
          :label="ActivityType[item]"
          :value="ActivityType[item]"
        />
      </el-select>
      <el-select
        v-model.number="listQuery.reviewStatus"
        placeholder="审核状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in Object.keys(ReviewStatus)"
          :key="item"
          :label="ReviewStatus[item]"
          :value="ReviewStatus[item]"
        />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="getReserveList">搜索</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="预定场地" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reserveHall }}</span>
        </template>
      </el-table-column>

      <el-table-column label="布场时间" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.arrangeStart | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ row.arrangeStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="彩排时间" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rehearsalStart | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ row.rehearsalStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="演出时间" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.formalStart | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ row.formalStart | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" width="138px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.reviewStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核备注" width="120px" align="center">
        <template>
          <el-button type="primary" size="mini" icon="el-icon-view">查看备注</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <el-button type="primary" size="mini" icon="el-icon-view">编辑/查看</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload">上传图片</el-button>
        <el-button size="mini" type="primary" icon="el-icon-upload2">导出</el-button>
        <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.displayPage"
        :limit.sync="listQuery.displayRows"
        :page-sizes="[10, 15, 20, 30, 40, 50]"
        style="margin: 10px;"
      />
    </div>
  </div>
</template>

<script>
// import { fetchList, fetchPv, createArticle, updateArticle } from '@/api/article'
// import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Campuses, Halls, Department, Authority, ActivityType, ReviewStatus } from '../../../utils/StaticData'
import { filterMyRequest } from '../../../api/reserve'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'MyReverse',
  components: { Pagination },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: [{
        'arrangeEnd': null,
        'formalStart': '2020-11-12 09:44:26',
        'activity': '测试',
        'rehearsalEnd': null,
        'arrangeStart': null,
        'rehearsalStart': null,
        'formalEnd': '2020-11-12 09:54:26',
        'reserveHall': 0,
        'aid': 3,
        'activityDepartment': '0'
      },
      {
        'arrangeEnd': '2020-11-12 10:54:26',
        'formalStart': null,
        'activity': '中国航天科工851',
        'rehearsalEnd': null,
        'arrangeStart': '2020-11-12 10:44:26',
        'rehearsalStart': null,
        'formalEnd': null,
        'reserveHall': 1,
        'aid': 4,
        'activityDepartment': '0'
      }],
      total: 100,
      listLoading: false,
      listQuery: {
        displayPage: 1,
        displayRows: 20,
        campus: null,
        reviewStatus: null,
        reserveHall: null,
        activityType: null,
        activity: null
      },
      campusOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        campus: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      Campuses, Halls, Department, Authority, ActivityType, ReviewStatus
    }
  },
  created() {
    this.getReserveList()
  },
  methods: {
    parseTime,
    getReserveList() {
      filterMyRequest({ ...this.listQuery }).then(
        res => {
          this.list = res.list
        }
      ).catch(err => {
        this.$message({
          message: err.msg,
          type: 'error'
        })
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  display: flex;
  justify-content: flex-end;
}
.filter-item {
  margin: 0 0 10px 15px;
}
.pagination-container {
  display: flex;
  justify-content: center;
}
</style>
