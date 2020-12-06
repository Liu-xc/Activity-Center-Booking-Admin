<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.importance"
        placeholder="校区"
        clearable
        style="width: 90px"
        class="filter-item"
      >
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="场地"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in calendarTypeOptions"
          :key="item.key"
          :label="item.display_name+'('+item.key+')'"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        placeholder="申请类别"
        style="width: 140px"
        class="filter-item"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-select
        v-model="listQuery.sort"
        placeholder="审核状态"
        style="width: 140px"
        class="filter-item"
      >
        <el-option
          v-for="item in sortOptions"
          :key="item.key"
          :label="item.label"
          :value="item.key"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search">搜索</el-button>
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
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
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
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      importanceOptions: [1, 2, 3],
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
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
      downloadLoading: false
    }
  },
  created() {
  },
  methods: {
    parseTime
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
