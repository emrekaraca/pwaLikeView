<template>
  <div class="main container">
    <div class="row">      
      <div class="col s12 card grey lighten-4" style="position: relative">
        <div class="card-content">
          <span class="card-title section-title">Vote Swing over Time</span>
        </div>          
        <div style="position: absolute; top: 30px; right: 10px">
          <button class="btn btn-floating" :class="themeColor" @click="toggleSpline()">
            <i class="material-icons" v-if="chartIsSpline">timeline</i>
            <i class="material-icons" v-else>show_chart</i>
          </button>
        </div>
        <div style="position: absolute; top: 30px; right: 60px">
          <button class="btn btn-floating" :class="themeColor" @click="monthly = !monthly">
            <i class="material-icons">date_range</i>
          </button>
        </div>
        <div id="chartX"></div>
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
    </div>
    <div class="row">
      <div class="col s0 m1"></div>
      <app-party-selector 
        :partyNames="partyNames"
        @selectedParty="newSelectedParty">
      </app-party-selector>
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

  .c3-line {
    stroke-width: 2px
  }

  .chartCard {
    padding: 10px;
  }  
</style>

<script>
  import Config from './../interface_config.json'
  import PartySelector from './PartySelector.vue'
  // let d3 = require("./../scripts/d3.v3.js")
  let c3 = require('c3')
  let chart

  export default {
    components: {
      'app-party-selector': PartySelector
    },
    data () {
      return {
        columns: [],
        monthlyColumns: [],
        monthly: false,
        loading: true,
        partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
        selectedParty: 'A',
        themeColor: Config.themeColor,
        chartIsSpline: false
      }
    },
    methods: {
      newSelectedParty: function (value) {
        this.selectedParty = value
        console.log("NEW Party", value)
      },
      toggleSpline: function () {
        if (this.chartIsSpline) {
          chart.transform('spline')
        } else {
          chart.transform('line')
        }
        this.chartIsSpline = !this.chartIsSpline
      },
      partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
      weeklyToMonthly: function (columns) {
        let monthlyColumns = columns.map((column) => [ column[0] ])
        for (let week = 1; week < columns[0].length; week++) {
          if (monthlyColumns[0][monthlyColumns[0].length - 1] !== columns[0][week].substring(0, 7)) {
            monthlyColumns[0].push(columns[0][week].substring(0, 7))
            for (let column = 1; column < columns.length; column++) {
              monthlyColumns[column].push(columns[column][week])
            }
          } else {
            for (let column = 1; column < columns.length; column++) {
              monthlyColumns[column][monthlyColumns[column].length - 1] += columns[column][week]
            }
          }
        }
        return monthlyColumns
      },
      loadData: function () {
        let self = this
        self.loading = false
        self.columns = self.$store.state.voteSwingData
        self.monthlyColumns = self.weeklyToMonthly(self.$store.state.voteSwingData)
        this.drawChart()
      },
      drawChart: function () {
        chart = c3.generate({
          bindto: '#chartX',
          data: {
            x: 'x1',
            xFormat: this.weeklyMonthlyFormat,
            // xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
            columns: this.selectedColumn,
            colors: this.partyColors,
            type: 'spline'
          },
          size: {
            height: 400
          },
          legend: {
            show: true
          },
          circles: {
            show: false
          },
          zoom: {
            enabled: true,
            rescale: true
          },
          axis: {
            x: {
              type: 'timeseries',
              tick: {
                format: this.weeklyMonthlyFormat
              }
            },
            y: {
              tick: {
                format: d3.format(',')
                // format: function (d) { return "$" + d; }
              },
              show: false
            }
          },
          grid: {
            y: {
              lines: [
                {value: 0, text: '0', position: 'start', class: 'lineClass'},
                {value: 25000, text: '25.000', position: 'start', class: 'lineClass'},
                {value: 50000, text: '50.000', position: 'start', class: 'lineClass'},
                {value: 75000, text: '75.000', position: 'start', class: 'lineClass'},
                {value: 100000, text: '100.000', position: 'start', class: 'lineClass'},
                {value: 150000, text: '150.000', position: 'start', class: 'lineClass'},
                {value: 200000, text: '200.000', position: 'start', class: 'lineClass'},
                {value: 300000, text: '300.000', position: 'start', class: 'lineClass'},
                {value: 400000, text: '400.000', position: 'start', class: 'lineClass'},
                {value: 500000, text: '500.000', position: 'start', class: 'lineClass'}
              ]
            }
          }
        })
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
      monthly: function () {
        this.drawChart()
      }
    },
    computed: {
      weeklyMonthlyColumns: function () {
        if (this.monthly) {
          return this.monthlyColumns
        } else {
          return this.columns
        }
      },
      weeklyMonthlyFormat: function () {
        if (this.monthly) {
          return '%Y-%m'
        } else {
          return '%Y-%m-%d'
        }
      },
      selectedColumn: function () {
        let self = this
        return this.weeklyMonthlyColumns.filter((column) => {
          if (column[0] === 'x1' || column[0].split('-')[0] === self.selectedParty) {
            return column
          }
        })
      },
      partyColors: function () {
        let obj = {}
        let colors = {
          A: 'rgb(227, 47, 59)',
          AA: 'rgb(90, 255, 90)',
          B: 'rgb(229, 43, 145)',
          C: 'rgb(15, 133, 75)',
          NB: 'rgb(0, 68, 79)',
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
      }
    }
  
  }
</script>
