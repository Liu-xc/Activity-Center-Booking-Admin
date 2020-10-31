<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="group-audit filter-item">审核选中项</el-button>
      <!-- $t是用与语言转换的 -->
      <el-input
        v-model="listQuery.title"
        placeholder="申请部门"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-input
        v-model="listQuery.title"
        placeholder="活动名称"
        style="width: 300px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select
        v-model="listQuery.campus"
        placeholder="校区"
        clearable
        style="width: 150px"
        class="filter-item"
      >
        <el-option v-for="item in ['清水河', '沙河']" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="场地"
        clearable
        class="filter-item"
        style="width: 200px"
      >
        <el-option v-for="item in ['求实厅', '咖啡馆']" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select
        v-model="listQuery.type"
        placeholder="审核状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option v-for="item in ['待审核', '通过', '不通过']" :key="item" :label="item" :value="item" />
      </el-select>

      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >{{ $t('table.search') }}</el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @selection-change="handleSelection"
    >
      <el-table-column :label="$t('table.id')" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" label="勾选" width="80px" align="center">
        <!-- <template slot-scope="{row}">
          <el-checkbox label :data-row="row"></el-checkbox>
        </template>-->
      </el-table-column>
      <el-table-column align="center" label="提交时间" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.requestTime | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请部门" width="280px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用时间" width="400px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.requestPeriod[0]|parseTime('{m}-{d} {h}:{i}') }} —— {{ row.requestPeriod[1]|parseTime('{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="场地" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.site }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="160">
        <template slot-scope="{row}">
          <span
            v-if="row.status"
            class="link-type"
            @click="handleFetchPv(row.status)"
          >{{ row.status }}</span>
          <span v-else>0</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="201" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">详情</el-button>
          <el-button size="mini" type="success" @click="audit(row)">审核</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="checkall-and-page">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.limit"
        :page-sizes="[10, 15, 20, 30, 40, 50]"
        class="pages"
        @pagination="getList"
      />
    </div>

    <el-dialog title="详情" :visible.sync="dialogFormVisible" />
    <el-dialog title="审核" :visible.sync="auditDialogVisible" />
  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      checkedList: [],
      auditDialogVisible: false,
      checkAll: false,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 15,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      showReviewer: false,
      temp: {
        id: undefined,
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
    this.getList()
  },
  methods: {
    audit(row) {
      this.auditDialogVisible = true
      console.log(this.list)
    },
    toggleCheck() {
      console.log(event)
    },
    handleSelection(val) {
      this.checkedList = val
    },
    getList() {
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['提交时间', '申请部门', '使用时间', '场地', '审核状态']
        const filterVal = ['requestTime', 'department', 'requestPeriod', 'site', 'status']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'requestTime') {
          return parseTime(v[j])
        } else if (j === 'requestPeriod') {
          return `${parseTime(v[j][0], '{m}-{d} {h}:{i}')} —— ${parseTime(v[j][1], '{m}-{d} {h}:{i}')}`
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
}
.filter-item {
  margin-left: 15px;
}
.checkall-and-page {
  display: flex;
  justify-content: center;
  align-items: center;
}
.group-audit {
  margin-left: 15px;
}
.pages {
  margin: 0;
}
</style>
