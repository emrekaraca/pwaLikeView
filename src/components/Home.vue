<template>
  <div class="main container">
    <div class="row">
      <div class="col s0 m1"></div>
      <div class="col s12">
        <div class="row">
          
          <div class="col s12">
            <div class="card blue-grey darken-1">
              <div class="card-content white-text">
                <span class="card-title">Home</span>
                <p v-for="sentence in homeDescription">{{sentence}}</p>
              </div>
            </div>
          </div>
          <template v-for="option, key in options">
            <div v-if="option.show" class="card large col s12 m4 l3">
              <div class="card-image">
                <a :href="'/#' + option.doNotChange.link"><img class="imgContainer" :src="optionPic(key)"></a>
                <span class="card-title blue-grey-text">{{option.name}}</span>
              </div>
              <div class="card-content">
                <p>{{option.description}}</p>
              </div>
              <div class="card-action">
                <a :href="'/#' + option.doNotChange.link">Explore</a>
              </div>
            </div>
          </template>

        </div>
      </div>
    </div>
  </div>
</template>

<style>
  .imgContainer {
    opacity: 0.5;
  }
  .card-image {
    height: 200px;
  }
</style>

<script>
import Config from './../interface_config.json'

export default {
  data() {
    return {
      options: Config.activeModules,
      homeDescription: Config.homeDescription
    }
  },
  methods: {
    optionPic: (key) => require('./../assets/homePics/' + key + '.png')
  }
}
</script>
