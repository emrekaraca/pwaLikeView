<template>
  <div class="row">
    <app-header></app-header> 
    <div class="col s12">
      <transition name="fade">
        <router-view v-if="render"></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import Config from './interface_config.json'
import Header from './components/Header.vue'


export default {
  data () {
    return {
      render: false
    }
  },
  components: {
    'app-header': Header
  },
  methods: {
    loadVoteSwingData: function () {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getvoteswings', myInit)
      .then((response) => {
          return response.json();
      })
      .then(function(data) {
        self.$store.commit('fetchVoteSwingData', data)
        return
      })
    },
    loadRawLikesAbsoluteData: function () {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getresult/' + 'dk-rawlikesabsolute' + '?&jobid=rawLikesAbsolute&dummySetting=1&start=07-2017&end=12-2017', myInit)
      .then((response) => {
          return response.json();
      })
      .then(function(data) {
        self.$store.commit('fetchRawLikesAbsoluteData', data)
        return
      })
    },
    loadRawLikesData: function () {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getresult/' + 'dk-rawlikes' + '?&jobid=rawLikesNew&dummySetting=1&start=07-2017&end=12-2017&pol=dk', myInit)
      .then((response) => {
          return response.json();
      })
      .then(function(data) {
        self.$store.commit('fetchRawLikesData', data)
        return
      })
    }
  },
  mounted() {
    this.loadRawLikesData()
    this.loadVoteSwingData()
    this.loadRawLikesAbsoluteData()
    this.render = true
  }  
}
</script>

<style>
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
    max-width:80%;
    width: 80%;
  }

  .col {
    padding: 4px!important
  }

  
  @media only screen and (min-width: 601px)
  .container {
      width: 75%;
  }

  @media only screen and (min-width: 993px)
  .container {
      width: 70%;
  }    
</style>
