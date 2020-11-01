<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="group-audit filter-item" @click="auditGroup">审核选中项</el-button>
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
      <el-table-column label="申请部门" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用时间" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.requestPeriod[0]|parseTime('{m}-{d} {h}:{i}') }} —— {{ row.requestPeriod[1]|parseTime('{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="场地" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.site }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="活动名称" width="250px">
        <template slot-scope="{row}">
          <span>{{ row.activityName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" width="160">
        <template slot-scope="{row}">
          <span class="link-type">{{ statusList[row.status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="201" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="checkDetail(row)">详情</el-button>
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

    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      <div v-if="imgsToCheck.length">
        <template v-for="item of imgsToCheck">
          <el-image
            :key="item"
            :preview-src-list="imgsToCheck"
            class="detail-img"
            fit="contain"
            :src="item"
            alt
          >
            <div slot="error" class="image-slot">
              <i class="el-icon-picture-outline" />
            </div>
          </el-image>
        </template>
      </div>
      <div v-else>未上传图片</div>
    </el-dialog>
    <el-dialog title="审核" :visible.sync="auditDialogVisible">
      <el-form ref="form" label-width="80px" size="mini">
        <el-form-item label="申请时间">
          <el-date-picker
            v-model="itemToAudit.requestTime"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
            format="yyyy-MM-dd HH:mm"
            disabled
          />
        </el-form-item>
        <el-form-item label="申请部门">
          <el-input v-model="itemToAudit.department" disabled />
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="itemToAudit.activityName" disabled />
        </el-form-item>
        <el-form-item label="活动场地">
          <el-select v-model="itemToAudit.site" placeholder="活动场地" disabled>
            <el-option :label="itemToAudit.site" :value="itemToAudit.site" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker
              v-model="itemToAudit.requestPeriod[0]"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              format="yyyy-MM-dd HH:mm"
              disabled
            />
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-date-picker
              v-model="itemToAudit.requestPeriod[1]"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              format="yyyy-MM-dd HH:mm"
              disabled
            />
          </el-col>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model="itemToAudit.status">
            <el-radio :label="0">通过</el-radio>
            <el-radio :label="1">不通过</el-radio>
            <el-radio :label="2">待审核</el-radio>
            <el-radio :label="3">未上传图片</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="itemToAudit.auditComment" />
        </el-form-item>
        <el-form-item label="查看详情">
          <el-button type="primary" size="mini" @click="checkDetail(itemToAudit)">详情</el-button>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="onSubmitAudit">提交</el-button>
        </el-form-item>
      </el-form>
      <div class="audit-pagination">
        <el-pagination
          small
          :page-size="1"
          layout="prev, pager, next"
          :total="auditListLen"
          @current-change="changeAuditIndex"
        />
      </div>
    </el-dialog>
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
      auditListLen: 1, // 要审核的列表长度
      conflictList: [], // 冲突列表
      checkedList: [], // 选中的列表项
      auditDialogVisible: false,
      auditChecked: false, // 区分展开Dialog的是批量审核还是冲突审核
      checkAll: false,
      statusList: ['通过', '不通过', '待审核', '未上传图片'],
      itemToAudit: {
        requestTime: '',
        requestPeriod: [undefined, undefined],
        department: '',
        activityName: '',
        status: 2,
        site: '',
        imgs: []
      },
      imgsToCheck: [],
      tableKey: 0,
      list: null, // 数据
      total: 0,
      listLoading: true,
      listQuery: { // 请求参数
        page: 1,
        limit: 15,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      dialogFormVisible: false,
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    audit(row) {
      // 点击审核时获取对应的数据项，应该现在数据库中查找是否有与之冲突的项
      // 然后再展示出来进行审核
      // 需要一个loading效果
      this.auditChecked = false
      this.auditDialogVisible = true
      this.getConflictList().then(list => {
        this.auditListLen = list.length
        this.conflictList = list
        this.itemToAudit = list[0]
      })
    },
    // 点击审核选中项时触发
    auditGroup() {
      // 如果没有选中的项就什么也不做
      if (this.checkedList.length) {
        this.auditChecked = true
        this.auditDialogVisible = true
        this.auditListLen = this.checkedList.length
        this.itemToAudit = this.checkedList[0]
      }
      // 有空的话加一个提示信息
    },
    // 表格的复选框选择时触发
    handleSelection(val) {
      this.checkedList = val
    },
    // 当审核界面的分页器页数切换时触发
    changeAuditIndex(val) {
      this.itemToAudit = this.auditChecked ? this.checkedList[val - 1] : this.conflictList[val - 1]
      console.log(this.itemToAudit)
    },
    onSubmitAudit() {

    },
    checkDetail(val) {
      this.dialogFormVisible = true
      this.imgsToCheck = val.imgs
    },
    // 获取数据
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
    },
    getConflictList(row) {
      // 获取参数（site，requestPeriod）
      // 携带参数发送请求获取冲突数组
      return Promise.resolve(this.list.slice(3, 6))
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
.audit-pagination {
  display: flex;
  justify-content: center;
}
.detail-img {
  width: 100%;
}
</style>
