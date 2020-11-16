<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="group-audit filter-item" @click="addUser">添加</el-button>
      <el-button type="primary" class="group-audit filter-item" @click="deleteGroup">删除</el-button>
      <!-- $t是用与语言转换的 -->
      <el-input
        v-model="listQuery.userID"
        placeholder="用户工号"
        style="width: 230px;"
        class="filter-item"
        @input="_handleFilter"
      />
      <el-input
        v-model="listQuery.userName"
        placeholder="用户名称"
        style="width: 230px;"
        class="filter-item"
        @input="_handleFilter"
      />
      <el-input
        v-model="listQuery.department"
        placeholder="用户所属"
        style="width: 230px;"
        class="filter-item"
        @input="_handleFilter"
      />
      <el-select
        v-model="listQuery.userLevel"
        placeholder="用户等级"
        clearable
        class="filter-item"
        style="width: 200px"
        @input="_handleFilter"
      >
        <el-option v-for="item in UserLevels" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button
        v-waves
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
      style="width: 75%; margin: 0 auto;"
      @selection-change="handleSelection"
    >
      <el-table-column type="selection" label="勾选" width="80px" align="center">
        <!-- <template slot-scope="{row}">
          <el-checkbox label :data-row="row"></el-checkbox>
        </template>-->
      </el-table-column>
      <el-table-column align="center" label="用户工号" width="200px">
        <template slot-scope="{row}">
          <span>{{ row.userID }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户所属" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.department }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户级别" align="center" width="160">
        <template slot-scope="{row}">
          <span class="link-type">{{ row.userLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改级别" align="center" width="160">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="changeLevel(row)">修改等级</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="117" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button size="mini" type="danger" @click="deleteOne(row)">删除</el-button>
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

    <el-dialog title="修改等级" :visible.sync="auditDialogVisible">
      <el-form ref="form" label-width="80px" size="mini">
        <el-form-item label="用户工号">
          <el-input v-model="userToHandle.userID" disabled />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="userToHandle.userName" disabled />
        </el-form-item>
        <el-form-item label="用户所属">
          <el-input v-model="userToHandle.department" disabled />
        </el-form-item>
        <el-form-item label="用户等级">
          <el-radio-group v-model="userToHandle.userLevel">
            <el-radio label="普通用户">普通用户</el-radio>
            <el-radio label="管理员">管理员</el-radio>
            <el-radio label="超级管理员">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button size="mini" type="primary" @click="onSubmitChange">提交</el-button>
      </el-form>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" @close="onAddUserClose">
      <el-form ref="form" label-width="80px" size="mini">
        <el-form-item label="用户工号" required>
          <el-input v-model="userToAdd.userID" />
        </el-form-item>
        <el-form-item label="用户名称" required>
          <el-input v-model="userToAdd.userName" />
        </el-form-item>
        <el-form-item label="用户所属" required>
          <el-input v-model="userToAdd.department" />
        </el-form-item>
        <el-form-item label="用户等级" required>
          <el-radio-group v-model="userToAdd.userLevel">
            <el-radio label="普通用户">普通用户</el-radio>
            <el-radio label="管理员">管理员</el-radio>
            <el-radio label="超级管理员">超级管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button size="mini" type="primary" @click="onSubmitAdd">提交</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchUserList } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { ErrorCodes } from '../../utils/errorCodes'
import { Campuses, UserLevels, Halls, QSHalls, SHHalls } from '../../utils/StaticData'
import { handleCampusAndHalls, handleFilter } from '../../utils/formHandlers'

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
      checkedList: [], // 选中的列表项
      auditDialogVisible: false,
      addUserDialogVisible: false,
      checkAll: false,
      userToHandle: {
        userID: '',
        userName: '',
        department: '',
        userLevel: ''
      },
      userToAdd: {
        userID: '',
        userName: '',
        department: '',
        userLevel: ''
      },
      tableKey: 0,
      list: null, // 数据
      total: 0,
      listLoading: true,
      listQuery: { // 请求参数
        userID: '',
        userName: '',
        department: '',
        userLevel: '',
        DisplayPage: 1,
        DisplayRows: 10
      },
      searchTimer: null,
      Campuses, UserLevels, Halls, QSHalls, SHHalls,
      halls: this.Halls,
      campuses: this.Campuses
    }
  },
  created() {
    this.getList()
  },
  methods: {
    changeLevel(row) {
      this.auditDialogVisible = true
      this.userToHandle = row
    },
    addUser() {
      this.addUserDialogVisible = true
    },
    deleteOne(row) {

    },
    // 点击审核选中项时触发
    deleteGroup() {
      // 如果没有选中的项就什么也不做
      if (this.checkedList.length) {
        this.auditDialogVisible = true
      }
      // 有空的话加一个提示信息
    },
    // 表格的复选框选择时触发
    handleSelection(val) {
      this.checkedList = val
    },
    onSubmitChange() {
      // 发布修改并且关闭弹窗
      this.auditDialogVisible = false
    },
    onSubmitAdd() {
      /* 进行表单验证 */
      this.addUserDialogVisible = false
    },
    onAddUserClose() {
      this.userToAdd = {
        userID: '',
        userName: '',
        department: '',
        userLevel: ''
      }
    },
    _handleFilter() {
      handleCampusAndHalls(this)
      handleFilter(this, this.getList)
    },
    // 获取数据
    getList() {
      this.listLoading = true
      fetchUserList(this.listQuery).then(response => {
        this.list = response.data.items
        this.total = response.data.total

        //   // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    }
  }
}
</script>

<style scoped>
.filter-container {
  display: flex;
  align-items: center;
  justify-content: center;
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
