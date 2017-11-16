<template>
  <div class="row">
    <app-header></app-header> 
    <div class="col s12">
      <transition name="fade">
        <app-loading v-if="!render"></app-loading>
        <router-view v-if="render"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import Config from './interface_config.json'
import Header from './components/Header.vue'
import Loading from './components/Loading.vue'


export default {
  data () {
    return {
      render: false
    }
  },
  components: {
    'app-header': Header,
    'app-loading': Loading
  },
  methods: {
    loadVoteSwingData: function (callback1, callback2, callback3) {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getvoteswings', myInit)
      .then((response) => {
          return response.json();
      })
      .then(function(data) {
        self.$store.commit('fetchVoteSwingData', data)
        callback1(callback2, callback3)
      })
    },
    loadRawLikesAbsoluteData: function (callback2, callback3) {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getresult/' + 'dk-rawlikesabsolute' + '?&jobid=rawLikesAbsolute&dummySetting=1&start=01-2017&end=12-2017', myInit)
      .then((response) => {
          return response.json();
      })
      .then(function(data) {
        self.$store.commit('fetchRawLikesAbsoluteData', data)
        callback2(callback3)
      })
    },
    loadRawLikesData: function (callback3) {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getresult/' + 'dk-rawlikes' + '?&jobid=rawLikesNew&dummySetting=1&start=01-2017&end=12-2017&pol=dk', myInit)
      .then((response) => {
          return response.json();
      })
      .then(function(data) {
        self.$store.commit('fetchRawLikesData', data)
        callback3()
      })
    },
    loadPredictionsData: function () {
      let self = this
      // let myInit = { mode: 'cors' }
      // fetch(Config.apiUrl + 'api/getresult/' + 'dk-predictions' + '?pol=dk', myInit)
      // .then((response) => {
        //     return response.json();
      // })
      // .then(function(data) {
        //   self.$store.commit('fetchPredictionsData', data)
      // })
      self.render = true
    }
  },
  mounted () {
    this.loadVoteSwingData(this.loadRawLikesAbsoluteData, this.loadRawLikesData, this.loadPredictionsData)
    // this.loadVoteSwingData()
    // this.loadRawLikesAbsoluteData()
    
  }  
}
</script>

<style>
  body {
      background: #eceff1 
  }

  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .4s;
  }

  .fade-enter-active {
    transition-delay: .4s;
  }

  .fade-enter, .fade-leave-active {
    opacity: 0
  }

  .container {
    margin: 0 auto;
    max-width: 95%;
  }

  .col {
    padding: 0 5px!important
  }

  
  @media only screen and (min-width: 601px)
  .container {
      width: 95%;
  }

  @media only screen and (min-width: 993px)
  .container {
      width: 70%;
  }    
</style>
