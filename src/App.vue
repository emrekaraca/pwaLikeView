<template>
  <div class="row">
    <app-header></app-header> 
    <div class="col s12 m12">
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
    max-width: 90%;
    width: 90%;
  }
  @media only screen and (min-width: 601px)
  .container {
      width: 100%;
  }
  @media only screen and (min-width: 993px)
  .container {
      width: 100%;
  }    
</style>
