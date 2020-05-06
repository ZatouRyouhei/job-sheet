<template>
  <div class="stats">
    <h3>集計</h3>
    <el-form label-position="top" ref="form" :model="form" :rules="rules">
      <el-row type="flex" align="bottom">
        <el-col :span="8">
          <el-form-item prop="targetYear" label="年度">
            <el-input-number v-model="form.targetYear" :precision="0" :step="1" :min="2019" style="width: 200px;"></el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item>
            <el-button type="primary" icon="el-icon-data-analysis" v-on:click="stat">集計</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <el-table
      ref="statsList"
      :data="statsList"
      stripe
      highlight-current-row
      v-loading="loading"
      height="620"
      style="width: 100%">
      <el-table-column fixed prop="businessSystem.name" label="システム" width="190"></el-table-column>
      <el-table-column label="4月">
        <el-table-column prop="occurCnt4" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt4" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime4" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="5月">
        <el-table-column prop="occurCnt5" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt5" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime5" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="6月">
        <el-table-column prop="occurCnt6" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt6" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime6" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="7月">
        <el-table-column prop="occurCnt7" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt7" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime7" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="8月">
        <el-table-column prop="occurCnt8" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt8" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime8" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="9月">
        <el-table-column prop="occurCnt9" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt9" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime9" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="10月">
        <el-table-column prop="occurCnt10" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt10" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime10" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="11月">
        <el-table-column prop="occurCnt11" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt11" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime11" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="12月">
        <el-table-column prop="occurCnt12" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt12" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime12" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="1月">
        <el-table-column prop="occurCnt1" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt1" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime1" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="2月">
        <el-table-column prop="occurCnt2" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt2" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime2" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column label="3月">
        <el-table-column prop="occurCnt3" label="発生" width="50"></el-table-column>
        <el-table-column prop="completeCnt3" label="完了" width="50"></el-table-column>
        <el-table-column prop="responseTime3" label="時間" width="60"></el-table-column>
      </el-table-column>
      <el-table-column fixed="right" prop="responseTimeSum" label="合計時間"></el-table-column>
      <el-table-column fixed="right" prop="leftCnt" label="未完了"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import Constant from '../constant.js'
const axios = require('axios')

export default {
  name: 'Stats',
  data: function() {
    return {
      form: {
        targetYear: '',
      },
      rules: {
        targetYear: [
          {required: true, message: '年度が未入力です。', trigger: 'blur'}
        ]
      },
      statsList: [],
      loading: false
    }
  },
  methods: {
    stat: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          axios.get(Constant.URL_JOBSHEET_STATS + this.form.targetYear).then((res) => {
            this.statsList = res.data
            this.loading = false
          })
        }
      })
    }
  },
  created: function() {
    let now = new Date()
    let nowYear = now.getFullYear()
    let nowMonth = 1 + now.getMonth()
    if (nowMonth <= 3) {
      nowYear = nowYear - 1
    }
    this.form.targetYear = nowYear
  }
}
</script>

<style>
.stats {
  width: 1500px;
  margin: 30px;
}
</style>