<template>
  <div class="new-reserve-container">
    <el-form ref="form" :model="form" :rules="rules" class="new-reserve-form" label-width="160px">
      <el-form-item label="会议室" required prop="reserveHall">
        <el-col :span="12">
          <el-input v-model="form.reserveHall" />
        </el-col>
      </el-form-item>
      <el-form-item label="活动名称" required prop="activity">
        <el-col :span="12">
          <el-input v-model="form.activity" />
        </el-col>
      </el-form-item>
      <el-form-item label="布场日期" prop="arrangeData">
        <el-col :span="6">
          <el-date-picker
            v-model="form.arrangeData"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.arrangeStart" placeholder="开始时间" style="width: 100%;" />
        </el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.arrangeEnd" placeholder="结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="布场是否需要音控" prop="arrangeSound">
        <el-switch v-model="form.arrangeSound" />
      </el-form-item>
      <!-- <el-form-item label="是否外来公司布场">
        <el-switch v-model="form.delivery" />
      </el-form-item>-->
      <el-form-item label="彩排日期" prop="rehearsalData">
        <el-col :span="6">
          <el-date-picker
            v-model="form.rehearsalData"
            type="date"
            placeholder="选择日期"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.rehearsalStart" placeholder="开始时间" style="width: 100%;" />
        </el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.rehearsalEnd" placeholder="结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="彩排是否需要音控" prop="rehearsalSound">
        <el-switch v-model="form.rehearsalSound" />
      </el-form-item>
      <el-form-item label="演出日期" required prop="date">
        <el-col :span="6">
          <el-date-picker v-model="form.date" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.start" placeholder="开始时间" style="width: 100%;" />
        </el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.end" placeholder="结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>

      <el-col :span="10">
        <el-form-item label="活动负责人" required prop="activityHolder">
          <el-input v-model="form.activityHolder" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="申请部门" required prop="applyDepartment">
          <el-input v-model="form.applyDepartment" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="申请人" required prop="applicant">
          <el-input v-model="form.applicant" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="联系电话" required prop="contact">
          <el-input v-model="form.contact" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="内容及需求" prop="remarks">
          <el-input v-model="form.remarks" type="textarea" />
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即创建</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'NewReserve',
  data() {
    return {
      form: {
        reserveHall: null,
        activity: null,
        arrangeData: null,
        arrangeStart: null,
        arrangeEnd: null,
        arrangeSound: false,
        rehearsalData: null,
        rehearsalStart: null,
        rehearsalEnd: null,
        rehearsalSound: false,
        data: null,
        start: null,
        end: null,
        activityHolder: null,
        applyDepartment: null,
        applicant: null,
        contact: null,
        remarks: null
      },
      rules: {
        reserveHall: [
          { required: true, message: '请输入要预约的会议室' }
        ],
        activity: [
          { required: true, message: '请输入活动名称' }
        ],
        date: [
          { required: true, message: '请输入活动日期' }
        ],
        start: [
          { required: true, message: '请输入活动开始时间' }
        ],
        end: [
          { required: true, message: '请输入活动结束时间' }
        ],
        activityHolder: [
          { required: true, message: '请输入活动负责人' }
        ],
        applyDepartment: [
          { required: true, message: '请输入申请部门' }
        ],
        applicant: [
          { required: true, message: '请输入申请人' }
        ],
        contact: [
          { required: true, message: '请输入联系方式' }
        ]
      }
    }
  },
  methods: {
    onSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style scoped>
.new-reserve-form {
  padding: 15px;
}
</style>
