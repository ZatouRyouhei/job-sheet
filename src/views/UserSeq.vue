<template>
  <div class="userSeq">
    <h3>順序変更</h3>
    
    <div class="userSeqBtn">
      <el-button type="primary" icon="el-icon-edit" v-on:click="regist">登録</el-button>
    </div>
    
    <draggable tag="ul" :list="userList" @end="onEnd" emptyInsertThreshold="5" animation="100">
      <li v-for="user in userList" :key="user.id" :id="user.id">
        {{user.name}}
      </li>
    </draggable>
  </div>
</template>

<script>
import Constant from '../constant.js'
import draggable from 'vuedraggable'
const axios = require('axios')

export default {
  name: 'Stats',
  components: {
    draggable
  },
  data: function() {
    return {
      userList: [],
      changeList: [],
    }
  },
  methods: {
    onEnd: function(evt) {
      this.changeList = []
      evt.to.childNodes.forEach((data) => {
        this.changeList.push(data.id)
      })
    },
    regist: function() {
      let userList = {
        userList: this.changeList
      }
      axios.post(Constant.URL_USER_CHANGESEQ, userList).then(() => {
        this.$message({
              showClose: true,
              message: '登録が完了しました。',
              type: 'success'
            });
      })
    }
  },
  created: function() {
    axios.get(Constant.URL_USER_GETLIST).then((res) => {
      res.data.forEach((user) => {
        this.userList.push(user)
        this.changeList.push(user.id)
      })
    })
  }
}
</script>

<style>
.userSeq {
  width: 60%;
  height: 50vh;
  margin: 30px;
}

.userSeq ul li {
  color: #2d8fdd;
  border-left: solid 6px #2d8fdd;/*左側の線*/
  background: #f1f8ff;/*背景色*/
  margin-bottom: 3px;/*下のバーとの余白*/
  line-height: 1.5;
  padding: 0.5em;
  list-style-type: none!important;/*ポチ消す*/
  font-weight: bold;
}

.userSeq ul{
  cursor:-moz-grab;
  cursor:-webkit-grab;
  cursor: grab;
}

.userSeq ul:active{
  cursor:-moz-grab;
  cursor:-webkit-grab;
  cursor: grabbing;
}

.userSeqBtn {
  text-align: right;
}
</style>