<template>
    <div class="main container">
        <div class="row">
            <div class="col s12 l4">
                <div class="card topCard small grey lighten-4">
                    <div class="card-content">
                        <span class="card-title">Overall Stats</span>
                        <span class="card-title">{{getMonday(lastWeek)}} - {{getSunday(lastWeek)}}</span>
                        <table class="topCardTable striped">
                            <tbody>
                                <tr>
                                    <td>Total Likes</td>
                                    <td>{{totalLikesLastTwoWeeks[0]}}</td>
                                </tr>
                                <tr>
                                    <td>Last week</td>
                                    <td>{{totalLikesLastTwoWeeks[0] - totalLikesLastTwoWeeks[1]}} / {{totalLikesPercentageChange}}% <i v-if="totalLikesPercentageChange<0" class="material-icons red-text">arrow_drop_down</i><i v-if="totalLikesPercentageChange>0" class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{totalLikesLastTwoWeeks[0] - totalLikesSixMonthsAverage}} / {{totalLikesSixMonthsPercentageChange}}% <i v-if="totalLikesPercentageChange<0" class="material-icons red-text">arrow_drop_down</i><i v-if="totalLikesPercentageChange>0" class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col s12 l4">
                <div class="card topCard small grey lighten-4">
                    <div class="card-content">
                        <span class="card-title">Biggest Winner</span>
                        <img :src="bigPartyPic(biggestWinner[0])" alt="" width="100%">
                        <table class="striped topCardTable">
                            <tbody>
                                <tr>
                                    <td>Likes</td>
                                    <td>{{biggestWinner[1]}}</td>
                                </tr>
                                <tr>
                                    <td>Last Week</td>
                                    <td>+{{biggestWinner[2]}} / +{{biggestWinner[3]}}% <i class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>+{{biggestWinner[4]}} / +{{biggestWinner[5]}}% <i class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div class="col s12 l4">
                <div class="card topCard small grey lighten-4">
                    <div class="card-content">
                        <span class="card-title">Biggest Loser</span>
                        <img :src="bigPartyPic(biggestLoser[0])" alt="" width="100%">
                        <table class="striped topCardTable">
                            <tbody>
                                <tr>
                                    <td>Likes</td>
                                    <td>{{biggestLoser[1]}}</td>
                                </tr>
                                <tr>
                                    <td>Last Week</td>
                                    <td>{{biggestLoser[2]}} / {{biggestLoser[3]}}% <i class="material-icons red-text">arrow_drop_down</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{biggestLoser[4]}} / {{biggestLoser[5]}}% <i class="material-icons red-text">arrow_drop_down</i></td>
                                </tr>
                            </tbody>
                        </table>                        
                    </div>                    
                </div>
            </div>
            <div class="col s12">
                <div class="card bottomCard grey lighten-4">
                    <div class="card-content">
                        <table class="striped highlight bottomCardTable">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Party</th>
                                    <th>Likes</th>
                                    <th>Last Week</th>
                                    <th>6-Months-Avg</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(party, index) in partyChange">
                                    <td>{{index+1}}</td>
                                    <td><img :src="partyPic(party[0])" alt="" max-width="100%" height="25px"></td>
                                    <td>{{party[1]}}</td>
                                    <td><span v-if="party[2]>0">+</span>{{party[2]}} / <span v-if="party[3]>0">+</span>{{party[3]}}% <i v-if="party[2]<0" class="material-icons red-text">arrow_drop_down</i><i v-if="party[2]>0" class="material-icons green-text">arrow_drop_up</i></td>
                                    <td><span v-if="party[4]>0">+</span>{{party[4]}} / <span v-if="party[5]>0">+</span>{{party[5]}}% <i v-if="party[4]<0" class="material-icons red-text">arrow_drop_down</i><i v-if="party[4]>0" class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>                            
                            </tbody>
                        </table>
                    </div>                    
                </div>
            </div>
        </div>
    </div>
  
</template>

<style>
    .card {
        margin: 3px 3px;    
    }
    i {
        position: absolute;
        transform: translateY(-3px)
    }

    table.striped>tbody>tr:nth-child(odd) {
        background-color: #ecebeb!important;
    }

    .topCardTable {
        position: absolute;
        width: 96%100%;
        left: 0;
        bottom: 0;
    }

    .bottomCardTable {
        width: 100%!important;
    }

    .bottomCard, .bottomCard .card-content {
        padding: 0px!important;
    }

    .bottomCardTable td {
        height: 20px;
        padding: 4px 0px;
    }

    td:first-child, th:first-child {
    padding-left: 25px;
    padding-right: 0;
    }


    .card:hover {
        box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);        
    }
</style>

<script>
    import Config from './../interface_config.json'
    import c3 from 'c3'
    let chart
    export default {
        data () {
            return {
                chart: "",
                loading: true,
                partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
                themeColor: Config.themeColor
            }
        },
        methods: {
            bigPartyPic: (party) => require('./../assets/dk/' + party + '-big.png'),
            partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
            getMonday: function (date) {
                let monday = new Date(new Date(date).setDate(new Date(date).getDate()-6))
                return monday.getDate() + '.' + parseInt(monday.getMonth()+1) + '.' + monday.getFullYear()
            },
            getSunday: function (date) {
                let sunday = new Date(date)
                return sunday.getDate() + '.' + parseInt(sunday.getMonth()+1) + '.' + sunday.getFullYear()
            },
            parseNumber: function (number) {
                if (number[0] === '-') {

                }
            }
        },
        computed: {
            data: function () {return this.$store.state.rawLikesData.filter(arr => !arr[0].includes('_') && !arr[0].includes('x'))},
            absoluteData: function () {return this.$store.state.rawLikesAbsoluteData.filter(arr => !arr[0].includes('x') && !arr[0].includes('totalLikes'))},
            totalLikes: function () {
                let result = ['totalLikes']
                for (let party in this.absoluteData) {
                    if (this.absoluteData[party][0] !== 'x1') {
                        for (let week = 1; week < this.absoluteData[party].length; week++) {
                            if (result.length < week + 1) {
                                result.push(0)
                            }
                            result[week] += parseInt(this.absoluteData[party][week])
                        }
                    }
                }
                return result
            },        
            timePeriods: function () {return this.$store.state.rawLikesData.filter(arr => arr[0].includes('x1'))[0]},
            lastWeek: function () {return this.timePeriods[this.timePeriods.length-1]},
            previousWeek: function () {return this.timePeriods[this.timePeriods.length-2]},
            totalLikesLastTwoWeeks: function () {
                if (this.totalLikes) {
                    return [
                        this.totalLikes[this.totalLikes.length-1]/100,
                        this.totalLikes[this.totalLikes.length-2]/100
                    ]
                } else {
                    return
                }
            },
            totalLikesPercentageChange: function () {
                return parseFloat((this.totalLikesLastTwoWeeks[0] / this.totalLikesLastTwoWeeks[1] * 100 - 100).toFixed(1))

            },
            totalLikesSixMonthsAverage: function () {
                return Math.round(this.totalLikes.slice(this.totalLikes.length-27, this.totalLikes.length-1).map(x => x/100).reduce(function(acc, val) { return acc + val }, 0) / 26)
            },
            totalLikesSixMonthsPercentageChange: function () {
                return parseFloat((this.totalLikesLastTwoWeeks[0] / this.totalLikesSixMonthsAverage *100 -100).toFixed(1))
            },
            partyChange: function () {
                // Return [Party, Likes, LastWeekLikeDifference, LastWeekPercentageDifference]
                return (this.absoluteData.map(x => [
                    x[0], 
                    x[x.length-1]/100, 
                    x[x.length-1]/100 - x[x.length-2]/100, 
                    parseFloat((x[x.length-1] / x[x.length-2]*100-100).toFixed(1)),
                    x[x.length-1]/100 - Math.round(x.slice(x.length-27, x.length-1).map(y => y/100).reduce(function(acc, val) { return acc + val }, 0) / 26),
                    ((x[x.length-1]/100) / (Math.round(x.slice(x.length-27, x.length-1).map(y => y/100).reduce(function(acc, val) { return acc + val }, 0) / 26)) *100 -100).toFixed(1)
                ])).sort((a,b) => b[1] - a[1])
            },
            biggestWinner: function () {
                return this.partyChange.reduce((prev, curr) => (prev[2] > curr[2]) ? prev : curr)
            },
            biggestLoser: function () {
                return this.partyChange.reduce((prev, curr) => (prev[2] < curr[2]) ? prev : curr)
            }
        }
    }
</script>
