<template>
  <div class="new-reserve-container">
    <el-form ref="form" class="new-reserve-form" :model="form" label-width="160px">
      <el-form-item label="会议室" required>
        <el-col :span="12">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="活动名称" required>
        <el-col :span="12">
          <el-input v-model="form.name" />
        </el-col>
      </el-form-item>
      <el-form-item label="活动区域">
        <el-select v-model="form.region" placeholder="请选择活动区域">
          <el-option label="区域一" value="shanghai" />
          <el-option label="区域二" value="beijing" />
        </el-select>
      </el-form-item>
      <el-form-item label="布场日期">
        <el-col :span="6">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.date2" placeholder="开始时间" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.date2" placeholder="结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="布场是否需要音控">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="是否外来公司布场">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="彩排日期">
        <el-col :span="6">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.date2" placeholder="开始时间" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.date2" placeholder="结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>
      <el-form-item label="彩排是否需要音控">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="演出日期">
        <el-col :span="6">
          <el-date-picker v-model="form.date1" type="date" placeholder="选择日期" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.date2" placeholder="开始时间" style="width: 100%;" />
        </el-col>
        <el-col class="line" :span="1">-</el-col>
        <el-col :span="6">
          <el-time-picker v-model="form.date2" placeholder="结束时间" style="width: 100%;" />
        </el-col>
      </el-form-item>

      <el-col :span="10">
        <el-form-item label="活动负责人" required>
          <el-input v-model="form.desc" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="申请部门" required>
          <el-input v-model="form.desc" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="申请人" required>
          <el-input v-model="form.desc" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="联系电话" required>
          <el-input v-model="form.desc" />
        </el-form-item>
      </el-col>
      <el-col :span="10">
        <el-form-item label="内容及需求">
          <el-input v-model="form.desc" type="textarea" />
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
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      }
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!')
    }
  }
}
</script>

<style scoped>
.new-reserve-form {
  padding: 15px;
}
</style>
