<template id="">
    <div class="header">
      <nav class="nav-extended">
        <div class="nav-wrapper blue-grey ligthen-2">
          <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
          <ul id="nav-mobile" class="left hide-on-med-and-down">
            <li class="desktop-nav" :class="menuActive('Home')"><router-link to="/">Home</router-link></li>
            <template v-for="option in options">
              <li class="desktop-nav" :class="menuActive(option.name)" v-if="option.show"><router-link :to=option.doNotChange.link>{{option.name}}</router-link></li>
            </template>
          </ul>
          <ul class="side-nav" id="mobile-demo">
            <li :class="menuActive('Home')"><router-link to="/">Home</router-link></li>
            <template v-for="option in options">
              <li :class="menuActive(option.name)" v-if="option.show"><router-link :to=option.doNotChange.link>{{option.name}}</router-link></li>
            </template>            
          </ul>
        </div>
      </nav>
    </div>
</template>

<style media="screen">
</style>

<script>
import Config from './../interface_config.json'

export default {
  data() {
    return {
      options: Config.activeModules
    }
  },
  computed: {
    menuWidth: function () {
        if (window.innerWidth < 500) {
            return window.innerWidth
        } else {
            return 500
        }
    }    
  },
  mounted() {
        $(".button-collapse").sideNav({
          closeOnClick: true,
          draggable: true,
          menuWidth: this.menuWidth
        });
  },
  methods: {
    menuActive: function(option) {
      if (option == this.$route.name) {
        return "active"
      } else {
        return
      }
    }
  }
}
</script>

