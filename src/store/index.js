import Vue from 'vue'
import Vuex from 'vuex'
// import * as actions from './actions'
// import * as getters from './getters'
// import cart from './modules/cart'
// import products from './modules/products'
// import createLogger from '../../../src/plugins/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  // actions,
  // getters,
  // modules: {
  //   cart,
  //   products
  // },
  // strict: debug,
  // plugins: debug ? [createLogger()] : []
  state: {
    voteSwingData: [],
    rawLikesData: [],
    rawLikesAbsoluteData: []
  },
  mutations: {
    fetchVoteSwingData (state, n) {
      state.voteSwingData = n
    },
    fetchRawLikesData (state, n) {
      state.rawLikesData = n
    },
    fetchRawLikesAbsoluteData (state, n) {
      state.rawLikesAbsoluteData = n
    }
  }  
})