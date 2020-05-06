<template>
  <div class="about">

    <el-row>
      <!-- 業務日誌検索 -->
      <el-col :span="12" id="leftPart">
        <el-form ref="searchForm" :model="searchForm" label-position="top">
          <el-row>
            <el-col :span="6">
              <el-form-item prop="searchClient" label="顧客">
                <el-select v-model="searchForm.searchClient" clearable size="mini">
                  <el-option
                      v-for="item in clientList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="searchBusiness" label="業務">
                <el-select v-model="searchForm.searchBusiness" clearable v-on:change="findSearchSystemList" size="mini">
                  <el-option
                      v-for="item in businessList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="searchSystem" label="システム">
                <el-select v-model="searchForm.searchSystem" clearable size="mini">
                  <el-option
                      v-for="item in searchSystemList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="searchInquiry" label="問合せ区分">
                <el-select v-model="searchForm.searchInquiry" clearable size="mini">
                  <el-option
                      v-for="item in inquiryList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="6">
              <el-form-item prop="searchContact" label="窓口">
                <el-select v-model="searchForm.searchContact" clearable size="mini">
                  <el-option
                      v-for="item in contactList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item prop="searchDeal" label="対応者">
                <el-select v-model="searchForm.searchDeal" clearable size="mini">
                  <el-option
                      v-for="item in dealList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="searchOccurDate" label="発生日">
                <el-date-picker
                  v-model="searchForm.searchOccurDate"
                  type="daterange"
                  range-separator="-"
                  start-placeholder="発生日From"
                  end-placeholder="発生日To"
                  format="yyyy年M月d日"
                  size="mini">
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row type="flex" align="bottom">
            <el-col :span="6">
              <el-form-item prop="searchLimitDate" label="完了期限">
                <el-date-picker v-model="searchForm.searchLimitDate" type="date" size="mini" format="yyyy年M月d日" style="width:200px;">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
                <el-form-item prop="keyword" label="キーワード">
                  <el-input type="text" size="mini" v-model="searchForm.keyword" clearable></el-input>
                </el-form-item>
            </el-col>
            <el-col :span="6" style="text-align: center;">
              <el-form-item prop="completeCheckedGroup">
                <el-checkbox-group v-model="searchForm.completeCheckedGroup" :max="1" size="small">
                  <el-checkbox-button label="完了"></el-checkbox-button>
                  <el-checkbox-button label="未完了"></el-checkbox-button>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: right;">
              <el-form-item>
                <el-button type="primary" icon="el-icon-search" v-on:click="search">検索</el-button>
              </el-form-item>
            </el-col>
            <el-col :span="3" style="text-align: center;">
              <el-form-item>
                <el-button v-if="!downloading" type="success" icon="el-icon-download" v-on:click="download">台帳</el-button>
                <el-button v-else type="success" icon="el-icon-loading" disabled>台帳</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <!-- 検索結果一覧 -->
        <el-table
          ref="searchList"
          :data="searchList"
          style="width: 100%; margin-top: 20px;"
          :row-class-name="tableRowClassName"
          height="100%"
          highlight-current-row
          @current-change="rowClick"
          v-loading="loading">
          <el-table-column
            type="index"
            width="50">
          </el-table-column>
          <el-table-column
            prop="id"
            label="番号"
            width="120">
          </el-table-column>
          <el-table-column
            prop="title"
            label="タイトル"
            width="270">
          </el-table-column>
          <el-table-column
            prop="occurDate"
            v-bind:formatter="formatDate"
            label="発生日"
            width="130">
          </el-table-column>
          <el-table-column
            prop="client.name"
            label="顧客"
            width="180">
          </el-table-column>
          <el-table-column
            prop="contact.name"
            label="窓口">
          </el-table-column>
        </el-table>
      </el-col>

      <!-- 業務日誌登録フォーム -->
      <el-col :span="12"  id="rightPart">
        <div>
          <el-row>
            <el-col :span="12">
              <el-badge v-bind:value="badgeValue" v-bind:type="badgeType" v-bind:hidden="badgeFlg">
                <h3 style="height: 20px;">{{id}}</h3>
              </el-badge>
            </el-col>
            <el-col :span="12" id="userIcon">
              <el-dropdown>
                <i class="user-icon el-icon-user-solid"></i>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item disabled>{{$store.state.user.name}}さん</el-dropdown-item>
                  <el-dropdown-item v-on:click.native="toAdmin">管理</el-dropdown-item>
                  <el-dropdown-item v-on:click.native="logout">ログアウト</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>

          <el-form ref="form" :model="form" :rules="rules" label-position="top">
            <el-row>
              <el-col :span="6">
                <el-form-item prop="client" label="顧客">
                  <el-select size="mini" v-model="form.client" clearable>
                    <el-option
                        v-for="item in clientList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="business" label="業務">
                  <el-select size="mini" v-model="form.business" clearable v-on:change="findSystemList">
                    <el-option
                        v-for="item in businessList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="system" label="システム">
                  <el-select size="mini" v-model="form.system" clearable>
                    <el-option
                        v-for="item in systemList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="inquiry" label="問合せ区分">
                  <el-select size="mini" v-model="form.inquiry" clearable>
                    <el-option
                        v-for="item in inquiryList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="6">
                <el-form-item prop="department" label="問合せ部署">
                  <el-input class="department" type="text" size="mini" v-model="form.department"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="person" label="担当者">
                  <el-input class="person" type="text" size="mini" v-model="form.person"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="occurDate" label="発生日">
                  <el-date-picker v-model="form.occurDate" type="date" size="mini" format="yyyy年M月d日" style="width:200px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="occurTime"  label="発生時間">
                  <el-time-select
                    v-model="form.occurTime"
                    :picker-options="{
                      start: '00:00',
                      step: '00:30',
                      end: '23:30'
                    }"
                    size="mini"
                    style="width:200px;">
                  </el-time-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-form-item prop="title" label="タイトル">
              <el-input type="text" size="mini" v-model="form.title" style="width:870px;"></el-input>
            </el-form-item>
            <el-form-item prop="content" label="詳細">
              <el-input type="textarea" :rows="4" v-model="form.content" style="width:870px;"></el-input>
            </el-form-item>

            <el-row>
              <el-col :span="6">
                <el-form-item prop="contact" label="窓口">
                  <el-select size="mini" v-model="form.contact" clearable>
                    <el-option
                        v-for="item in contactList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="deal" label="対応者">
                  <el-select size="mini" v-model="form.deal" clearable>
                    <el-option
                        v-for="item in dealList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="limitDate" label="完了期限">
                  <el-date-picker size="mini" v-model="form.limitDate" type="date" format="yyyy年M月d日" style="width:200px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="completeDate" label="完了日">
                  <el-date-picker size="mini" v-model="form.completeDate" type="date" format="yyyy年M月d日" style="width:200px;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="18">
                <el-form-item prop="support" label="対応詳細">
                  <el-input  class="support" type="textarea" :rows="4" v-model="form.support"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item prop="responseTime" label="対応時間（時間）">
                  <el-input-number v-model="form.responseTime" :precision="1" :step="0.5" :min="0" :max="200" style="width:200px;">
                  </el-input-number>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item>
                  <el-upload
                    class="upload-demo"
                    drag
                    action=""
                    :on-change="handleAdd"
                    :on-remove="handleRemove"
                    :file-list="form.fileList"
                    :auto-upload="false"
                    multiple>
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">添付ファイル<br>Drop file here or <em>click to upload</em></div>
                  </el-upload>
                </el-form-item>
              </el-col>
              <el-col :span="12" style="overflow-y:auto; height: 180px;">
                <transition name="fileTable">
                  <table class="filetable" v-if="fileTableDisplay">
                    <tbody>
                      <tr v-for="file in fileNameList" v-bind:key="file.seqNo">
                        <td>{{file.fileName}}</td>
                        <td>
                          <el-button size="mini" type="primary" icon="el-icon-download" circle v-on:click="downloadFile(file)">
                          </el-button>
                        </td>
                        <td>
                          <el-popconfirm
                            confirmButtonText='はい'
                            cancelButtonText='いいえ'
                            icon="el-icon-info"
                            iconColor="red"
                            title="削除してよろしいですか？"
                            v-on:onConfirm="fileDel(file)">
                            <el-button size="mini" slot="reference" type="danger" icon="el-icon-delete" circle>
                            </el-button>
                          </el-popconfirm>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </transition>
              </el-col>
            </el-row>
            
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
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Constant from '../constant.js'
import { saveAs } from 'file-saver';
const axios = require('axios')

export default {
  name: 'About',
  data: function() {
    return {
      form: {
        client: '',
        business: '',
        system: '',
        department: '',
        inquiry: '',
        person: '',
        occurDate: '',
        occurTime: '',
        title: '',
        content: '',
        contact: '',
        limitDate: '',
        deal: '',
        completeDate: '',
        support: '',
        responseTime: 0.0,
        fileList: []
      },
      rules: {
        client: [
          {required: true, message: '顧客が未入力です。', trigger: 'blur'}
        ],
        business: [
          {required: true, message: '業務が未入力です。', trigger: 'blur'}
        ],
        system: [
          {required: true, message: 'システムが未入力です。', trigger: 'blur'}
        ],
        department: [
          {required: true, message: '問合せ部署が未入力です。', trigger: 'blur'},
          {max: 50, message: '50文字以内で入力してください。', trigger: 'blur'}
        ],
        inquiry: [
          {required: true, message: '問合せ区分が未入力です。', trigger: 'blur'}
        ],
        person: [
          {required: true, message: '担当者が未入力です。', trigger: 'blur'},
          {max: 50, message: '50文字以内で入力してください。', trigger: 'blur'}
        ],
        occurDate: [
          {required: true, message: '発生日が未入力です。', trigger: 'blur'}
        ],
        occurTime: [
          {required: true, message: '発生時間が未入力です。', trigger: 'blur'}
        ],
        title: [
          {required: true, message: 'タイトルが未入力です。', trigger: 'blur'},
          {max: 50, message: '50文字以内で入力してください。', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '詳細が未入力です。', trigger: 'blur'},
          {max: 500, message: '500文字以内で入力してください。', trigger: 'blur'}
        ],
        contact: [
          {required: true, message: '窓口が未入力です。', trigger: 'blur'}
        ],
        deal: [
          {required: true, message: '対応者が未入力です。', trigger: 'blur'}
        ],
        limitDate: [
          {required: true, message: '完了期限が未入力です。', trigger: 'blur'}
        ],
        support: [
          {max: 500, message: '500文字以内で入力してください。', trigger: 'blur'}
        ]
      },
      searchForm: {
        searchClient: '',
        searchBusiness: '',
        searchSystem: '',
        searchInquiry: '',
        searchOccurDate: '',
        searchContact: '',
        searchLimitDate: '',
        searchDeal: '',
        completeCheckedGroup: [],
        keyword: ''
      },
      clientList: [],
      businessList: [],
      systemList: [],
      inquiryList: [],
      contactList: [],
      dealList: [],
      searchSystemList: [],
      searchList: [],
      editFlg: false,
      tableName: '',
      id: '新規登録',
      fileNameList: [],
      // 日誌番号につけるバッジ用
      badgeValue: '',
      badgeType: 'info',
      badgeFlg: true,
      // 業務日誌検索時のローディングアニメーション用
      loading: false,
      // 台帳ダウンロード時のアニメーション用
      downloading: false,
      // 添付ファイル追加、削除時のアニメーション用
      fileTableDisplay: true
    }
  },
  methods: {
    logout: function() {
      this.$store.commit('setUser', {})
      this.$router.push('/')
    },
    toAdmin: function() {
      this.$router.push('/admin')
    },
    findSystemList: function() {
      this.systemList = []
      this.form.system = ''
      axios.get(Constant.URL_SYSTEM_GETLIST + this.form.business).then((res) => {
        for (var idx in res.data) {
          this.systemList.push({value: res.data[idx].id, label: res.data[idx].name})
        }
      })
    },
    findSearchSystemList: function() {
      this.searchSystemList = []
      this.searchForm.searchSystem = ''
      axios.get(Constant.URL_SYSTEM_GETLIST + this.searchForm.searchBusiness).then((res) => {
        for (var idx in res.data) {
          this.searchSystemList.push({value: res.data[idx].id, label: res.data[idx].name})
        }
      })
    },
    // 添付ファイルアップロード欄にファイルを追加したとき。
    handleAdd: function(file, fileList) {
      this.form.fileList = fileList
    },
    // 添付ファイルアップロード欄からファイルを削除したとき。
    handleRemove: function(file, fileList) {
      this.form.fileList = fileList
    },
    // 業務日誌登録処理
    regist: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // エラーがない場合登録処理を実施
          // ID 新規登録なら空とする。
          let registId = this.id
          if (!this.editFlg) {
            registId = ''
          }

          // 発生日時 yyyy-MM-dd HH:mm
          let occurYear = this.form.occurDate.getFullYear()
          let occurMonth = 1 + this.form.occurDate.getMonth()
          occurMonth = ('0' + occurMonth).slice(-2)
          let occurDay = this.form.occurDate.getDate()
          occurDay = ('0' + occurDay).slice(-2)
          let registOccurDate = occurYear + '-' + occurMonth + '-' + occurDay
          let registOccurTime = this.form.occurTime
          
          // 完了期限 yyyy-MM-dd
          let limitYear = this.form.limitDate.getFullYear()
          let limitMonth = 1 + this.form.limitDate.getMonth()
          limitMonth = ('0' + limitMonth).slice(-2)
          let limitDay = this.form.limitDate.getDate()
          limitDay = ('0' + limitDay).slice(-2)
          let registLimitDate = limitYear + '-' + limitMonth + '-' + limitDay
          
          // 完了日 yyyy-MM-dd
          let registCompleteDate = ''
          if (this.form.completeDate) {
            let completeYear = this.form.completeDate.getFullYear()
            let completeMonth = 1 + this.form.completeDate.getMonth()
            completeMonth = ('0' + completeMonth).slice(-2)
            let completeDay = this.form.completeDate.getDate()
            completeDay = ('0' + completeDay).slice(-2)
            registCompleteDate = completeYear + '-' + completeMonth + '-' + completeDay
          }
          
          // オブジェクト生成
          let obj = {
            id: registId,
            client: this.form.client,
            business: this.form.business,
            businessSystem: this.form.system,
            inquiry: this.form.inquiry,
            department: this.form.department,
            person: this.form.person,
            occurDate: registOccurDate,
            occurTime: registOccurTime,
            title: this.form.title,
            content: this.form.content,
            contact: this.form.contact,
            limitDate: registLimitDate,
            deal: this.form.deal,
            completeDate: registCompleteDate,
            support: this.form.support,
            responseTime: this.form.responseTime
          }

          // 登録処理
          axios.post(Constant.URL_JOBSHEET_REGIST, obj).then((res) => {
            // ファイルアップロード
            // アニメーション用にいったん添付ファイルテーブルを非表示にする。
            this.fileTableDisplay = false

            let params = new FormData()
            this.form.fileList.forEach(file => {
              file.raw.filename = file.name
              params.append('file', file.raw)
            })
            // res.dataには登録したIDが入っている
            axios.post(Constant.URL_ATTACHMENT_REGIST + res.data, params, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            }).then((res2) => {
              // 戻ってきたファイル情報をテーブル一覧にセットする。
              this.fileNameList = []
              res2.data.forEach((file) => {
                this.fileNameList.push({seqNo: file.seqNo, fileName: file.fileName})
              })

              // アニメーション用に添付ファイルテーブルを再表示にする。
              this.fileTableDisplay = true

              // 再検索処理
              this.search()
            }).catch(() => {
              // アニメーション用に添付ファイルテーブルを再表示にする。
              this.fileTableDisplay = true

              // 再検索処理
              this.search()
            })
            
            // 登録後に画面上部にIDを表示する
            this.id = res.data
            // 編集中にする。
            this.editFlg = true
            // 添付ファイルの入力欄は空にする。
            this.form.fileList = []
            // バッジを更新する。
            if (this.form.completeDate) {
              // 完了
              this.badgeFlg = false
              this.badgeValue = "完了"
              this.badgeType = "success"
            } else {
              if (this.form.limitDate < new Date()) {
                // 期限超過
                this.badgeFlg = false
                this.badgeValue = "期限超過"
                this.badgeType = "danger"
              } else {
                // 対応中
                this.badgeFlg = true
              }
            }
            
            this.$message({
              showClose: true,
              message: '登録が完了しました。',
              type: 'success'
            });
          })
        }
      })
    },
    // クリア処理
    clear: function() {
      // フォームに空をセットするだけだとvalidateが動いてしまうので以下のようにする。
      this.$refs['form'].resetFields();
      this.fileNameList = []
      this.form.occurDate = new Date()
      this.form.contact = this.$store.state.user.id
      // 検索結果の選択状態を解除する。
      this.$refs.searchList.setCurrentRow()
      // 編集状態を解除
      this.editFlg = false
      this.id = '新規登録'
      // バッジをクリアする。
      this.badgeFlg = true
    },
    // 添付ファイルダウンロード
    downloadFile: function(file) {
      axios.get(Constant.URL_ATTACHMENT_DOWNLOAD + this.id + "/" + file.seqNo, {
        responseType:'blob',
        dataType:'binary'
      }).then((res) => {
        const blob = new Blob([res.data], {
                type: "application/octet-stream"
              });
        saveAs(blob, file.fileName)
      })
    },
    // 添付ファイル削除処理
    fileDel: function(file) {
      // アニメーション用にいったん添付ファイルテーブルを非表示にする。
      this.fileTableDisplay = false

      axios.delete(Constant.URL_ATTACHMENT_DELETE + this.id + "/" + file.seqNo).then((res) => {
        // 戻ってきたファイル情報を添付ファイル一覧にセットする。
        this.fileNameList = []
        res.data.forEach((file) => {
          this.fileNameList.push({seqNo: file.seqNo, fileName: file.fileName})
        })
        // 完了メッセージ
        this.$message({
          showClose: true,
          message: '削除が完了しました。',
          type: 'success'
        });

        // アニメーション用に添付ファイルテーブルを再表示にする。
        this.fileTableDisplay = true
      }).catch(() => {
        // アニメーション用に添付ファイルテーブルを再表示にする。
        this.fileTableDisplay = true
      })
    },
    // 業務日誌削除処理
    remove: function() {
      axios.delete(Constant.URL_JOBSHEET_DELETE + this.id).then(() => {
        // 入力欄クリア処理
        this.clear()
        // 再検索処理
        this.search()
        // 完了メッセージ
        this.$message({
          showClose: true,
          message: '削除が完了しました。',
          type: 'success'
        });
      })
    },
    // 検索処理
    search: function() {
      // アニメーション用にローディング表示する。
      this.loading = true
      
      // 検索条件のオブジェクトを取得
      let searchCondition = this.createSearchObj()
      // 検索処理
      axios.post(Constant.URL_JOBSHEET_SEARCH, searchCondition).then((res) => {
        // 検索結果をリストにセットする。
        this.searchList = res.data

        // ローディング解除する。
        this.loading = false;
      }).catch(() => {
        // ローディング解除する。
        this.loading = false;
      })
    },
    // 台帳ダウンロード
    download: function() {
      // アニメーション用に台帳ボタンを非活性とし、ローディング表示
      this.downloading = true

      // 検索条件のオブジェクトを取得
      let searchCondition = this.createSearchObj()
      // 検索処理
      axios.post(Constant.URL_JOBSHEET_DOWNLOAD, searchCondition, {
        responseType:'blob',
        dataType:'binary'
      }).then((res) => {
        const blob = new Blob([res.data], {
                      type: "application/octet-stream"
                    });
        saveAs(blob, "台帳.xlsx")

        // 台帳ボタンを活性とし、ローディングを解除
        this.downloading = false
      }).catch(() => {
        // 台帳ボタンを活性とし、ローディングを解除
        this.downloading = false
      })
    },
    // 業務日誌一覧の行をクリックしたとき。
    rowClick: function(item) {
      if (item) {
        this.$refs['form'].resetFields();
        this.id = item.id
        this.form.client = item.client.id
        this.form.business = item.businessSystem.business.id
        this.findSystemList()
        this.form.system = item.businessSystem.id
        this.form.inquiry = item.inquiry.id
        this.form.department = item.department
        this.form.person = item.person
        // 発生日 yyyy-MM-ddを日付に変換する。
        var occurDateArr = item.occurDate.split('-')
        this.form.occurDate = new Date(occurDateArr[0], occurDateArr[1] - 1, occurDateArr[2])
        this.form.occurTime = item.occurTime
        this.form.title = item.title
        this.form.content = item.content
        this.form.contact = item.contact.id
        // 完了期限 yyyy-MM-ddを日付に変換する。
        var limitDateArr = item.limitDate.split('-')
        this.form.limitDate = new Date(limitDateArr[0], limitDateArr[1] - 1, limitDateArr[2])
        // 完了日 yyyy-MM-ddを日付に変換する。
        if (item.completeDate) {
          var completeDateArr = item.completeDate.split('-')
          this.form.completeDate = new Date(completeDateArr[0], completeDateArr[1] - 1, completeDateArr[2])
        } else {
          this.form.completeDate = ''
        }
        this.form.deal = item.deal.id
        this.form.support = item.support
        this.form.responseTime = item.responseTime
        this.fileNameList = item.fileList

        // バッジを表示する。
        if (item.completeDate) {
          // 完了
          this.badgeFlg = false
          this.badgeValue = "完了"
          this.badgeType = "success"
        } else {
          // 完了期限は23:59として比較する。
          this.form.limitDate.setHours(23)
          this.form.limitDate.setMinutes(59)
          if (this.form.limitDate < new Date()) {
            // 期限超過
            this.badgeFlg = false
            this.badgeValue = "期限超過"
            this.badgeType = "danger"
          } else {
            // 対応中
            this.badgeFlg = true
          }
        }

        // 編集状態とする。
        this.editFlg = true
        // 添付ファイルテーブルは表示状態とする。
        this.fileTableDisplay = true
      }
    },
    // 業務日誌一覧の行に設定するクラス名 完了したものと、期限を過ぎているものにクラス名を設定する。
    tableRowClassName: function({row, rowIndex}) { // eslint-disable-line
      let now = new Date()
      var arr = row.limitDate.split('-')
      let limitDate = new Date(arr[0], arr[1] - 1, arr[2], 23, 59)
      
      if (row.completeDate) {
        return 'success-row';
      } else {
        if (limitDate <  now) {
          return 'warning-row';
        } else {
          return ''
        }
      }
    },
    // 検索結果に表示する日付用フォーマッター
    formatDate: function(row, column, cellValue, index) { // eslint-disable-line
      // yyyy-MM-ddをyyyy年MM月dd日にする。
      let year = cellValue.slice(0, 4)
      let month = cellValue.slice(5, 7)
      month = Number(month)
      let day = cellValue.slice(8, 10)
      day = Number(day)
      return year + "年" + month + "月" + day + "日"
    },
    // 検索条件のオブジェクトを生成する。検索時と、台帳出力時に使用する。
    createSearchObj: function() {
      // 顧客
      let searchClient = this.searchForm.searchClient
      if (!searchClient) {
        searchClient = 0
      }
      // 業務
      let searchBusiness = this.searchForm.searchBusiness
      if (!searchBusiness) {
        searchBusiness = 0
      }
      // システム
      let searchBusinessSystem = this.searchForm.searchSystem
      if (!searchBusinessSystem) {
        searchBusinessSystem = 0
      }
      // 問合せ区分
      let searchInquiry = this.searchForm.searchInquiry
      if (!searchInquiry) {
        searchInquiry = 0;
      }
      // 発生日From-To yyyy-MM-dd
      let searchOccurDateFrom = ''
      let searchOccurDateTo = ''
      if (this.searchForm.searchOccurDate) {
        let occurFromYear = this.searchForm.searchOccurDate[0].getFullYear()
        let occurFromMonth = 1 + this.searchForm.searchOccurDate[0].getMonth()
        occurFromMonth = ('0' + occurFromMonth).slice(-2)
        let occurFromDay = this.searchForm.searchOccurDate[0].getDate()
        occurFromDay = ('0' + occurFromDay).slice(-2)
        searchOccurDateFrom = occurFromYear + '-' + occurFromMonth + '-' + occurFromDay

        let occurToYear = this.searchForm.searchOccurDate[1].getFullYear()
        let occurToMonth = 1 + this.searchForm.searchOccurDate[1].getMonth()
        occurToMonth = ('0' + occurToMonth).slice(-2)
        let occurToDay = this.searchForm.searchOccurDate[1].getDate()
        occurToDay = ('0' + occurToDay).slice(-2)
        searchOccurDateTo = occurToYear + '-' + occurToMonth + '-' + occurToDay
      }
      // 完了期限 yyyy-MM-dd
      let searchLimitDate = ''
      if (this.searchForm.searchLimitDate) {
        let limitYear = this.searchForm.searchLimitDate.getFullYear()
        let limitMonth = 1 + this.searchForm.searchLimitDate.getMonth()
        limitMonth = ('0' + limitMonth).slice(-2)
        let limitDay = this.searchForm.searchLimitDate.getDate()
        limitDay = ('0' + limitDay).slice(-2)
        searchLimitDate = limitYear + '-' + limitMonth + '-' + limitDay
      }
      // 完了サイン 1:完了、2:未完了、0:両方
      let searchCompleteSign = 0;
      if (this.searchForm.completeCheckedGroup.length == 0) {
        searchCompleteSign = 0;
      } else {
        if (this.searchForm.completeCheckedGroup[0] == "完了") {
          searchCompleteSign = 1
        } else {
          searchCompleteSign = 2
        }
      }

      // 検索オブジェクト生成
      let searchCondition = {
        client: searchClient,
        business: searchBusiness,
        businessSystem: searchBusinessSystem,
        inquiry: searchInquiry,
        contact: this.searchForm.searchContact,
        deal: this.searchForm.searchDeal,
        occurDateFrom: searchOccurDateFrom,
        occurDateTo: searchOccurDateTo,
        completeSign: searchCompleteSign,
        limitDate: searchLimitDate,
        keyword: this.searchForm.keyword
      }

      return searchCondition
    }
  },
  created: function() {
    // 顧客名リスト取得
    axios.get(Constant.URL_CLIENT_GETLIST).then((res) => {
      for(var idx in res.data) {
        this.clientList.push({value: res.data[idx].id, label: res.data[idx].name})
      }
    })

    // 業務リスト取得
    axios.get(Constant.URL_BUSINESS_GETLIST).then((res) => {
      for (var idx in res.data) {
        this.businessList.push({value: res.data[idx].id, label: res.data[idx].name})
      }
    })

    // 窓口リスト、対応者リスト ユーザテーブルから取得する。
    axios.get(Constant.URL_USER_GETLIST).then((res) => {
      for (var idx in res.data) {
        this.contactList.push({value: res.data[idx].id, label: res.data[idx].name})
        this.dealList.push({value: res.data[idx].id, label: res.data[idx].name})
      }
    })

    // 問合せ区分
    axios.get(Constant.URL_INQUIRY_GETLIST).then((res) => {
      for (var idx in res.data) {
        this.inquiryList.push({value: res.data[idx].id, label: res.data[idx].name})
      }
    })

    // 窓口には自分を初期選択
    this.searchForm.searchContact = this.$store.state.user.id
    this.form.contact = this.$store.state.user.id

    // 発生日には今日の日付を初期入力
    this.form.occurDate = new Date()

    // 初期表示時に検索する。
    this.search()
  }
}
</script>

<style>
i.user-icon {
  font-size: 2rem;
}

.el-table .warning-row {
    background: mistyrose;
  }

.el-table .success-row {
  background: #f0f9eb;
}

.fileTable-enter-active {
  transition: opacity 1.0s;
}
.fileTable-enter {
  opacity: 0.0;
}

table.searchResult {
  width: 100%;
}

table.filetable{
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
}
table.filetable th, table.filetable td{
  padding: 10px 10px;
  text-align: left;
}
table.filetable tr:nth-child(odd){
  background-color: #eee
}

ul.fileLink {
  list-style-type: none;
}

ul.fileLink a {
  font-size: 1em;
}

.department, .person, .support {
  width: 95%
}

#userIcon {
  text-align: right;
}

.btnCol {
  text-align: center;
}

#leftPart, #rightPart {
  margin: 0;
  padding: 0;
  height: 70vh;
  padding-left: 20px;
  padding-right: 20px;
}

.el-form--label-top, .el-form-item__label {
  padding: 0;
  margin: 0;
  line-height: 1;
}

.el-form-item__content {
  line-height: 1;
}

#leftPart .el-form-item {
  margin-bottom: 10px;
}

.el-select, .el-input {
  width: 200px;
}
</style>