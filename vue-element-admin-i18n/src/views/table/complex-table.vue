<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="group-audit filter-item" @click="auditGroup">审核选中项</el-button>
      <!-- $t是用与语言转换的 -->
      <el-input
        v-model.number="listQuery.activityDepartment"
        placeholder="申请部门"
        style="width: 300px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.activity"
        placeholder="活动名称"
        style="width: 300px;"
        class="filter-item"
      />
      <el-select v-model="listQuery.activityType" clearable class="filter-item" placeholder="活动类型">
        <el-option v-for="type of ActivityType" :key="type" :value="type">{{ type }}</el-option>
      </el-select>
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

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="_handleFilter"
      >{{ $t('table.search') }}</el-button>
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
      <!-- 申请序号 -->
      <el-table-column :label="$t('table.id')" prop="id" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.aid }}</span>
        </template>
      </el-table-column>
      <el-table-column type="selection" label="勾选" width="80px" align="center" />
      <!-- 提交时间 -->
      <el-table-column align="center" label="提交时间" width="200px">
        <template slot-scope="{row}">
          <span>{{ (row.createTime || row.updateTime) | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!-- 申请部门 -->
      <el-table-column label="申请部门" width="230px" align="center">
        <template slot-scope="{row}">
          <span>{{ Department[row.activityDepartment + ''] }}</span>
        </template>
      </el-table-column>
      <!-- 使用时间段 -->
      <el-table-column label="使用时间" width="260px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.formalStart|parseTime('{m}-{d} {h}:{i}') }} —— {{ row.formalEnd|parseTime('{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <!-- 预约场地 -->
      <el-table-column align="center" label="场地" width="160px">
        <template slot-scope="{row}">
          <span>{{ Halls[row.reserveHall + ''] }}</span>
        </template>
      </el-table-column>
      <!-- 活动名称 -->
      <el-table-column align="center" label="活动名称" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.activity }}</span>
        </template>
      </el-table-column>
      <!-- 审核状态 -->
      <el-table-column label="状态" align="center" width="160">
        <template slot-scope="{row}">
          <span class="link-type">{{ ReviewStatus[row.reviewStatus + ''] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="281" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="checkDetail(row)">详情</el-button>
          <el-button size="mini" type="success" @click="audit(row)">审核</el-button>
          <el-button size="mini" type="primary" icon="el-icon-upload2">
            <a download :href="`${BaseUrl}${row.aid}`">导出</a>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="checkall-and-page">
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.DisplayPage"
        :limit.sync="listQuery.DisplayRows"
        :page-sizes="[10, 15, 20, 30, 40, 50]"
        class="pages"
        @pagination="getList"
      />
    </div>

    <el-dialog title="详情" :visible.sync="dialogFormVisible">
      <div v-if="imgToCheck">
        <el-image
          :preview-src="imgToCheck"
          class="detail-img"
          fit="contain"
          :src="`http://106.54.139.235:8090${imgToCheck}`"
          alt
        >
          <div slot="error" class="image-slot">
            <i class="el-icon-picture-outline" />
          </div>
        </el-image>
      </div>
      <div v-else>未上传图片</div>
    </el-dialog>
    <el-dialog title="审核" :visible.sync="auditDialogVisible">
      <el-form ref="form" label-width="80px" size="mini">
        <el-form-item label="申请时间">
          <el-date-picker
            :value="itemToAudit.createTime || itemToAudit.updateTime"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
            format="yyyy-MM-dd HH:mm"
            disabled
          />
        </el-form-item>
        <el-form-item label="申请部门">
          <el-input v-model="Department[itemToAudit.activityDepartment + '']" disabled />
        </el-form-item>
        <el-form-item label="活动名称">
          <el-input v-model="itemToAudit.activity" disabled />
        </el-form-item>
        <el-form-item label="活动场地">
          <el-select v-model="itemToAudit.reserveHall" placeholder="活动场地" disabled>
            <el-option :label="itemToAudit.reserveHall" :value="itemToAudit.reserveHall" />
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <el-col :span="11">
            <el-date-picker
              v-model="itemToAudit.formalStart"
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
              v-model="itemToAudit.formalEnd"
              type="date"
              placeholder="选择日期"
              style="width: 100%;"
              format="yyyy-MM-dd HH:mm"
              disabled
            />
          </el-col>
        </el-form-item>
        <el-form-item label="审核状态">
          <el-radio-group v-model.number="itemToAudit.reviewStatus">
            <template v-for="item of Object.keys(ReviewStatus)">
              <el-radio
                :key="ReviewStatus[item]"
                :label="item*1"
                :value="item"
                :disabled="item * 1 <= 1"
              >{{ ReviewStatus[item] }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="itemToAudit.remarks" />
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
// import { fetchList } from '@/api/article'
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Campuses, Halls, Department, Authority, ActivityType, ReviewStatus } from '../../utils/StaticData'
import { handleFilter } from '../../utils/formHandlers'
import { approve, filterApprove } from '../../api/approve'
import { getExcel } from '@/api/excel'
import { cloneDeep } from 'lodash'

export default {
  name: 'ComplexTable',
  components: { Pagination },
  data() {
    return {
      BaseUrl: 'http://106.54.139.235:8090/Apply/DownloadWord/?aid=',
      auditListLen: 1, // 要审核的列表长度
      conflictList: [], // 冲突列表
      checkedList: [], // 选中的列表项
      auditDialogVisible: false,
      auditChecked: false, // 区分展开Dialog的是批量审核还是冲突审核
      checkAll: false,
      dataToExport: [],
      itemToAudit: {
        requestTime: '',
        requestPeriod: [undefined, undefined],
        activityDepartment: '',
        activity: '',
        reviewStatus: '待审核',
        reserveHall: '',
        imgs: [],
        remarks: '',
        activityType: ''
      },
      imgToCheck: null,
      tableKey: 0,
      list: null, // 数据
      total: 0,
      listLoading: true,
      listQuery: { // 请求参数
        DisplayPage: 1,
        DisplayRows: 15,
        activityDepartment: '',
        activity: '',
        campus: '',
        reserveHall: '',
        reviewStatus: ''
      },
      dialogFormVisible: false,
      downloadLoading: false,
      searchTimer: null,
      Campuses, Halls, Department, Authority, ActivityType, ReviewStatus,
      halls: this.Halls,
      campuses: this.Campuses
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    audit(row) {
      // 点击审核时获取对应的数据项，应该现在数据库中查找是否有与之冲突的项
      this.auditChecked = false
      this.auditDialogVisible = true
      this.auditListLen = 1
      this.conflictList = []
      this.itemToAudit = cloneDeep(row)
      // }
      // 然后再展示出来进行审核
      // 需要一个loading效果
    },
    // 点击审核选中项时触发
    auditGroup() {
      // 如果没有选中的项就什么也不做
      if (this.checkedList.length) {
        this.auditChecked = true
        this.auditDialogVisible = true
        this.auditListLen = this.checkedList.length
        this.itemToAudit = cloneDeep(this.checkedList[0])
      }
      // 有空的话加一个提示信息
    },
    // 表格的复选框选择时触发
    handleSelection(val) {
      this.checkedList = val
    },
    // 当审核界面的分页器页数切换时触发
    changeAuditIndex(val) {
      this.itemToAudit = this.auditChecked ? cloneDeep(this.checkedList[val - 1]) : cloneDeep(this.conflictList[val - 1])
    },
    checkDetail(val) {
      this.dialogFormVisible = true
      this.imgToCheck = val.imageUrl
    },
    _handleFilter() {
      this.listQuery.DisplayPage = 1
      handleFilter(this, this.getList)
    },
    /* 将行元素设置为待导出的对象 */
    handleDownload(row) {
      getExcel(row.id).then(res => {
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

    /* 下面为需要发起请求的方法 */

    // 获取数据
    /* 在这里要调用filterApprove */
    getList() {
      this.listLoading = true
      filterApprove({ ...this.listQuery }, this.$store.getters.userinfo).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    /* 发布修改 */
    async onSubmitAudit() {
      /* 将当前编辑的项提交 */
      const params = {
        aid: this.itemToAudit.aid,
        reviewStatus: this.itemToAudit.reviewStatus * 1,
        reviewResponse: this.itemToAudit.remarks
      }
      await approve(params).then(res => {
        /* 加一个加载效果或者提示 */
        this.$message({
          showClose: true,
          message: '修改成功',
          type: 'success'
        })
        this.getList()
        this.auditDialogVisible = false
      },
      () => {
        this.$message({
          showClose: true,
          message: '修改失败',
          type: 'danger'
        })
      }
      )
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
