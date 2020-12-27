<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.activity" style="width: 200px;" placeholder="活动名称" />
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
        @click="_getReserveList"
      >搜索</el-button>
      <el-button class="filter-item" type="primary">
        <router-link to="/editreserve/index">新建</router-link>
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%; font-size: 10px;"
    >
      <el-table-column label="活动名称" width="160px" align="center">
        <template slot-scope="{row}">
          <span :title="row.activity">{{ row.activity }}</span>
        </template>
      </el-table-column>
      <el-table-column label="预定场地" width="110px" align="center">
        <template slot-scope="{row}">
          <span>{{ Halls[row.reserveHall + ''] }}</span>
        </template>
      </el-table-column>

      <el-table-column label="布场时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.arrangeStart | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ row.arrangeStart | parseTime('{h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="彩排时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.rehearsalStart | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ row.rehearsalStart | parseTime('{h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="演出时间" width="200px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.formalStart | parseTime('{y}-{m}-{d} {h}:{i}') }} - {{ row.formalStart | parseTime('{h}:{i}') }}</span>
        </template>
      </el-table-column>

      <el-table-column label="审核状态" width="138px" align="center">
        <template slot-scope="{row}">
          <span>{{ ReviewStatus[row.reviewStatus + ''] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="审核备注" width="260px" align="center">
        <template slot-scope="{row}">
          <div class="review-response" :title="row.reviewResponse">{{ row.reviewResponse }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" icon="el-icon-view" @click="check(row)">编辑/查看</el-button>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-upload"
            @click="showUpload(row.aid)"
          >上传图片</el-button>
          <el-button size="mini" type="primary" icon="el-icon-upload2">
            <a download :href="`${BaseUrl}${row.aid}`">导出</a>
          </el-button>
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
        @pagination="getReserveList"
      />
    </div>
    <el-dialog title="上传图片" :visible.sync="imgUploadPanel.show" width="30%">
      <div class="img-upload-container">
        <div class="img-picker">
          <el-upload
            ref="upload"
            class="upload-demo"
            action="http://106.54.139.235:8090/Apply/UploadImage"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :data="Object.assign({aid: imgUploadPanel.aid}, this.$store.getters.userinfo)"
            :headers="requestHeaders"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button size="small" type="primary">点击选择图片</el-button>
          </el-upload>
        </div>
        <div style="margin-top: 15px">
          <el-button type="primary" size="small" @click="submitImg">上传</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { Campuses, Halls, Department, Authority, ActivityType, ReviewStatus } from '../../../utils/StaticData'
import { filterMyRequest, deleteApply } from '../../../api/reserve'
import { cloneDeep } from 'lodash'
import { getExcel } from '@/api/excel'

export default {
  name: 'MyReverse',
  components: { Pagination },
  data() {
    return {
      BaseUrl: 'http://106.54.139.235:8090/Apply/DownloadWord/?aid=',
      itemToHandle: null,
      dialogVisible: false,
      imgUploadPanel: {
        aid: null,
        show: false
      },
      list: [],
      fileList: [],
      total: 100,
      listLoading: false,
      listQuery: {
        displayPage: 1,
        displayRows: 20,
        campus: null,
        reviewStatus: null,
        reserveHall: null,
        activityType: '',
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
  computed: {
    requestHeaders() {
      const headers = {}
      const userinfo = this.$store.getters.userinfo
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      headers['authority'] = userinfo.authority * 1
      headers['department'] = userinfo.department * 1
      headers['name'] = encodeURIComponent(userinfo.name)
      headers['uid'] = userinfo.uid * 1
      headers['workId'] = userinfo.workId * 1

      return headers
    }
  },
  created() {
    this.getReserveList()
  },
  methods: {
    parseTime,
    showUpload(aid) {
      this.imgUploadPanel.show = true
      this.imgUploadPanel.aid = aid
    },
    check(row) {
      this.$root.editForm = cloneDeep(row)
      this.$root.isEdit = true
      this.$router.push({ name: 'editreserve' })
    },
    exportExcel(aid) {
      getExcel(aid).then(res => {
      })
    },
    deleteApply(row) {
      this.$confirm('确认删除本次申请？').then(() => {
        // 执行删除的业务
        return deleteApply({ aid: row.aid })
      }).then(res => {
        if (res.code * 1 === 200) {
          this.$message({
            message: '删除成功',
            type: 'success'
          })
          this.getReserveList()
        }
      })
        .catch(err => {
          this.$message({
            message: '删除已取消'
          })
          console.log(err)
        })
    },
    _getReserveList() {
      this.listQuery.displayPage = 1
      this.getReserveList()
    },
    async getReserveList() {
      await filterMyRequest(cloneDeep(this.listQuery)).then(
        res => {
          this.list = res.data.list
          this.total = res.data.total
        }
      ).catch(err => {
        this.$message({
          message: err.msg,
          type: 'error'
        })
        console.log(err)
      })
    },
    handleRemove(file, fileList) {
    },
    handlePreview(file) {
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    submitImg() {
      this.$refs.upload.submit()
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
.img-upload-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 15px;
  flex-direction: column;
}
.img-picker {
  display: flex;
  justify-content: center;
  text-align: center;
}
</style>
