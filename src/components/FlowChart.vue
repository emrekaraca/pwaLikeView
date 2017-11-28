<template>
  <div class="main container">
    <div class="row card grey lighten-4">
      <div class="card-content">
        <span class="card-title section-title">Net Like Flow between Parties</span>
      </div>          
      
      <div class="col s12">        
        <transition name="fade">
          <div class="row">
            <div class="col m1 l3 hide-on-small-only"></div>
            <div class="col s2 m2 l1 box box-left valign-wrapper" v-bind:style="partyColor(selectedParty)"><img class="leftLogo" :src="partyPic(selectedParty)" /></div>
            <div class="col s8 m6 l4 box box-middle">
              <div class="row noMargin">
                <template v-for="party in otherParties" >
                  <div class="col s12 arrow center-align" style="position: relative" :key="party">
                    <svg height="40" width="20" style="position: absolute; left: 5; top: 0" v-if="voterSwing[party]>0"> 
                      <polygon points="20,0 20,40 0,20" v-bind:style="arrowColor(voterSwing[party])" />
                    </svg>
                    <div v-bind:style="arrowColor(voterSwing[party])" class="arrow" style="position: absolute; left: 25px; top: 0; right: 25px">
                      <span class="flowNumber">{{voterSwing[party]}}</span>
                    </div>
                    <svg height="40" width="20" style="position: absolute; right: 5; top: 0">
                      <polygon points="0,0 0,40 20,20" v-bind:style="arrowColor(voterSwing[party])" v-if="voterSwing[party]<0" />
                    </svg>        
                  </div>
                </template>
              </div>
            </div>
            <div class="col s2 m2 l1 box box-right">
              <div class="row noMargin">
                <div v-for="party in otherParties" class="col s12 right-party center-align box" v-bind:style="partyColor(party)"><img class="rightLogo" :src="partyPic(party)" /></div>
              </div>            
            </div>
          </div>
        </transition>
      </div>
      <div class="col s0 m1"></div>
      <div v-for="party in partyNames" class="col s2 m1 center-align">
        <button v-bind:class="partyButtonClasses[party]" class="btn btn-floating" @click="selectedParty = party"><img style="transform: translateY(8px)" :src="partyPic(party)" max-width="100%" height="25px" /></button>
      </div>
      <div class="col s0 m2"></div>
      <div class="col s12 m8">
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
            Until {{getSunday(timePeriods[pickedDate2])}}
            <input type="range" id="test5" min="0" v-bind:max="timePeriods.length-1" v-model="pickedDate2"/>
          </p>
        </form>              
      </div>
    </div>
  </div>
  
</template>

<style scoped>
  .box {
    height: 440px;
    padding: 0!important;
    border-radius: 3px;
  }

  .box-left {
    text-align: center;
  }

  .arrow, .right-party {
    margin-bottom: 10px;
    height: 40px;
  }

  .noMargin {
    margin: 0!important
  }

  .leftLogo {
    width: 80%;
    max-width: 50px;
    margin-left: auto;
    margin-right: auto;
  }

  .rightLogo {
    height: 95%;
    max-height: 32px;
    margin-left: auto;
    margin-right: auto;
    transform: translateY(4px);
  }

  .flowNumber {
    font-size: 18px;
    font-weight: bold;
    line-height: 40px;
    color: white;
  }
</style>

<script>
  import Config from './../interface_config.json'
  let chart

  export default {
    data () {
      return {
        columns: [],
        loading: true,
        partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
        timePeriods: [],
        selectedParty: 'A',
        pickedDate1: 0,
        pickedDate2: 0,
        multiWeek: false,
        colors: {
          A: 'rgba(227, 47, 59, 0.6)',
          AA: 'rgba(90, 255, 90, 0.6)',
          B: 'rgba(229, 43, 145, 0.6)',
          C: 'rgba(15, 133, 75, 0.6)',
          F: 'rgba(156, 29, 42, 0.6)',
          I: 'rgba(239, 133, 53, 0.6)',
          NB: 'rgba(0, 68, 79, 9.6)',
          O: 'rgba(0, 80, 120, 0.6)',
          OE: 'rgba(115, 21, 37, 0.6)',
          V: 'rgba(15, 132, 187, 0.6)'        
        },
        themeColor: Config.themeColor
        
      }
    },
    methods: {
      partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
      getMonday: function (date) {
        let monday = new Date(new Date(date).setDate(new Date(date).getDate() - 6))
        return monday.getDate() + '.' + parseInt(monday.getMonth() + 1) + '.' + monday.getFullYear()
      },
      getSunday: function (date) {
        let sunday = new Date(date)
        return sunday.getDate() + '.' + parseInt(sunday.getMonth() + 1) + '.' + sunday.getFullYear()
      },
      partyColor: function (party) {
        return "background-color: " + this.colors[party]
      },
      arrowColor: function (swingValue) {
        let alpha = Math.abs(swingValue) / Math.max(...Object.values(this.voterSwing).map((x) => Math.abs(x))) + 0.5

        if (swingValue > 0) {
          return "background-color: rgba(50,205,50," + alpha + "); fill: rgba(50, 205, 50, " + alpha + ")"
        }
        else if (swingValue < 0) {
          return "background-color: rgba(220,20,60," + alpha + "); fill: rgba(220, 20, 60, " + alpha + ")"
        } else {
          return "background-color: rgb(220,220,220); fill: rgb(220, 220, 220)"           
        }
      },
      loadData: function () {
        let self = this
        let myInit = { 
          mode: 'cors'
        }
        fetch(Config.apiUrl + 'api/getvoteswings', myInit)
        .then((response) => {
          return response.json()
        })
        .then(function (data) {
          console.log(data);
          self.loading = false
          self.timePeriods = data[0].slice(1, data[0].length)
          self.pickedDate1 = self.timePeriods.length-1
          self.pickedDate2 = self.timePeriods.length-1
          self.columns = data.slice(1, data.length)
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
      pickedDate1: function () {
        if (!this.multiWeek) {
          this.pickedDate2 = this.pickedDate1
        }
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
          others[party] -= parseInt(this.columns
            .filter((column) => column[0] === this.selectedParty + '-' + party)
            .map((column) => {
              let sum = 0
              for (let i = parseInt(this.pickedDate1)+1; i <= parseInt(this.pickedDate2)+1; i++) { 
                sum += column[i] 
              }
              return [sum]
            })
          )
          others[party] += parseInt(this.columns
            .filter((column) => column[0] == party + '-' + this.selectedParty)
            .map((column) => {
              let sum = 0
              for (let i = parseInt(this.pickedDate1) + 1; i <= parseInt(this.pickedDate2) + 1; i++) { 
                sum += column[i]
              } 
              return [sum]
            }))
        }
        return others

      },
      partyButtonClasses: function () {
        let classes = {};
        for (let party in this.partyNames) {
          if (this.partyNames[party] === this.selectedParty) {
            classes[this.partyNames[party]] = this.themeColor + ' lighten-1'
          } else {
            classes[this.partyNames[party]] = 'grey lighten-4'
          }
        }
        return classes
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
            let sum = 0;
            for (let i = parseInt(this.pickedDate1) + 1; i <= parseInt(this.pickedDate2) + 1; i++) {
              sum += column[i]
            }
            return [column[0], sum]
          })
      },
    }
  }
</script>
