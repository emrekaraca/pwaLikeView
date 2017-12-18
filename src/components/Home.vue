<template>

  <div class="main container row">
    <!-- <div class="col s12">
      <div :class="themeColor" class="card darken-1">
        <div class="card-content white-text">
          <p v-for="sentence in homeDescription">{{sentence}}</p>
        </div>
      </div>
    </div> -->

    <div class="col s12 l4" >
    <!-- <div class="col s12" v-if="!authenticated && authenticationActive"> -->
      <div class="card small grey lighten-4">
        <div class="card-content black-text">
          <span class="big-logo"><img :src="bigLogo" alt=""></span>
        </div>
      </div>
    </div>

    <div class="col s12 l4" >
    <!-- <div class="col s12" v-if="!authenticated && authenticationActive"> -->
      <div class="card small grey lighten-4">

        <div class="card-content black-text">
          <span class="card-title">Welcome to Likeview</span>
          <p>Likeview is an experimental tool for the analysis of the social media performance of the Danish political parties.</p>
        </div>

      </div>
    </div>

    <!-- <div class="col s4" v-if="true"> -->
    <div class="col s12 l4" v-if="!authenticated && authenticationActive">
      <div class="card small grey lighten-4">
        <div class="card-content black-text">
          <span class="card-title">Login / Sign Up</span>
          <p>Please login or create a free account by clicking on the login button.</p>
        </div>
      <button
        class="btn btn-large btn-login2 z-depth-4"
        @click="login()">
          <span>Login</span>
      </button>
      </div>
    </div>
    
    <!-- <div class="col s4" v-else> -->
    <div class="col s12 l4" v-if="authenticated && authenticationActive">
      <div class="card small grey lighten-4">
        <div class="card-content black-text">
          <span class="card-title">Welcome {{userEmail}}!</span>
          <p>You are authorized to see data leading up until {{userMax}}.</p>

        </div>
      <button
        class="btn btn-large btn-login2 z-depth-4"
        @click="logout()">
          <i class="material-icons loginIcon">power_settings_new</i>
      </button>
      </div>
    </div>
    

    <template v-for="option, key in options" v-if="authenticated || !authenticationActive">
      <router-link :to="option.doNotChange.link">
        <div v-if="availableOptions.includes(option.doNotChange.fileName)" class="col s12 m6 l4">
          <div class="card small grey lighten-4">

            <div class="card-image">
              <img class="imgContainer" :src="optionPic(key)">
              <span :class="themeColor + '-text'" class="card-title option-title text-darken-4">{{option.name}}</span>
            </div>

            <div class="card-content black-text">
              <p>{{option.description}}</p>
            </div>

          </div>
        </div>
      </router-link>
    </template>

  </div>
</template>

<style scoped>
  .imgContainer {
    opacity: 0.7;
  }
  .card {
      padding: 10px;
  }
  .card-image {
    height: 130px;
  }
  .card-content {
    max-height: 100%!important;
  }
  .option-title {
    position: relative;
    z-index: 1;
    top:0;
    width: 100%;
  }
  .option-title::before {
    content: "";
    position: absolute;
    top: 0; 
    left: 0;
    width: 100%; 
    height: 100%;  
    opacity: .4; 
    z-index: -1;
    background-color: white;
  }

  .card:hover {
      box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);        
  }

  .btn-login2 {
    position: absolute!important;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 400!important;
    background-color: rgb(100,144,224)!important;
    width: 200px;
  }

  .big-logo {
    position: absolute!important;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  
</style>

<script>
import Config from './../interface_config.json'


export default {
  props: ['authenticated', 'userAccess', 'logout', 'login', 'userEmail', 'userMax'],
  data() {
    return {
      options: Config.activeModules,
      authenticationActive: Config.authenticationActive,
      homeDescription: Config.homeDescription,
      themeColor: Config.themeColor
    }
  },
  computed: {
    availableOptions: function () {
      if (this.authenticationActive) {
        return this.userAccess
      } else {
        let result = []
        for (let option in this.options) {
          if (this.options[option].show) {
            result.push(this.options[option].doNotChange.fileName)
          }
        }
        return result
      }
    },
    bigLogo: function () {
      return require('../assets/logo/logo-big.png')
    }    
  },  
  methods: {
    optionPic: (key) => require('./../assets/homePics/' + key + '.png'),
  }
}
</script>
