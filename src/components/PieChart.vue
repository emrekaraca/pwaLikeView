<template>
    <div class="main container">
        <div class="row">
            <div class="col s12">
                <div class="card title-card lighten-1" :class="themeColor">
                    <div class="card-content">
                        <span class="card-title section-title white-text">Pie Chart</span>
                    </div>
                </div>
            </div>    
            
            <div class="col s0 l1"></div>
            <div class="col s12 l10 chartContainer">
                <div id="pieChart"></div>
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



</style>

<script>
    import Config from './../interface_config.json'
    import c3 from 'c3'
    let chart
    export default {
        data () {
            return {
                columns: [],
                chart: "",
                loading: true,
                partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
                timePeriods: [],
                selectedParty: 'A',
                pickedDate1: 0,
                pickedDate2: 0,
                multiWeek: false,
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
            chart = c3.generate ({
                    bindto: '#pieChart',
                    data: {
                        columns: this.selectedColumn,
                        colors: this.partyColors,
                        type: 'pie'
                    },
                    pie: {
                        label: {
                            format: function (value, ratio) { return value + ' Likes'; }
                        }
                    },
                    size: {
                        height: this.containerWidth
                    },
                    legend: {
                        show: true
                    }
                });      
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
            containerWidth: function() {
                if ($('.chartContainer').width() > 500) {
                    return 500
                } else {
                    return $('.chartContainer').width()
                }
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
            partyColors: function () {
                let obj = {}
                let colors = {
                    A: 'rgb(227, 47, 59)',
                    AA: 'rgb(90, 255, 90)',
                    B: 'rgb(229, 43, 145)',
                    C: 'rgb(15, 133, 75)',
                    D: 'rgb(0, 68, 79)',
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
