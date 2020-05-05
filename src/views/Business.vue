<template>
  <div class="business">
    <h3>業務テーブル</h3>
    <el-form ref="form" :model="form" :rules="rules">
      <el-form-item prop="id">
        <el-input-number v-model="form.id" :precision="0" :step="1" :min="1" :disabled="editFlg" style="width: 200px;">
        </el-input-number>
      </el-form-item>
      <el-form-item prop="name">
        <el-input type="text" v-model="form.name" placeholder="業務名" style="width: 100%;"></el-input>
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
      ref="businessList"
      :data="businessList"
      stripe
      height="100%"
      highlight-current-row
      @current-change="rowClick">
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="業務名"></el-table-column> 
    </el-table>
  </div>
</template>

<script>
import Constant from '../constant.js'
const axios = require('axios')

export default {
  name: 'Business',
  data: function() {
    return {
      businessList: [],
      editFlg: false,
      form: {
        id: 1,
        name: ''
      },
      rules: {
        id: [
          {required: true, message: 'IDが未入力です。', trigger: 'blur'},
          {pattern: /^[0-9]+$/, message: '数字を入力してください。', trigger: 'blur'}
        ],
        name: [
          {required: true, message: '業務名が未入力です。', trigger: 'blur'},
          {max: 20, message: '20文字以内で入力してください。', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    search: function() {
      this.businessList = []
      axios.get(Constant.URL_BUSINESS_GETLIST).then((res) => {
        for (let idx in res.data) {
          this.businessList.push({id: res.data[idx].id, name: res.data[idx].name})
        }
      })
    },
    rowClick: function(item) {
      if (item) {
        this.$refs['form'].resetFields();
        this.form.id = item.id
        this.form.name = item.name
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
            name: this.form.name
          }
          axios.post(Constant.URL_BUSINESS_REGIST, obj).then(() => {
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
      this.$refs.businessList.setCurrentRow()
      // 編集状態を解除
      this.editFlg = false
    },
    remove: function() {
      axios.delete(Constant.URL_BUSINESS_DELETE + this.form.id).then((res) => {
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
    }
  },
  created: function() {
    this.search()
  }
}
</script>

<style>
.business {
  width: 60%;
  height: 50vh;
  margin: 30px;
}
</style>