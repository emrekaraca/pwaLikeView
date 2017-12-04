<template>
  <div class="main container">
    <div class="row">
      <div class="col s12 card chartCard grey lighten-4">
        <div class="card-content">
          <span class="card-title section-title">Waffle Chart</span>
        </div>
        
        <div class="chart">

        </div>
        <div class="preloader-wrapper big active" v-if="loading">
          <div class="spinner-layer spinner-red-only">
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
    
        <div class="row">
          <div class="col s0 m1"></div>
          <app-party-selector 
            :partyNames="partyNames"
            @selectedParty="newSelectedParty">
          </app-party-selector>
        </div>  
        <div class="row">
          <div class="col s1 m2"></div>
          <div class="col s10 m8">
            <app-week-selector 
                :timePeriods="timePeriods"
                @pickedDate1="newPickedDate1"
                @pickedDate2="newPickedDate2">
            </app-week-selector>
          </div>
        </div>
      </div>
    </div>
  </div>
  
</template>

<style>
  .chartCard {
    width: 100%;
  }

  .spinner-layer {
    border-color: #90a4ae;
  }

  .chart {
    width: 96%;
    padding: 0% 2%;
  }

  .label {
    font-size: 18px;
    margin-bottom: 10px;
    font-weight: bold;
    text-align: left;
  }

  .legend {
    padding-bottom: 7px;
    text-align: left;
  }

  .legend_item {
    display: inline-block;
    padding-right: 10px;
    margin-bottom: 2px;
  }

  .legend_item_icon, .legend_item_text {
    display: inline-block;
    vertical-align: middle;
  }

  .legend_item_icon {
    margin-right: 5px;
    height: 10px;
    width: 10px;
  }  

  .rect-A {
    fill: rgb(227, 47, 59)!important;
    background-color: rgb(227, 47, 59)!important;
  }
  
  .rect-AA {
    fill: rgb(90, 255, 90)!important;
    background-color: rgb(90, 255, 90)!important;
  }
  
  .rect-B {
    fill: rgb(229, 43, 145)!important;
    background-color: rgb(229, 43, 145)!important;
  }
  
  .rect-C {
    fill: rgb(15, 133, 75)!important;
    background-color: rgb(15, 133, 75)!important;
  }
  
  .rect-F {
    fill: rgb(156, 29, 42)!important;
    background-color: rgb(156, 29, 42)!important;
  }
  
  .rect-I {
    fill: rgb(239, 133, 53)!important;
    background-color: rgb(239, 133, 53)!important;
  }
  
  .rect-NB {
    fill: #2a4952!important;
    background-color: #2a4952!important;
  }
  
  .rect-O {
    fill: rgb(0, 80, 120)!important;
    background-color: rgb(0, 80, 120)!important;
  }
  
  .rect-OE {
    fill: rgb(115, 21, 37)!important;
    background-color: rgb(115, 21, 37)!important;
  }
  
  .rect-V {
    fill: rgb(15, 132, 187)!important;
    background-color: rgb(15, 132, 187)!important;
  }
  
</style>

<script>
// import * as d3 from 'c3/node_modules/d3'
import Config from './../interface_config.json'
import WaffleChart from './../scripts/waffle.js'
import WeekSelector from './WeekSelector.vue'
import PartySelector from './PartySelector.vue'

export default {
  components: {
    'app-week-selector': WeekSelector,
    'app-party-selector': PartySelector
  },
  data () {
    return {
      columns: [],
      loading: true,
      partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
      timePeriods: [],
      selectedParty: 'A',
      pickedDate1: 0,
      pickedDate2: 0,
      colors: {
        A: 'rgb(227, 47, 59)',
        AA: 'rgb(90, 255, 90)',
        B: 'rgb(229, 43, 145)',
        C: 'rgb(15, 133, 75)',
        F: 'rgb(156, 29, 42)',
        I: 'rgb(239, 133, 53)',
        D: '#2a4952',
        NB: '#2a4952',
        O: 'rgb(0, 80, 120)',
        OE: 'rgb(115, 21, 37)',
        V: 'rgb(15, 132, 187)'
      },
      themeColor: Config.themeColor
    }
  },
  methods: {
    newSelectedParty: function (value) {
      this.selectedParty = value
    },
    newPickedDate1: function (value) {
      this.pickedDate1 = value
    },
    newPickedDate2: function (value) {
      this.pickedDate2 = value
    },      
    partyColor: function (party) {
      return 'background-color: ' + this.colors[party]
    },
    loadData: function () {
      let self = this
      let data = self.$store.state.voteSwingData.map(x => x.slice(0, x.length))
      self.loading = false
      self.timePeriods = data[0].slice(1, data[0].length)
      self.pickedDate1 = self.timePeriods.length - 1
      self.pickedDate2 = self.timePeriods.length - 1
      self.columns = data.slice(1, data.length)
      return 'x'
      this.drawChart()
    },
    drawChart: function () {
      $('.chart').html('')
      var waffle = new WaffleChart()
        .selector('.chart')
        .data(this.selectedColumn)
        .useWidth(true)
        .label('Where do the likes go?')
        .size(10)
        .gap(2)
        .rows(25)
        .rounded(true)()
    }
  },
  mounted () {
    this.loadData()
    // this.computeData()
  },
  updated () {
  },
  watch: {
    selectedParty: function () {
      this.drawChart()
    },
    pickedDate1: function () {
      this.drawChart()
    },
    pickedDate2: function () {
      this.drawChart()
    }
  },
  computed: {
    voterSwing: function () {
      let others = {}
      for (let party in this.otherParties) {
        others[this.otherParties[party]] = 0
      }
      for (let party in others) {
        others[party] -= parseInt(this.columns.filter((column) => column[0] === this.selectedParty + '-' + party).map((column) => column[parseInt(this.pickedDate) + 1]))
        others[party] += parseInt(this.columns.filter((column) => column[0] === party + '-' + this.selectedParty).map((column) => column[parseInt(this.pickedDate) + 1]))
      }
      return others
    },
    otherParties: function () {
      return this.partyNames.filter((party) => party !== this.selectedParty)
    },
    selectedColumn: function () {
      let self = this
      return this.columns
        .filter((column) => {
          if (column[0].split('-')[0] === self.selectedParty) {
            return column
          }
        })
        .map((column) => {
          return [
            column[0].split('-')[1],
            column
              .slice(parseInt(this.pickedDate1) + 1, parseInt(this.pickedDate2) + 2)
              .reduce((acc, val) => { return acc + val }, 0)]
        })
        .sort((a, b) => b[1] - a[1])
    }
  }
}
</script>
