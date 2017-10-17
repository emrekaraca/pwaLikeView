<template>
  <div class="main container">
    <div class="row">
      <div class="row">
        
        <div class="col s12">
          <div :class="themeColor" class="card darken-1">
            <div class="card-content white-text">
              <p v-for="sentence in homeDescription">{{sentence}}</p>
            </div>
          </div>
        </div>
        <template v-for="option, key in options">
          <a :href="'/#' + option.doNotChange.link">
            <div v-if="option.show" class="col s12 m4 l3">
              <div class="card large" :class="themeColor + ' lighten-4'">
                <div class="card-image">
                  <img class="imgContainer" :src="optionPic(key)">
                  <span :class="themeColor + '-text'" class="card-title option-title text-darken-4">{{option.name}}</span>
                </div>
                <div class="card-content black-text">
                  <p>{{option.description}}</p>
                </div>
              </div>
            </div>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>

<style>
  .imgContainer {
    opacity: 0.5;
  }
  .card {
    margin: 0px 0px;
    padding: 10px;
  }
  .card-image {
    height: 200px;
  }
  .option-title {
    position: relative;
    z-index: 1;
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
</style>

<script>
import Config from './../interface_config.json'

export default {
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
