<template>
    <div class="main container">
        <div class="row">
            <div class="col s12">
                <div class="card title-card blue-grey lighten-1">
                    <div class="card-content">
                        <span class="card-title section-title white-text">Timeseries Chart</span>
                        <span class="switch" style="display: float-right">
                            <label class="white-text">
                            Weekly
                            <input type="checkbox" v-model="monthly">
                            <span class="lever"></span>
                            Monthly
                            </label>
                        </span>
                        
                    </div>
                </div>
            </div>    
            
            <div class="col s0 l1"></div>
            <div class="col s12 l10">
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
            <div v-for="party in partyNames" class="col s2 m1 center-align">
                <button v-bind:class="partyButtonClasses[party]" class="btn btn-floating" @click="selectedParty = party"><img style="transform: translateY(6px)" :src="partyPic(party)" /></button>
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

    .c3-line {
        stroke-width: 2px
    }
</style>

<script>
    import Config from './../interface_config.json'
    //let d3 = require("./../scripts/d3.v3.js")
    let c3 = require('c3')
    let chart

    export default {
        data () {
            return {
                columns: [],
                monthlyColumns: [],
                monthly: false,
                loading: true,
                partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
                selectedParty: 'A'
            }
        },
        methods: {
            partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),            
            weeklyToMonthly: function (columns) {
                let monthlyColumns = columns.map((column) => [ column[0] ])
                for (let week = 1; week < columns[0].length; week++) {
                    if (monthlyColumns[0][monthlyColumns[0].length-1] !== columns[0][week].substring(0,7)) {
                        monthlyColumns[0].push(columns[0][week].substring(0,7))
                        for (let column = 1; column < columns.length; column++) {
                            monthlyColumns[column].push(columns[column][week])
                        }
                    } else {
                        for (let column = 1; column < columns.length; column++) {
                            monthlyColumns[column][monthlyColumns[column].length-1] += columns[column][week]
                        }
                        
                    }
                }
                return monthlyColumns
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
                    self.columns = data;
                    self.monthlyColumns = self.weeklyToMonthly(data)
                    return 'x'
                })
                .then((data) => {
                    this.drawChart()
                })
            },
            drawChart: function () {
            chart = c3.generate ({
                    bindto: '#chartX',
                    data: {
                        x: 'x1',
                        xFormat: this.weeklyMonthlyFormat,
                //        xFormat: '%Y%m%d', // 'xFormat' can be used as custom format of 'x'
                        columns: this.selectedColumn,
                        colors: this.partyColors
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
                        y : {
                            tick: {
                                format: d3.format(",")
                                // format: function (d) { return "$" + d; }
                            }
                        }                
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
            monthly: function () {
                this.drawChart()
            }
        },
        computed: {
            partyButtonClasses: function () {
                let classes = {};
                for (let party in this.partyNames) {
                    if (this.partyNames[party] == this.selectedParty) {
                        classes[this.partyNames[party]] = 'blue-grey lighten-1'
                    } else {
                        classes[this.partyNames[party]] = 'grey lighten-4'
                    }
                }
                return classes
            },
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
            selectedColumn: function() {
                let self = this
                return this.weeklyMonthlyColumns.filter((column) => {
                        if (column[0] == 'x1' || column[0].split('-')[0] == self.selectedParty) {
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
