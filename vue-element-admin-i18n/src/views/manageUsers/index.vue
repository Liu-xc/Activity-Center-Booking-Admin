<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button type="primary" class="group-audit filter-item" @click="addUser">添加</el-button>
      <el-button type="primary" class="group-audit filter-item" @click="deleteGroup">删除</el-button>
      <!-- $t是用与语言转换的 -->
      <el-input
        v-model="listQuery.workId"
        placeholder="用户工号"
        style="width: 230px;"
        class="filter-item"
        @input="_handleFilter"
      />
      <el-input
        v-model="listQuery.name"
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
        v-model="listQuery.authority"
        placeholder="用户等级"
        clearable
        class="filter-item"
        style="width: 200px"
        @input="_handleFilter"
      >
        <el-option
          v-for="item in Object.keys(Authority)"
          :key="item"
          :label="Authority[item]"
          :value="item"
        />
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
          <span>{{ row.workId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" width="220px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户所属" width="300px" align="center">
        <template slot-scope="{row}">
          <span>{{ Department[row.department + ''] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户级别" align="center" width="160">
        <template slot-scope="{row}">
          <span class="link-type">{{ Authority[row.authority + ''] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="修改级别" align="center" width="160">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="changeLevel(row)">修改等级</el-button>
        </template>
      </el-table-column>
      <el-table-column label="删除" align="center" width="117" class-name="small-padding fixed-width">
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
          <el-input v-model="userToHandle.workId" disabled />
        </el-form-item>
        <el-form-item label="用户名称">
          <el-input v-model="userToHandle.name" disabled />
        </el-form-item>
        <el-form-item label="用户所属">
          <el-input :value="Department[userToHandle.department + '']" disabled />
        </el-form-item>
        <el-form-item label="用户等级">
          <el-radio-group v-model="userToHandle.authority">
            <template v-for="item in Object.keys(Authority)">
              <el-radio :key="item" :label="item">{{ Authority[item + ''] }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-button size="mini" type="primary" class="subBtn" @click="onSubmitChange">提交</el-button>
      </el-form>
    </el-dialog>
    <el-dialog title="添加用户" :visible.sync="addUserDialogVisible" @close="onAddUserClose">
      <el-form ref="addUserForm" :model="userToAdd" :rules="rules" label-width="80px" size="mini">
        <el-form-item label="用户工号" required>
          <el-input v-model="userToAdd.workId" />
        </el-form-item>
        <el-form-item label="用户名称" required prop="name">
          <el-input v-model="userToAdd.name" />
        </el-form-item>
        <el-form-item label="用户所属" required>
          <el-input :value="Department[userToAdd.department + '']" />
        </el-form-item>
        <el-form-item label="用户等级" required>
          <el-radio-group v-model="userToAdd.authority">
            <template v-for="item in Object.keys(Authority)">
              <el-radio :key="item" :label="item">{{ Authority[item + ''] }}</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
        <el-button size="mini" class="subBtn" type="primary" @click="onSubmitAdd('addUserForm')">提交</el-button>
        <el-button size="mini" type="primary" @click="resetForm('addUserForm')">重置</el-button>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
// , getAdminList, deleteAdmin, setAdmin, changeAdminLevel
// import { fetchUserList } from '@/api/user'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
// import { ErrorCodes } from '../../utils/errorCodes'
import { Department, Authority } from '../../utils/StaticData'
import { handleFilter } from '../../utils/formHandlers'
import { changeAdminLevel, getAdminList } from '../../api/user'

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
    var validatorUname = (rule, value, callback) => {
      var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.length < 2) {
        callback(new Error('用户名不能少于2个字符'))
      } else if (value.length >= 20) {
        callback(new Error('用户名不能超过20个字符'))
      } else if (reg.test(value)) {
        callback(new Error('用户名不能包含特殊字符'))
      } else {
        callback()
      }
    }
    return {
      auditListLen: 1, // 要审核的列表长度
      checkedList: [], // 选中的列表项
      auditDialogVisible: false,
      addUserDialogVisible: false,
      checkAll: false,
      userToHandle: {
        workId: '',
        name: '',
        department: '',
        authority: ''
      },
      userToAdd: {
        workId: '',
        name: '',
        department: '',
        authority: ''
      },
      tableKey: 0,
      list: null, // 数据
      total: 0,
      listLoading: true,
      listQuery: { // 请求参数
        workId: '',
        name: '',
        department: '',
        authority: '',
        DisplayPage: 1,
        DisplayRows: 10
      },
      searchTimer: null,
      Department, Authority,
      rules: {
        name: [{ validator: validatorUname, trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {

    // 表格的复选框选择时触发
    handleSelection(val) {
      this.checkedList = val
    },
    /* 重置 */
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    /* 同步限制筛选范围 */
    _handleFilter() {
      handleFilter(this, this.getList)
    },
    /* 关闭添加面板时，清除已经填写的内容 */
    onAddUserClose() {
      this.$refs['addUserForm'].resetFields()
    },
    /* 修改用户的等级 */
    changeLevel(row) {
      this.auditDialogVisible = true
      this.userToHandle = row
    },
    /* 添加一个用户 */
    addUser() {
      this.addUserDialogVisible = true
    },

    /* 以下为需要发起请求的方法 */

    /* 提交修改 */
    onSubmitChange() {
      // 发布修改并且关闭弹窗
      const data = {
        uid: this.userToHandle.uid,
        authority: this.userToHandle.authority
      }
      changeAdminLevel(data).then(res => {
        /* 这里应该判断状态码 */
        this.$message({
          type: 'success',
          message: '修改成功!'
        })
        this.auditDialogVisible = false
      }).catch(() => {

      })
      /* 要有消息提示 */
    },
    /* 提交新建用户 */
    onSubmitAdd(formName) {
      /* 进行表单验证 */
      // setAdmin().then()
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
          this.addUserDialogVisible = false
        } else {
          console.log('error submit!!')
          return false
        }
      })
      /* 发起请求，请求成功后设置隐藏 */
    },
    /* 删除一个用户 */
    deleteOne(row) {
      this.$confirm(`此操作将删除用户 " ${row.name} " , 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // deleteAdmin().then()
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 点击审核选中项时触发
    deleteGroup() {
      // 如果没有选中的项就什么也不做
      if (!this.checkedList.length) {
        return
      }
      const userList = this.checkedList.map(v => v.name).join()
      this.$confirm(`此操作将删除：${userList}\n等 ${this.checkedList.length} 位用户, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // promiseAll?
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
      // 有空的话加一个提示信息
    },
    // 获取数据
    getList() {
      // getAdminList().then()
      this.listLoading = true
      const params = {
        displayPage: this.listQuery.displayPage,
        displayRows: this.listQuery.displayRows
      }
      getAdminList(params).then(response => {
        this.list = response.data.list
        this.total = response.data.total

        //   // Just to simulate the time of the request
        this.listLoading = false
      }).catch(() => {

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
.subBtn {
  margin-left: 80px !important;
}
.el-table::before {
  height: 0;
}
.el-table--border::after {
  height: 0;
}
.el-table--border {
  border-top: none;
}
.el-table__header .has-gutter {
  border-top: 1px solid #dfe6ec !important;
}
</style>
