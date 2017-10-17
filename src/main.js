import Vue from 'vue'
import store from './store'
import App from './App.vue'
import router from './router'
import c3Css from 'c3/c3.css'
import $ from 'jquery'
import 'materialize-css'
import materializeCss from 'materialize-css/dist/css/materialize.min.css'
import materialIcons from './styles/materialIcons.css'
let interfaceConfig = require('./interface_config.json')
let themeColor = interfaceConfig.themeColor

export const eventBus = new Vue();

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})

