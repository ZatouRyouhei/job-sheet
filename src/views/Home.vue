<template>
  <div class="container">
    <div class="home">
      <el-form ref="form" :model="form" :rules="rules">
        <el-form-item prop="userid">
          <el-input type="text" size="large" v-model="form.userid" placeholder="ID" style="width:100%;"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            size="large"
            v-model="form.password"
            show-password placeholder="パスワード"
            v-on:keyup.enter.native="login"
            style="width:100%;">
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" v-on:click="login" icon="el-icon-switch-button">ログイン</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
//import HelloWorld from '@/components/HelloWorld.vue'
import Constant from '../constant.js'
const axios = require('axios')

export default {
  name: 'Home',
  data: function() {
    return {
      form: {
        userid: '',
        password: ''
      },
      rules: {
        userid: [
          {required: true, message: 'IDが未入力です。', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'パスワードが未入力です。', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    login: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // ユーザ情報取得
          axios.get(Constant.URL_USER_LOGIN + this.form.userid).then((res) => {
            if (this.form.password == res.data.password) {
              // ユーザ情報をストアに保存
              this.$store.commit('setUser', {
                id: res.data.id,
                name: res.data.name})
              // トップ画面に遷移する。
              this.$router.push('/about')
            } else {
              // パスワードを間違えていた場合
              this.$message({
                showClose: true,
                message: 'ログインできませんでした。',
                type: 'error'
              });
            }
          }).catch ((error) => { // eslint-disable-line
            this.$message({
                showClose: true,
                message: 'ログインできませんでした。',
                type: 'error'
              });
          })
        }
      })
    }
  }
}
</script>

<style>
.container {
  position: absolute;
  top: 0;
  left: 0;
  margin: 0;
  padding: 0;
  height: 100vh;
  width: 100vw;
  background: url('../assets/logo.png') 20% 20% no-repeat;
  background-size: 400px 400px;
}
.home {
  position: absolute;
  width: 20%;
  top: 30%;
  left: 38%;
}

</style>