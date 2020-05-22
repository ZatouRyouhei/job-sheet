<template>
  <div class="admin">
    <el-row>
      <el-col :span="18">
        <el-menu mode="horizontal" :router="isRouter">
          <el-submenu index="1">
            <template v-slot:title>テーブル管理</template>
            <el-menu-item index="/admin/table/user">
              ユーザテーブル
            </el-menu-item>
            <el-menu-item index="/admin/table/business">
              業務テーブル
            </el-menu-item>
            <el-menu-item index="/admin/table/system">
              システムテーブル
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="/admin/stats">
            集計
          </el-menu-item>
          <el-menu-item index="/admin/userSeq">
            順序変更
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :span="6">
        <el-dropdown>
          <i class="user-icon el-icon-user-solid"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item disabled>{{$store.state.user.name}}さん</el-dropdown-item>
            <el-dropdown-item v-on:click.native="toTop">トップ</el-dropdown-item>
            <el-dropdown-item v-on:click.native="logout">ログアウト</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
    <transition appear>
      <router-view />
    </transition>
  </div>
</template>

<script>
export default {
  name: 'Admin',
  data: function() {
    return {
      isRouter: true
    }
  },
  methods: {
    logout: function() {
      this.$store.commit('setUser', {})
      this.$router.push('/')
    },
    toTop: function() {
      this.$router.push('/about')
    },
  }
}
</script>

<style>
i.user-icon {
  font-size: 2rem;
}

.admin {
  width: 900px;
}
</style>