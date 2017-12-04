<template>
  <div>
    <form action="#">
    <p class="range-field">
      <span>From {{getMonday(timePeriods[pickedDate1])}}</span>
      <span v-if="!multiWeek"> <--> Until {{getSunday(timePeriods[pickedDate1])}}</span>
      <span class="switch right">
        <label>
        Single-Week
        <input type="checkbox" v-model="multiWeek">
        <span class="lever"></span>
        Multi-Week
        </label>
      </span>
      
      <input type="range" id="test5" min="0" v-bind:max="timePeriods.length-1" v-model="pickedDate1"/>
    </p>
    </form>
    <form action="#" v-if="multiWeek">
      <p class="range-field">
        <span>Until {{getSunday(timePeriods[pickedDate2])}}</span>
        <input type="range" id="test5" min="0" v-bind:max="timePeriods.length-1" v-model="pickedDate2"/>
      </p>
    </form>        
  </div>
</template>

<script>
export default {
  props: ['timePeriods'],
  data () {
    return {
      pickedDate1: 0,
      pickedDate2: 0,
      multiWeek: false
    }
  },
  methods: {
    init: function () {
      this.pickedDate1 = this.timePeriods.length-1
      this.pickedDate2 = this.timePeriods.length-1
    },
    getMonday: function (date) {
      let monday = new Date(new Date(date).setDate(new Date(date).getDate()-6))
      return monday.getDate() + '.' + parseInt(monday.getMonth()+1) + '.' + monday.getFullYear()
    },
    getSunday: function (date) {
      let sunday = new Date(date)
      return sunday.getDate() + '.' + parseInt(sunday.getMonth()+1) + '.' + sunday.getFullYear()
    }    
  },
  watch: {
    pickedDate1: function () {
      if (!this.multiWeek) {
        this.pickedDate2 = this.pickedDate1
        this.$emit('pickedDate2', this.pickedDate2)
      }
      this.$emit('pickedDate1', this.pickedDate1)
    },
    pickedDate2: function () {
      this.$emit('pickedDate2', this.pickedDate2)
    },
    multiWeek: function () {
      if (!this.multiWeek) {
        this.pickedDate2 = this.pickedDate1
        this.$emit('pickedDate2', this.pickedDate2)
      }
    },
    timePeriods: function () {
      this.init()
    }
  }
}
</script>

<style>

</style>
