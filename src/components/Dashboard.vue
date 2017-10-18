<template>
    <div class="main container">
        <div class="row">
            <div class="col s4">
                <div class="card small green lighten-4">
                    <div class="card-content">
                        <span class="card-title">Biggest Winner</span>
                        <img :src="partyPic('O')" alt="" width="100%">
                        <ul>
                            <li>Logo of Party with biggest gains in last week</li>
                            <li>Absolute number of likes / Absolute number of likes won</li>
                            <li>Percentage of likes / Percentage win</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col s4">
                <div class="card small red lighten-4">
                    <div class="card-content">
                        <span class="card-title">Biggest Loser</span>
                        <img :src="partyPic('V')" alt="" width="100%">
                        <ul>
                            <li>Logo of Party with biggest gains in last week</li>
                            <li>Absolute number of likes / Absolute number of likes won</li>
                            <li>Percentage of likes / Percentage win</li>
                        </ul>
                        
                    </div>                    
                </div>
            </div>
            <div class="col s4">
                <div class="card small blue lighten-4">
                    <div class="card-content">
                        <span class="card-title">Overall Stats</span>
                    </div>
                </div>
            </div>
            <div class="col s8">
                <div class="card small orange lighten-4">
                    <div class="card-content">
                        <span class="card-title">All parties Overview</span>
                        <ul>
                            <li v-for="party in ['A', 'AA', 'F', 'O', 'V']"><img :src="partyPic(party)" alt="" max-width="100%" height="30px"></li>
                        </ul>
                    </div>                    
                </div>
            </div>
            <div class="col s4">
                <div class="card small grey lighten-4"></div>
            </div>
        </div>
    </div>
  
</template>

<style>
    .card {
        margin: 3px 3px;    
    }
    .spinner-layer {
        border-color: #90a4ae;
    }

    .c3-circle {
        opacity: 0.3!important
    }

    #pieChart text {
        fill: lightgrey!important
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
            partyPic: (party) => require('./../assets/dk/' + party + '-big.png'),
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
                let data = self.$store.state.voteSwingData
                self.loading = false
                self.timePeriods = data[0].slice(1, data[0].length)
                self.pickedDate1 = self.timePeriods.length-1
                self.pickedDate2 = self.timePeriods.length-1
                self.columns = data.slice(1, data.length)
                this.drawChart(this.selectedColumn)
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
                            format: function (value, ratio) { return value + ' Likes'; }
                        }
                    },
                    size: {
                        height: this.containerWidth
                    },
                    legend: {
                        show: true
                    },
                    transition: {
                        duration: 150
                    }                    
                });      
            }
        },
        mounted () {
            this.loadData()
        },
        watch: {
            selectedParty: function () {
                chart.load({unload: true, columns: this.selectedColumn})
            },
            pickedDate1: function () {
                if (!this.multiWeek) {
                    this.pickedDate2 = this.pickedDate1
                }
                chart.load({unload: true, columns: this.selectedColumn})
            },
            pickedDate2: function () {
                if (this.multiWeek) {
                    chart.load({unload: true, columns: this.selectedColumn})                    
                }
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
