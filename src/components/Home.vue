<template>

  <div class="main container row">
    <!-- <div class="col s12">
      <div :class="themeColor" class="card darken-1">
        <div class="card-content white-text">
          <p v-for="sentence in homeDescription">{{sentence}}</p>
        </div>
      </div>
    </div> -->

    <template v-for="option, key in options" v-if="authenticated">
      <router-link :to="option.doNotChange.link">
        <div v-if="userAccess.includes(option.doNotChange.fileName)" class="col s12 m6 l4">
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
    <div class="col s12" v-if="!authenticated">
      <div class="card small grey lighten-4">

        <div class="card-image">
          <span :class="themeColor + '-text'" class="card-title option-title text-darken-4">Login required</span>
        </div>

        <div class="card-content black-text">
          <p>Please log in to see the content</p>
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
  
</style>

<script>
import Config from './../interface_config.json'

export default {
  props: ['authenticated', 'userAccess'],
  data() {
    return {
      options: Config.activeModules,
      homeDescription: Config.homeDescription,
      themeColor: Config.themeColor
    }
  },
  methods: {
    optionPic: (key) => require('./../assets/homePics/' + key + '.png'),
  }
}
</script>
