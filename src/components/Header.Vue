<template id="">
    <div class="header">
      <nav class="nav-extended">
        <div :class="themeColor" class="nav-wrapper ligthen-2">
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
          <router-link v-if="showLogo" to="/" class="brand-logo right">
            <img class="edge" src="../assets/homePics/edge.png"/>
            <span class="logo"><img src="../assets/logo/logo.png"/></span>
          </router-link>
        </div>
      </nav>
    </div>
</template>

<style media="screen">

  .nav-extended .nav-wrapper {
    overflow: hidden;
  }

  .nav-extended .nav-wrapper .brand-logo {
    transform: translateX(10px);
    height: 100%;
  }

  .nav-extended .nav-wrapper .brand-logo .logo {
    height: 100%;
    background-color: white;
    float: right;
  }

  .nav-extended .nav-wrapper .brand-logo .edge {
    height: 100%;
  }

  .nav-extended .nav-wrapper .brand-logo .logo img {
    padding: 5% 5px 5% 0%;
    height: 90%;
  }


</style>

<script>
import Config from './../interface_config.json'

export default {
  data() {
    return {
      options: Config.activeModules,
      themeColor: Config.themeColor,
      showLogo: Config.logo.show
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

