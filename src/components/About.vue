<template>

  <div class="main container row">

    <div class="col s12 l4" >
    <!-- <div class="col s12" v-if="!authenticated && authenticationActive"> -->
      <div class="card small grey lighten-4">
        <div class="card-content black-text">
          <span class="big-logo"><img :src="bigLogo" alt=""></span>
        </div>
      </div>
    </div>

    <div class="col s12 l8" >
    <!-- <div class="col s12" v-if="!authenticated && authenticationActive"> -->
      <div class="card small grey lighten-4">
        <div class="card-content black-text">
          <span class="card-title">Likeview</span>
          <p>Likeview is ...</p>
        </div>

      </div>
    </div>

    <div class="col s12 l6" >
    <!-- <div class="col s12" v-if="!authenticated && authenticationActive"> -->
      <div class="card small grey lighten-4">
        <div class="center-align">
          <img :src="orgLogo1" alt="">
        </div>

        <div class="card-content black-text">
          <span class="card-title">Analyse & Tal</span>
          <p>Analyse & Tal is ...</p>
        </div>

      </div>
    </div>

    <div class="col s12 l6" >
    <!-- <div class="col s12" v-if="!authenticated && authenticationActive"> -->
      <div class="card small grey lighten-4">
        <img :src="orgLogo2" alt="">

        <div class="card-content black-text">
          <span class="card-title">Nextwork Consulting</span>
          <p>Nextwork Consulting is ...</p>
        </div>

      </div>
    </div>


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

  .card:hover {
      box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);        
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
  data() {
    return {
      themeColor: Config.themeColor
    }
  },
  computed: {
    bigLogo: function () {
      return require('../assets/logo/logo-big.png')
    },
    orgLogo1: function () {
      return require('../assets/logo/analyse.png')
    },
    orgLogo2: function () {
      return require('../assets/logo/nxt.png')
    }    
  }
}
</script>
