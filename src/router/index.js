import Vue from 'vue'
import Router from 'vue-router'
import Home from './../components/Home.vue'
import About from './../components/About.vue'
import Callback from './../components/Callback.vue'
import Config from './../interface_config.json'

Vue.use(Router)

let routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/callback',
    name: 'Callback',
    component: Callback
  }
]

let self = this

for (let option in Config.activeModules) {
  let componentFileName = Config.activeModules[option].doNotChange.fileName
  routes.push({
    path: Config.activeModules[option].doNotChange.link,
    name: Config.activeModules[option].name,
    component: require('./../components/' + componentFileName + '.vue')
  })
}

export default new Router({
  routes: routes,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    return { x: 0, y: 0 }
  }
})
