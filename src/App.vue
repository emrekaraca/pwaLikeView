<template>
  <div class="row">
    <app-header></app-header> 
    <div class="col s12">
      <transition name="fade">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>

import Header from './components/Header.vue'


export default {
  data () {
    return {
    }
  },
  components: {
    'app-header': Header
  }
}
</script>

<style>
  .fade-enter-active, .fade-leave-active {
    transition-property: opacity;
    transition-duration: .25s;
  }

  .fade-enter-active {
    transition-delay: .5s;
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
