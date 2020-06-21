import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: {}
  },
  mutations: {
    setUser: function(state, payload) {
      state.user = payload
    }
  },
  actions: {
  },
  getters: {
    isAuth: function(state) {
      return Object.keys(state.user).length
    }
  },
  modules: {
  },
  plugins: [createPersistedState({
    key: 'job-sheet',
    storage: sessionStorage
  })]
})
