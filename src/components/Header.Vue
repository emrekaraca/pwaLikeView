<template id="">
    <div class="header">
      <nav class="nav-extended">
        <div :class="themeColor" class="nav-wrapper ligthen-2">
          <a href="#" data-activates="mobile-demo" class="button-collapse"><i class="material-icons">menu</i></a>
          <ul id="nav-mobile" class="left hide-on-med-and-down">
            <li class="logo desktop-nav" :class="menuActive('Home')"><router-link to="/"><img :src="brandLogo" /></router-link></li>
            <!-- <li class="desktop-nav" :class="menuActive('Home')"><router-link to="/">Home</router-link></li> -->
            <template v-for="option in options" v-if="authenticated || !authenticationActive">
              <li class="desktop-nav" :class="menuActive(option.name)" v-if="availableOptions.includes(option.doNotChange.fileName)"><router-link :to="option.doNotChange.link">{{option.name}}</router-link></li>
            </template>
            <li class="logo desktop-nav" :class="menuActive('About')"><router-link to="/about">About</router-link></li>
          </ul>
          <ul class="side-nav" id="mobile-demo">
            <li :class="menuActive('Home')"><router-link to="/">Home</router-link></li>
            <template v-for="option in options" v-if="authenticated || !authenticationActive">
              <li :class="menuActive(option.name)" v-if="availableOptions.includes(option.doNotChange.fileName)"><router-link :to="option.doNotChange.link">{{option.name}}</router-link></li>
            </template>            
            <li :class="menuActive('About')"><router-link to="/about">About</router-link></li>
          </ul>
          <div class="brand-logo right hide-on-small-only">
            <img class="edge" src="../assets/homePics/edge.png"/>
            <a href="https://ogtal.dk" target="blank"><span class="logo orglogo"><img :src="orgLogo1" /></span></a>
            <a href="http://nxtconsulting.dk/" target="blank"><span class="logo orglogo"><img :src="orgLogo2" /></span></a>
          </div>
          <div class="brand-logo right hide-on-med-and-up valign-wrapper">
            <img class="edge" src="../assets/homePics/edge.png"/>
            <a href="https://ogtal.dk" target="blank"><span class="logo"><img class="logo smalllogo" :src="orgLogo1" /></span></a>
            <a href="http://nxtconsulting.dk/" target="blank"><span class="logo"><img class="logo smalllogo" :src="orgLogo2" /></span></a>
          </div>
        </div>
      </nav>
    </div>
</template>

<style media="screen">

  a {
    max-height: 64px
  }

  .logo {
    height: 64px;
    padding: 0px
  }

  .orglogo {
    padding: 0px 12px
  }

  .smalllogo {
    width: 70px;
    height: auto!important;
    padding: 2px;
    
  }


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

  .header {
    margin-bottom: 10px
  }

</style>

<script>
import Config from './../interface_config.json'

export default {
  props: ['authenticated', 'userAccess'],
  data () {
    return {
      authenticationActive: Config.authenticationActive,
      options: Config.activeModules,
      themeColor: Config.themeColor,
      showLogo: Config.logo.show
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
    menuWidth: function () {
      if (window.innerWidth < 500) {
        return window.innerWidth
      } else {
        return 500
      }
    },
    logoFileName: () => Config.logo.fileName,
    brandLogo: function () {
      return require('../assets/logo/' + this.logoFileName)
    },
    orgLogo1: function () {
      return require('../assets/logo/analyse.png')
    },
    orgLogo2: function () {
      return require('../assets/logo/nxt.png')
    },
    orgLogo3: function () {
      return require('../assets/logo/analyse2.png')
    }
  },
  mounted () {
    $('.button-collapse').sideNav({
      closeOnClick: true,
      draggable: true,
      menuWidth: this.menuWidth
    })
  },
  methods: {
    menuActive: function (option) {
      if (option === this.$route.name) {
        return 'active'
      }
    }
  }
}
</script>

