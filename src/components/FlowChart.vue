<template>
    <div class="main container">
        <div class="row">
            <div class="col s12">
                <div :class="themeColor" class="card title-card lighten-1">
                    <div class="card-content">
                        <span class="card-title section-title white-text">Flow Chart</span>
                        <!--<span class="card-title section-title white-text">=> Inspired by these <a href="https://www.tagesschau.de/multimedia/bilder/uvotealbum-945.html">CHARTS</a>, but unstyled</span>-->
                    </div>
                </div>
            </div>    
            
            <div class="col s0 l1"></div>
            <div class="col s12 l10">
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
                
                <div class="row" v-else>
                    <div class="col s0 m1"></div>
                    <div class="col s3 m2 box box-left center-align" v-bind:style="partyColor(selectedParty)"><h5>{{selectedParty}}</h5></div>
                    <div class="col s1 m1"></div>
                    <div class="col s4 m4 box box-middle">
                        <div class="row">
                            <div v-for="party in otherParties" class="col s12 arrow center-align"  v-bind:style="arrowColor(voterSwing[party])" id="arrow1">
                                <i class="material-icons" v-if="voterSwing[party]>0">arrow_back</i>
                                {{voterSwing[party]}}
                                <i class="material-icons" v-if="voterSwing[party]<0">arrow_forward</i>
                                </div>
                        </div>
                    </div>
                    <div class="col s1 m1"></div>
                    <div class="col s3 m2">
                        <div class="row">
                            <div v-for="party in otherParties" class="col s12 right-party center-align" v-bind:style="partyColor(party)" id="rp1"><h5>{{party}}</h5></div>
                        </div>                        
                    </div>
                    <div class="col s0 m1"></div>
                </div>
                <div class="center-align chartContainer" v-if="loading">
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

    .c3-circle {
        opacity: 0.3!important
    }

    .box {
        height: 440px;
    }

    .arrow, .right-party {
        margin-bottom: 10px;
        height: 40px;
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
            arrowColor: function (swingValue) {
                let alpha = Math.abs(swingValue) / Math.max(...Object.values(this.voterSwing).map((x)=>Math.abs(x))) + 0.3

                if (swingValue > 0) {
                    return "background-color: rgba(50,205,50," + alpha + ")"
                }
                else if (swingValue < 0) {
                    return "background-color: rgba(220,20,60," + alpha + ")"
                } else {
                    return "background-color: rgb(220,220,220)"                   
                }
            },
            loadData: function() {
                let self = this;
                let myInit = { 
                    mode: 'cors'
                };
                fetch(Config.apiUrl + 'api/getvoteswings', myInit)
                .then((response) => {
                    return response.json();
                })
                .then(function(data) {
                    console.log(data);
                    self.loading = false
                    self.timePeriods = data[0].slice(1, data[0].length-1)
                    self.pickedDate1 = self.timePeriods.length-1
                    self.pickedDate2 = self.timePeriods.length-1
                    self.columns = data.slice(1, data.length)
                    return 'x'
                })
                .then((data) => {
                    this.drawChart()
                })
            },
            drawChart: function () {
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
                        .filter((column) => column[0] == this.selectedParty + '-' + party)
                        .map((column) => {
                            let sum = 0; 
                            for (let i = parseInt(this.pickedDate1)+1; i <= parseInt(this.pickedDate2)+1; i++) { 
                                sum += column[i] 
                            } 
                            return [sum]
                        }))
                    others[party] += parseInt(this.columns
                        .filter((column) => column[0] == party + '-' + this.selectedParty)
                        .map((column) => {
                            let sum = 0; 
                            for (let i = parseInt(this.pickedDate1)+1; i <= parseInt(this.pickedDate2)+1; i++) { 
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
                        let sum = 0;
                        for (let i = parseInt(this.pickedDate1)+1; i <= parseInt(this.pickedDate2)+1; i++) {
                            sum += column[i]
                        }
                        return [column[0], sum]
                    })
            },
        }
    }
</script>
