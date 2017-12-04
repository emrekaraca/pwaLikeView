<template>
  <div>
    <div v-for="party in partyNames" class="col s2 m1 center-align">
      <button v-bind:class="partyButtonClasses[party]" class="btn btn-floating" @click="selectedParty = party"><img style="transform: translateY(8px)" :src="partyPic(party)" max-width="100%" height="25px" /></button>
    </div>
  </div>
</template>

<script>
import Config from './../interface_config.json'
export default {
  props: ['partyNames'],
  data () {
    return {
      selectedParty: '',
      themeColor: Config.themeColor
    }
  },
  methods: {
    partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
    init: function () {
      this.selectedParty = this.partyNames[0]
    }
  },
  watch: {
    selectedParty: function () {
      this.$emit('selectedParty', this.selectedParty)      
    }
  },
  mounted () {
    this.init()
  },
  computed: {
    partyButtonClasses: function () {
      let classes = {}
      for (let party in this.partyNames) {
        if (this.partyNames[party] === this.selectedParty) {
          classes[this.partyNames[party]] = this.themeColor + ' lighten-1'
        } else {
          classes[this.partyNames[party]] = 'grey lighten-4'
        }
      }
      return classes
    }
  }
}
</script>

<style>

</style>
