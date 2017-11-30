<template>
  <div class="row">
      <button
        class="btn btn-floating btn-large btn-login z-depth-4"
        v-if="!authenticated && authenticationActive"
        @click="login()">
          <i class="material-icons loginIcon">account_circle</i>
      </button>

      <button
        class="btn btn-floating btn-large btn-login z-depth-4"
        v-if="authenticated && authenticationActive"
        @click="logout()">
          <i class="material-icons loginIcon">power_settings_new</i>
      </button>



    
    <app-header :authenticated="authenticated" :userAccess="userAccess"></app-header> 
    <div class="col s12">
      <transition name="fade">
        <app-loading v-if="!render"></app-loading>
        <router-view 
          :auth="auth"
          :authenticated="authenticated"
          :userAccess="userAccess"
          :trueMin="trueMin"
          :trueMax="trueMax"
          v-if="render">

        </router-view>
      </transition>
    </div>
  </div>
</template>

<script>
import Config from './interface_config.json'
import Header from './components/Header.vue'
import Loading from './components/Loading.vue'

import AuthService from './auth/AuthService'

const auth = new AuthService()

const { login, logout, authenticated, userAccess, userMin, userMax, authNotifier } = auth

export default {
  data () {
    authNotifier.on('authChange', authState => {
      this.authenticated = authState.authenticated
      this.userAccess = authState.userAccess,
      this.userMin = authState.userMin,
      this.userMax = authState.userMax
    })
    // authNotifier.on('userChange', userState => {
    //   console.log("user3:", userState)
    //   this.user = userState
    // })
    return {
      authenticationActive: Config.authenticationActive,
      auth,
      authenticated,
      userAccess,
      userMin,
      userMax,
      render: false,
      defaultMin: Config.defaultMin,
      defaultMax: Config.defaultMax
    }
  },
  components: {
    'app-header': Header,
    'app-loading': Loading
  },
  methods: {
    login,
    logout,   
    loadVoteSwingData: function (callback1, callback2, callback3) {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getvoteswings', myInit)
        .then((response) => {
            return response.json()
        })
        .then(function(data) {
          self.$store.commit('fetchVoteSwingData', data)
          callback1(callback2, callback3)
        })
    },
    loadRawLikesAbsoluteData: function (callback2, callback3) {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getresult/' + 'dk-rawlikesabsolute' + '?&jobid=rawLikesAbsolute&dummySetting=1&start=' + this.trueMin + '&end=' + this.trueMax, myInit)
        .then((response) => {
          return response.json()
        })
        .then(function(data) {
          self.$store.commit('fetchRawLikesAbsoluteData', data)
          callback2(callback3)
        })
    },
    loadRawLikesData: function (callback3) {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getresult/' + 'dk-rawlikes' + '?&jobid=rawLikesNew&dummySetting=1&start=' + this.trueMin + '&end=' + this.trueMax + '&pol=dk', myInit)
        .then((response) => {
            return response.json()
        })
        .then(function (data) {
          self.$store.commit('fetchRawLikesData', data)
          callback3()
        })
    },
    loadPredictionsData: function () {
      let self = this
      let myInit = { mode: 'cors' }
      fetch(Config.apiUrl + 'api/getresult/' + 'dk-predictions' + '?jobid=stdModel_unweighted&pol=dk&start=' + this.trueMin + '&end=' + this.trueMax, myInit)
      .then((response) => {
        return response.json()
      })
      .then(function (data) {
        self.$store.commit('fetchPredictionsData', data)
      })
      self.render = true
    }
  },
  computed: {
    trueMin: function () {
      if (this.userMin < this.defaultMin || !this.userMin) {
        return this.defaultMin
      } else { 
        return this.userMin
      }
    },
    trueMax: function () {
      if (this.userMax > this.defaultMax || !this.userMax) {
        return this.defaultMax
      } else {
        return this.userMax
      }
    },
    isCallback: function () {
      if (this.$route.name === 'Callback') {
        return true
      } else {
        return false
      }
    }
  },
  watch: {
    isCallback: function () {
      this.render = false
      if (this.authenticated || !this.authenticationActive) {
        console.log("loading LOGIN")
        this.loadVoteSwingData(this.loadRawLikesAbsoluteData, this.loadRawLikesData, this.loadPredictionsData)
      } else {
        this.render = true
      }    
    }
  },
  mounted () {
    console.log('MOUNTING!')
    if (this.authenticated || !this.authenticationActive) {
      console.log("loading MOUNT")
      this.loadVoteSwingData(this.loadRawLikesAbsoluteData, this.loadRawLikesData, this.loadPredictionsData)
    } else {
      this.render = true
    }
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

  .btn-login {
    position: fixed!important;
    bottom: 10px;
    right: 10px;
    z-index: 500!important;
    background-color: rgb(100,144,224)!important;
  }
  
  .btn-login:focus {
    background-color: rgb(100,144,224)!important;
  }
  
  .btn-login:hover {
    background-color: rgba(100,144,224, 0.7)!important;
  }
  
  .loginIcon {
    font-size: 2rem!important;
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
