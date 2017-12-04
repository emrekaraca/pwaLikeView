<template>
  <div class="main container">
    <div class="row">
      <div class="col s12 card grey lighten-4">
        <div class="col s12">
          <div class="row">
            <div class="col s12 l6 center-align">
              <span class="card-title">Where did the Likes go?</span>
              
              <div id="pieChart"></div>
            </div>
            <div class="col s12 l6 center-align">
              <span class="card-title">Where did the Likes come from?</span>
              <div id="pieChart2"></div>
            </div>
          </div>
          <div class="center-align chartContainer" v-if="loading">
            <div class="preloader-wrapper big active">
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
          </div>
        </div>

        <div class="row">
          <div class="col s0 m1"></div>
          <div v-for="party in partyNames" class="col s2 m1 center-align">
            <button v-bind:class="partyButtonClasses[party]" class="btn btn-floating" @click="selectedParty = party"><img style="transform: translateY(8px)" :src="partyPic(party)" max-width="100%" height="25px" /></button>
          </div>
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
  .spinner-layer {
    border-color: #90a4ae;
  }

  .c3-circle {
    opacity: 0.3!important
  }

  #pieChart text, #pieChart2 text {
    fill: lightgrey!important;
  }
  
  #pieChart, #pieChart2 {
    filter: drop-shadow(0 2px 2px rgba(0,0,0,0.14));
    filter: drop-shadow(0 1px 5px rgba(0,0,0,0.12));
    filter: drop-shadow(0 3px 2px rgba(0,0,0,0.3));
  }

  .c3-chart-arc path, .c3 path {
    stroke: none;
  }



</style>

<script>
  import Config from './../interface_config.json'
  import WeekSelector from './WeekSelector.vue'
  import c3 from 'c3'
  let chart, chart2
  export default {
    components: {
      'app-week-selector': WeekSelector
    },
    data () {
      return {
        columns: [],
        chart: '',
        loading: true,
        partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
        timePeriods: [],
        selectedParty: 'A',
        pickedDate1: 0,
        pickedDate2: 0,
        themeColor: Config.themeColor
      }
    },
    methods: {
      newPickedDate1: function (value) {
        this.pickedDate1 = value
        console.log("NEW DATE 1", value)
      },
      newPickedDate2: function (value) {
        this.pickedDate2 = value
        console.log("NEW DATE 2", value)
      },      
      partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
      loadData: function() {
        let self = this
        let data = self.$store.state.voteSwingData.map(x => x.slice(0, x.length))
        self.loading = false
        self.timePeriods = data[0].slice(1, data[0].length)
        self.columns = data.slice(1, data.length)
        this.drawChart(this.selectedColumn)
        this.drawChart2(this.selectedColumn2)
      },
      drawChart: function (column) {
        chart = c3.generate ({
          bindto: '#pieChart',
          data: {
            columns: column,
            colors: this.partyColors,
            type: 'pie'
          },
          pie: {
            label: {
              format: function (value, ratio) { return value + ' Likes' }
            }
          },
          // size: {
          //   width: this.containerWidth
          // },
          legend: {
            show: false
          },
          transition: {
            duration: 150
          }
        })
      },
      drawChart2: function (column) {
      chart2 = c3.generate ({
          bindto: '#pieChart2',
          data: {
            columns: column,
            colors: this.partyColors2,
            type: 'pie'
          },
          pie: {
            label: {
              format: function (value, ratio) { return value + ' Likes' }
            }
          },
          size: {
            width: this.containerWidth
          },
          legend: {
            show: false
          },
          transition: {
            duration: 150
          }
        })
      }
    },
    mounted () {
      this.loadData()
    },
    watch: {
      selectedParty: function () {
        chart.load({ unload: true, columns: this.selectedColumn })
        chart2.load({ unload: true, columns: this.selectedColumn2 })
      },
      pickedDate1: function () {
        chart.load({ unload: true, columns: this.selectedColumn })
        chart2.load({ unload: true, columns: this.selectedColumn2 })
      },
      pickedDate2: function () {
        chart.load({ unload: true, columns: this.selectedColumn })          
        chart2.load({ unload: true, columns: this.selectedColumn2 })          
      }
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
      },      
      selectedColumn: function() {
        let self = this
        return this.columns
          .filter((column) => {
            if (column[0].split('-')[0] === self.selectedParty) {
              return column
            }
          })
          .map((column) => {
            let sum = 0
            for (let i = parseInt(this.pickedDate1) + 1; i <= parseInt(this.pickedDate2) + 1; i++) {
              sum += column[i]
            }
            return [column[0], sum]
          })
      },
      selectedColumn2: function () {
        let self = this
        return this.columns
          .filter((column) => {
            if (column[0].split('-')[1] === self.selectedParty) {
              return column
            }
          })
          .map((column) => {
            let sum = 0
            for (let i = parseInt(this.pickedDate1) + 1; i <= parseInt(this.pickedDate2) + 1; i++) {
              sum += column[i]
            }
            return [column[0], sum]
          })
      },
      partyColors: function () {
        let obj = {}
        let colors = {
          A: 'rgb(227, 47, 59)',
          AA: 'rgb(90, 255, 90)',
          B: 'rgb(229, 43, 145)',
          C: 'rgb(15, 133, 75)',
          D: '#2a4952',
          NB: '#2a4952',
          F: 'rgb(156, 29, 42)',
          I: 'rgb(239, 133, 53)',
          K: 'rgb((240, 172, 85)',
          O: 'rgb(0, 80, 120)',
          OE: 'rgb(115, 21, 37)',
          V: 'rgb(15, 132, 187)'        
        }
        for (let party1 in this.partyNames) {
          for (let party2 in this.partyNames) {
            obj[this.partyNames[party1] + '-' + this.partyNames[party2]] = colors[this.partyNames[party2]]
          }
        }
        return obj
      },
      partyColors2: function () {
        let obj = {}
        let colors = {
          A: 'rgb(227, 47, 59)',
          AA: 'rgb(90, 255, 90)',
          B: 'rgb(229, 43, 145)',
          C: 'rgb(15, 133, 75)',
          D: '#2a4952',
          NB: '#2a4952',
          F: 'rgb(156, 29, 42)',
          I: 'rgb(239, 133, 53)',
          K: 'rgb((240, 172, 85)',
          O: 'rgb(0, 80, 120)',
          OE: 'rgb(115, 21, 37)',
          V: 'rgb(15, 132, 187)'        
        }
        for (let party1 in this.partyNames) {
          for (let party2 in this.partyNames) {
            obj[this.partyNames[party1] + '-' + this.partyNames[party2]] = colors[this.partyNames[party1]]
          }
        }
        return obj
      }
    }
  }
</script>
