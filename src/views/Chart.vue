<template>
  <div class="chart">
    <h3>グラフ</h3>
    <el-form label-position="top" ref="form" :model="form" :rules="rules">
      <el-row type="flex" align="bottom">
        <el-col :span="4">
          <el-form-item prop="targetYear" label="年度">
            <el-input-number 
              v-model="form.targetYear"
              :precision="0"
              :step="1"
              :min="2019"
              style="width: 200px;">
            </el-input-number>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item prop="targetSystem" label="システム">
            <el-select v-model="form.targetSystem" clearable>
              <el-option
                  v-for="item in systemList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-form-item>
            <el-button type="primary" icon="el-icon-data-analysis" v-on:click="stat">グラフ</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <line-chart id="chart" :data="chartData" :library="option" width="1100px" :messages="{empty: 'No data'}"></line-chart>
    
  </div>
</template>

<script>
import Constant from '../constant.js'
const axios = require('axios')

export default {
  name: 'Chart',
  data: function() {
    return {
      form: {
        targetYear: '',
        targetSystem: ''
      },
      rules: {
        targetYear: [
          {required: true, message: '年度が未入力です。', trigger: 'blur'}
        ],
        targetSystem: [
          {required: true, message: 'システムが未入力です。', trigger: 'blur'}
        ]
      },
      systemList: [],
      chartData: [],
      option: {
        animation: {
          duration: 300,
          easing: 'linear'
        },
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1
            }
          }]
        }
      }
    }
  },
  methods: {
    stat: function() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          axios
            .get(Constant.URL_JOBSHEET_STATS + this.form.targetYear + "/" + this.form.targetSystem)
            .then((res) => {
              let occurObj = {
                '4月': res.data.occurCnt4,
                '5月': res.data.occurCnt5,
                '6月': res.data.occurCnt6,
                '7月': res.data.occurCnt7,
                '8月': res.data.occurCnt8,
                '9月': res.data.occurCnt9,
                '10月': res.data.occurCnt10,
                '11月': res.data.occurCnt11,
                '12月': res.data.occurCnt12,
                '1月': res.data.occurCnt1,
                '2月': res.data.occurCnt2,
                '3月': res.data.occurCnt3
              }

              let completeObj = {
                '4月': res.data.completeCnt4,
                '5月': res.data.completeCnt5,
                '6月': res.data.completeCnt6,
                '7月': res.data.completeCnt7,
                '8月': res.data.completeCnt8,
                '9月': res.data.completeCnt9,
                '10月': res.data.completeCnt10,
                '11月': res.data.completeCnt11,
                '12月': res.data.completeCnt12,
                '1月': res.data.completeCnt1,
                '2月': res.data.completeCnt2,
                '3月': res.data.completeCnt3
              }

              this.chartData = [
                {name: "問合件数", data: occurObj},
                {name: "完了件数", data: completeObj}
              ]
          })
        }
      })
    }
  },
  created: function() {
    // 年度の初期値（現在の年度）を設定
    let now = new Date()
    let nowYear = now.getFullYear()
    let nowMonth = 1 + now.getMonth()
    if (nowMonth <= 3) {
      nowYear = nowYear - 1
    }
    this.form.targetYear = nowYear

    // システムプルダウン生成
    axios.get(Constant.URL_SYSTEM_GETLIST).then((res) => {
      res.data.forEach((system) => {
        this.systemList.push({label: system.name, value: system.id})
      })
    })
  }
}
</script>

<style>
.chart {
  width: 1500px;
  margin: 30px;
}

#chart {
  margin-top: 20px;
}
</style>