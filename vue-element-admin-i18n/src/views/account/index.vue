<template>
  <div id="account">
    <el-row>
      <el-col :span="7" :offset="8">
        <div class="avartar">
          <el-avatar :size="100" src="https://empty" @error="errorHandler">
            <img src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png">
          </el-avatar>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" :offset="8">
        <el-form
          ref="ruleForm"
          :model="ruleForm"
          status-icon
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="uname">
            <el-input v-model="ruleForm.uname" type="text" autocomplete="off" />
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="ruleForm.email" type="email" autocomplete="off" />
          </el-form-item>
          <el-form-item label="旧密码" prop="oldpass">
            <el-input v-model="ruleForm.oldpass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="新密码" prop="newpass">
            <el-input v-model="ruleForm.newpass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input v-model="ruleForm.checkPass" type="password" autocomplete="off" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <el-button @click="resetForm('ruleForm')">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'Account',
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.checkPass !== '') {
          this.$refs.ruleForm.validateField('checkPass')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.newpass) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (!reg.test(value)) {
        callback(new Error('请输入有效邮箱'))
      } else {
        callback()
      }
    }
    var validatorUname = (rule, value, callback) => {
      var reg = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]")
      if (value.length <= 3) {
        callback(new Error('用户名不能少于3个字符'))
      } else if (value.length >= 20) {
        callback(new Error('用户名不能超过20个字符'))
      } else if (reg.test(value)) {
        callback(new Error('用户名不能包含特殊字符'))
      } else {
        callback()
      }
    }
    return {
      ruleForm: {
        uname: '',
        email: '',
        oldpass: '',
        newpass: '',
        checkPass: ''
      },
      rules: {
        oldpass: [
          { validator: validatePass, trigger: 'blur' }
        ],
        checkPass: [
          { validator: validatePass2, trigger: 'blur' }
        ],
        email: [
          { validator: validateEmail, trigger: 'blur' }
        ],
        uname: [
          { validator: validatorUname, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    errorHandler() {
      return true
    }
  }
}
</script>

<style>
@import '../../styles/account.css';
</style>
