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
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="预定场地" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ Halls[row.reserveHall + ''] }}</span>
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
          <span>{{ ReviewStatus[row.reviewStatus + ''] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核备注" width="120px" align="center">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-view" @click="check(row)">查看备注</el-button>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-view" @click="check(row)">编辑/查看</el-button>
          <el-button size="mini" type="primary" icon="el-icon-upload" @click="check(row)">上传图片</el-button>
          <el-button size="mini" type="primary" icon="el-icon-upload2" @click="exportExcel(row)">导出</el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteApply(row)">删除</el-button>
        </template>
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
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" />
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Campuses, Halls, Department, Authority, ActivityType, ReviewStatus } from '../../../utils/StaticData'
import { filterMyRequest } from '../../../api/reserve'

export default {
  name: 'MyReverse',
  components: { Pagination },
  data() {
    return {
      itemToHandle: null,
      dialogVisible: false,
      list: [],
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
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      Campuses, Halls, Department, Authority, ActivityType, ReviewStatus
    }
  },
  created() {
    this.getReserveList()
  },
  methods: {
    parseTime,
    check(row) {
      this.itemToHandle = row
      this.dialogVisible = true
    },
    exportExcel(row) {
      this.itemToHandle = row
    },
    deleteApply(row) {
      this.itemToHandle = row
    },
    getReserveList() {
      filterMyRequest({ ...this.listQuery }).then(
        res => {
          res = {
            'data': {
              'pageNum': 1,
              'pageSize': 2,
              'size': 2,
              'startRow': 1,
              'endRow': 2,
              'total': 7,
              'pages': 4,
              'list': [
                {
                  'aid': 6,
                  'uid': 1,
                  'createTime': null,
                  'updateTime': null,
                  'campus': 0,
                  'reserveHall': 0,
                  'activity': null,
                  'activityType': 0,
                  'arrangeDate': null,
                  'arrangeStart': null,
                  'arrangeEnd': null,
                  'arrangeSound': false,
                  'rehearsalDate': null,
                  'rehearsalStart': null,
                  'rehearsalEnd': null,
                  'rehearsalSound': false,
                  'formalDate': null,
                  'formalStart': null,
                  'formalEnd': null,
                  'remarks': null,
                  'activityHolder': null,
                  'activityDepartment': 0,
                  'applicant': 'test',
                  'contact': '1111111',
                  'reviewStatus': 0,
                  'reviewResponse': null,
                  'imageUrl': null
                },
                {
                  'aid': 7,
                  'uid': 1,
                  'createTime': null,
                  'updateTime': null,
                  'campus': 0,
                  'reserveHall': 0,
                  'activity': null,
                  'activityType': 0,
                  'arrangeDate': null,
                  'arrangeStart': null,
                  'arrangeEnd': null,
                  'arrangeSound': false,
                  'rehearsalDate': null,
                  'rehearsalStart': null,
                  'rehearsalEnd': null,
                  'rehearsalSound': false,
                  'formalDate': null,
                  'formalStart': null,
                  'formalEnd': null,
                  'remarks': null,
                  'activityHolder': null,
                  'activityDepartment': 0,
                  'applicant': 'test',
                  'contact': '1111111',
                  'reviewStatus': 0,
                  'reviewResponse': null,
                  'imageUrl': null
                }
              ],
              'prePage': 0,
              'nextPage': 2,
              'isFirstPage': true,
              'isLastPage': false,
              'hasPreviousPage': false,
              'hasNextPage': true,
              'navigatePages': 8,
              'navigatepageNums': [
                1,
                2,
                3,
                4
              ],
              'navigateFirstPage': 1,
              'navigateLastPage': 4,
              'firstPage': 1,
              'lastPage': 4
            },
            'code': 200,
            'msg': 'SUCCESS'
          }
          this.list = res.data.list
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
