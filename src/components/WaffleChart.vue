<template>
    <div class="main container">
        <div class="row">
            <div class="col s12">
                <div :class="themeColor" class="card title-card lighten-1">
                    <div class="card-content">
                        <span class="card-title section-title white-text">Waffle Chart</span>
                    </div>
                </div>
            </div>    
        </div>

        <div class="row">
            <div class="col s12 center-align">
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
                
            </div>
        </div>

        <div class="row">
            <div class="col s0 m1"></div>
            <div v-for="party in partyNames" class="col s2 m1 center-align">
                <button v-bind:class="partyButtonClasses[party]" class="btn btn-floating" @click="selectedParty = party"><img style="transform: translateY(6px)" :src="partyPic(party)" /></button>
            </div>
        </div>
        <div class="row">
            <div class="col s0 m2"></div>
            <div class="col s0 m8">
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

<style>
    .spinner-layer {
        border-color: #90a4ae;
    }

    .chart {
        width: 100%;
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
        fill: rgb(240, 172, 85)!important;
        background-color: rgb(240, 172, 85)!important;
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
    import c3 from 'c3/node_modules/d3'
    import Config from './../interface_config.json'
    import WaffleChart from './../scripts/waffle.js'

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
                    A: 'rgb(227, 47, 59)',
                    AA: 'rgb(90, 255, 90)',
                    B: 'rgb(229, 43, 145)',
                    C: 'rgb(15, 133, 75)',
                    F: 'rgb(156, 29, 42)',
                    I: 'rgb(239, 133, 53)',
                    NB: 'rgb(240, 172, 85)',
                    O: 'rgb(0, 80, 120)',
                    OE: 'rgb(115, 21, 37)',
                    V: 'rgb(15, 132, 187)'                
                },
                themeColor: Config.themeColor
                
            }
        },
        methods: {
            partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),            
            getMonday: function (date) {
                let monday = new Date(new Date(date).setDate(new Date(date).getDate()-6))
                return monday.getDate() + '.' + parseInt(monday.getMonth()+1) + '.' + monday.getFullYear()
            },
            getSunday: function (date) {
                let sunday = new Date(date)
                return sunday.getDate() + '.' + parseInt(sunday.getMonth()+1) + '.' + sunday.getFullYear()
            },
            partyColor: function (party) {
                return "background-color: " + this.colors[party]
            },
            arrowColor: function (swingValue, party, selectedParty) {
                if (swingValue > 0) {
                    return "background-color: " + this.colors[party]
                }
                else if (swingValue < 0) {
                    return "background-color: " + this.colors[selectedParty]
                } else {
                    return "background-color: grey"                   
                }
            },
            loadData: function() {
                let self = this;
                let data = self.$store.state.voteSwingData
                self.loading = false
                self.timePeriods = data[0].slice(1, data[0].length-1)
                self.pickedDate1 = self.timePeriods.length-1
                self.pickedDate2 = self.timePeriods.length-1
                self.columns = data.slice(1, data.length)
                return 'x'
                this.drawChart()
            },
            drawChart: function () {
                $('.chart').html('')
                var waffle = new WaffleChart()
                .selector(".chart")
                .data(this.selectedColumn)
                .useWidth(true)
                .label("Where do the likes go?")
                .size(10)
                .gap(2)
                .rows(25)
                .rounded(true)();
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
                    others[party] -= parseInt(this.columns.filter((column) => column[0] == this.selectedParty + '-' + party).map((column) => column[parseInt(this.pickedDate)+1]))
                    others[party] += parseInt(this.columns.filter((column) => column[0] == party + '-' + this.selectedParty).map((column) => column[parseInt(this.pickedDate)+1]))
                }
                return others

            },
            partyButtonClasses: function () {
                let classes = {};
                for (let party in this.partyNames) {
                    if (this.partyNames[party] == this.selectedParty) {
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
            selectedColumn: function() {
                let self = this
                return this.columns
                    .filter((column) => {
                        if (column[0].split('-')[0] == self.selectedParty) {
                            return column
                        }
                    })
                    .map((column) => {
                        return [
                            column[0].split('-')[1], 
                            column
                                .slice(parseInt(this.pickedDate1)+1, parseInt(this.pickedDate2)+2)
                                .reduce((acc, val) =>  { return acc + val }, 0)]
                    })
                    .sort((a, b) => b[1] - a[1])
            }
        }
    }
</script>
