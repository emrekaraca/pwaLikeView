<template>
  <div class="row">
    <div class="s12 center-align loadingContainer">
      <img :src="logoPath" alt="" class="appLogo">
      <br>
      <div class="preloader-wrapper big active">
          <div class="spinner-layer spinner-blue-only">
              <div class="circle-clipper left">
                  <div class="circle"></div>
              </div>
              <div class="gap-patch">
                  <div class="circle"></div>
              </div>
              <div class="circle-clipper right">
                  <div class="circle"></div>
              </div>
          </div>
      </div>
      
    </div>
  </div>
</template>

<style>
.loadingContainer {
  padding-top: 80px;
  position: relative;
}

.spinner-layer {
    border-color: rgb(100, 143, 223);
}

.appLogo {
  position: absolute;
  transform: translate(-96px, 15px);
}

.preloader-wrapper {
  width: 180px!important;
  height: 180px!important;
}

</style>



<script>
export default {
  data () {
    return {

    }
  },
  computed: {
    logoPath: () => require('./../assets/logo/logo-big.png')
  }
}
</script>
