<template>
  <div class="row">
    
    <app-header></app-header> 
    
    <div class="col s12 m12">
    </div>

    
    <div class="col s12 m12">
      <router-view></router-view>
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
