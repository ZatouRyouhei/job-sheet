<template>
  <div class="user">
    <h3>ユーザテーブル</h3>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="id">
        <el-input type="text" v-model="form.id" :disabled="editFlg" placeholder="ID" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input type="password" v-model="form.password" show-password :placeholder="passwordPH" style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item prop="name">
        <el-input type="text" v-model="form.name" placeholder="氏名" style="width: 100%;"></el-input>
      </el-form-item>

      <el-row>
        <el-col :span="8" class="btnCol">
          <el-form-item>
            <el-button type="primary" icon="el-icon-edit" v-on:click="regist">登録</el-button>
          </el-form-item>
        </el-col>
        <el-col :span="8" class="btnCol">
          <el-popconfirm
            confirmButtonText='はい'
            cancelButtonText='いいえ'
            icon="el-icon-info"
            iconColor="red"
            title="修正中の内容は破棄されますがよろしいですか？"
            v-on:onConfirm="clear">
            <el-button type="info" slot="reference" icon="el-icon-tickets">クリア</el-button>
          </el-popconfirm>
        </el-col>
        <el-col :span="8" class="btnCol">
          <el-popconfirm
            confirmButtonText='はい'
            cancelButtonText='いいえ'
            icon="el-icon-info"
            iconColor="red"
            title="削除してよろしいですか？"
            v-on:onConfirm="remove">
            <el-button type="danger" slot="reference" icon="el-icon-delete" :disabled="!editFlg">
              削除
            </el-button>
          </el-popconfirm>
        </el-col>
      </el-row>
    </el-form>
    <el-table
      ref="userList"
      :data="userList"
      stripe
      height="100%"
      highlight-current-row
      @current-change="rowClick">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="氏名"></el-table-column> 
    </el-table>
      

  </div>
</template>

<script>
import Constant from '../constant.js'
const axios = require('axios')

export default {
  name: 'User',
  data: function() {
    return {
      userList: [],
      passwordPH: 'パスワード',
      editFlg: false,
      form: {
        id: '',
        password: '',
        name: ''
      },
      rules: {
        id: [
          {required: true, message: 'IDが未入力です。', trigger: 'blur'},
          {max: 20, message: '20文字以内で入力してください。', trigger: 'blur'},
          {pattern: /^[0-9a-zA-Z]+$/, message: '英数字を入力してください。', trigger: 'blur'}
        ],
        password: [
          {required: true, message: 'パスワードが未入力です。', trigger: 'blur'},
          {max: 5, message: '5文字以内で入力してください。', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '氏名が未入力です。', trigger: 'blur'},
          {max: 20, message: '20文字以内で入力してください。', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    rowClick: function(item) {
      if (item) {
        this.$refs['form'].resetFields();
        this.form.id = item.id
        this.form.name = item.name
        this.passwordPH = 'パスワード（変更する場合に入力してください。）'
        // 更新の場合は必須チェックを外す。
        this.rules.password = [
          {max: 5, message: '5文字以内で入力してください。', trigger: 'blur'}
        ]
        // 編集状態とする。
        this.editFlg = true
      }
    },
    regist: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // オブジェクト生成
          let obj = {
            id: this.form.id,
            password: this.form.password,
            name: this.form.name
          }
          axios.post(Constant.URL_USER_REGIST, obj).then(() => {
            // 再検索処理
            this.search()

            this.$message({
              showClose: true,
              message: '登録が完了しました。',
              type: 'success'
            });
          })
        }
      })
    },
    clear: function() {
      // フォームに空をセットするだけだとvalidateが動いてしまうので以下のようにする。
      this.$refs['form'].resetFields();
      // 選択状態を解除する。
      this.$refs.userList.setCurrentRow()
      this.passwordPH = 'パスワード'
      // パスワードの必須チェックをもどす。
      this.rules.password = [
          {required: true, message: 'パスワードが未入力です。', trigger: 'blur'},
          {max: 5, message: '5文字以内で入力してください。', trigger: 'blur'}
        ]
      // 編集状態を解除
      this.editFlg = false
    },
    remove: function() {
      axios.delete(Constant.URL_USER_DELETE + this.form.id).then((res) => {
        // 入力欄クリア処理
        this.clear()
        // 再検索処理
        this.search()

        if (res.data == 1) {
          // 使用されているため削除不可
          this.$message({
            showClose: true,
            message: '使用されているため削除できません。',
            type: 'error'
          });
        } else {
          // 正常終了
          this.$message({
            showClose: true,
            message: '削除が完了しました。',
            type: 'success'
          });
        }
      }).catch(() => {
        // その他エラー
        this.$message({
          showClose: true,
          message: '削除できませんでした。',
          type: 'error'
        });
      })
    },
    search: function() {
      this.userList = []
      axios.get(Constant.URL_USER_GETLIST).then((res) => {
        for (var idx in res.data) {
          this.userList.push({id: res.data[idx].id, name: res.data[idx].name})
        }
      })
    }
  },
  created: function() {
    this.search()
  }
}
</script>

<style>
.user {
  width: 60%;
  height: 50vh;
  margin: 30px;
}

.btnCol {
  text-align: center;
}
</style>