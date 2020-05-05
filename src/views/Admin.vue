<template>
  <div class="admin">
    <el-row>
      <el-col :span="18">
        <el-menu mode="horizontal">
          <el-submenu index="1">
            <template v-slot:title>テーブル管理</template>
            <el-menu-item index="1-1">
              <router-link to="/admin/table/user">ユーザテーブル</router-link>
            </el-menu-item>
            <el-menu-item index="1-2">
              <router-link to="/admin/table/business">業務テーブル</router-link>
            </el-menu-item>
            <el-menu-item index="1-3">
              <router-link to="/admin/table/system">システムテーブル</router-link>
            </el-menu-item>
          </el-submenu>
          <el-menu-item index="2">
            <router-link to="/admin/stats">集計</router-link>
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