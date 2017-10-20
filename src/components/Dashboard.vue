<template>
    <div class="main container">
        <div class="row">
            <div class="col s12 l4">
                <a :class="(weekShift == maxWeeks ? themeColor + ' lighten-2' : themeColor)" title="previous week" class="btn btn-floating waves-effect waves-light pageBtn pageBtnBack"@click="(weekShift < maxWeeks ? weekShift++ : null)"><i class="material-icons arrowIcon">arrow_left</i></a>
                <a :class="(weekShift == 0 ? themeColor + ' lighten-2' : themeColor)" title="next week" class="btn btn-floating waves-effect waves-light pageBtn pageBtnForward" @click="(weekShift > 0 ? weekShift-- : null)"><i class="material-icons arrowIcon">arrow_right</i></a>
                
                <div class="card topCard small grey lighten-4">
                    <div class="card-content">
                        <span class="card-title">Overall Stats</span>
                        <span class="card-title">Week: {{getMonday(getWeek(weekShift))}} - {{getSunday(getWeek(weekShift))}}</span>
                        <table class="topCardTable striped">
                            <tbody>
                                <tr>
                                    <td>Total Likes</td>
                                    <td>{{parseNumber(totalLikesLastTwoWeeks[0])}}</td>
                                </tr>
                                <tr>
                                    <td>Last week</td>
                                    <td>{{parseNumberWithSign(totalLikesLastTwoWeeks[0] - totalLikesLastTwoWeeks[1])}} / {{totalLikesPercentageChange}}% <i v-if="totalLikesPercentageChange<0" class="material-icons red-text">arrow_drop_down</i><i v-if="totalLikesPercentageChange>0" class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{parseNumberWithSign(totalLikesLastTwoWeeks[0] - totalLikesSixMonthsAverage)}} / <span v-if="totalLikesSixMonthsPercentageChange>0">+</span>{{totalLikesSixMonthsPercentageChange}}% <i v-if="totalLikesSixMonthsPercentageChange<0" class="material-icons red-text">arrow_drop_down</i><i v-if="totalLikesSixMonthsPercentageChange>0" class="material-icons green-text">arrow_drop_up</i></td>
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
                        <img :src="bigPartyPic(biggestWinner[0])" alt="" class="topCardLogo">
                        <table class="striped topCardTable">
                            <tbody>
                                <tr>
                                    <td>Likes</td>
                                    <td>{{parseNumber(biggestWinner[1])}}</td>
                                </tr>
                                <tr>
                                    <td>Last Week</td>
                                    <td>{{parseNumberWithSign(biggestWinner[2])}} / +{{biggestWinner[3]}}% <i class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{parseNumberWithSign(biggestWinner[4])}} / <span v-if="biggestWinner[5]>0">+</span>{{biggestWinner[5]}}% <i v-if="biggestWinner[5]<0" class="material-icons red-text">arrow_drop_down</i><i v-if="biggestWinner[5]>0" class="material-icons green-text">arrow_drop_up</i></td>
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
                        <img :src="bigPartyPic(biggestLoser[0])" alt="" class="topCardLogo">
                        <table class="striped topCardTable">
                            <tbody>
                                <tr>
                                    <td>Likes</td>
                                    <td>{{parseNumber(biggestLoser[1])}}</td>
                                </tr>
                                <tr>
                                    <td>Last Week</td>
                                    <td>{{parseNumberWithSign(biggestLoser[2])}} / {{biggestLoser[3]}}% <i class="material-icons red-text">arrow_drop_down</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{parseNumberWithSign(biggestLoser[4])}} / <span v-if="biggestLoser[5]>0">+</span>{{biggestLoser[5]}}% <i v-if="biggestLoser[5] < 0" class="material-icons red-text">arrow_drop_down</i><i v-if="biggestLoser[5] > 0" class="material-icons green-text">arrow_drop_up</i></td>
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
                                    <td>{{parseNumber(party[1])}}</td>
                                    <td>{{parseNumberWithSign(party[2])}} / <span v-if="party[3]>0">+</span>{{party[3]}}% <i v-if="party[2]<0" class="material-icons red-text">arrow_drop_down</i><i v-if="party[2]>0" class="material-icons green-text">arrow_drop_up</i></td>
                                    <td>{{parseNumberWithSign(party[4])}} / <span v-if="party[5]>0">+</span>{{party[5]}}% <i v-if="party[4]<0" class="material-icons red-text">arrow_drop_down</i><i v-if="party[4]>0" class="material-icons green-text">arrow_drop_up</i></td>
                                </tr>                            
                            </tbody>
                        </table>
                    </div>                    
                </div>
            </div>
            <div class="col s6 m4 l2">
                <button class="btn btn-large waves-effect waves-light" style="width: 100%" :class="weekClass(0)" @click="weekShift = 0">Last Week</button>
            </div>
            <div class="col s6 m4 l2" v-for="week in maxWeeks">
                <button class="btn btn-large waves-effect waves-light" style="width: 100%" :class="weekClass(week)" @click="weekShift = week">{{week+1}} Weeks ago</button>
            </div>
        </div>
    </div>
  
</template>

<style scoped>
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
    padding-left: 15px;
    padding-right: 0;
    }

    .topCardLogo {
        max-width: 100%;
        max-height: 75px;
        display: block;
        margin: 0 auto;        
    }

    .card:hover {
        box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);        
    }

    .pageBtn {
        position: absolute;
        right: 10%;
}

    .pageBtnBack {
        transform: translate(-50px, -30px)
    }

    .pageBtnForward {
        transform: translateY(-30px)
    }

    .arrowIcon {
        transform: translateX(-20px);
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
                themeColor: Config.themeColor,
                weekShift: 0,
                maxWeeks: 11
            }
        },
        methods: {
            bigPartyPic: (party) => require('./../assets/dk/' + party + '-big.png'),
            partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
            weekClass: function (week) {
                if (week === this.weekShift) {
                    return this.themeColor + ' darken-2'
                } else {
                    return this.themeColor + ' lighten-2'
                }
            },
            getMonday: function (date) {
                let monday = new Date(new Date(date).setDate(new Date(date).getDate()-6))
                return monday.getDate() + '.' + parseInt(monday.getMonth()+1) + '.' + monday.getFullYear()
            },
            getSunday: function (date) {
                let sunday = new Date(date)
                return sunday.getDate() + '.' + parseInt(sunday.getMonth()+1) + '.' + sunday.getFullYear()
            },
            parseNumberWithSign: function (number) {
                let num = number.toString()
                let sign = '+'
                if (num[0] == '-') {
                    num = num.substring(1, num.length)
                    sign = '-'
                }
                if (num.length > 3 && num.length< 7) {
                    return sign + num.substring(0, num.length-3) + '.' + num.substring(num.length-3, num.length)
                } else { return sign + num }
            },
            parseNumber: function (number) {
                let num = number.toString()
                if (num.length > 3 && num.length< 7) {
                    return num.substring(0, num.length-3) + '.' + num.substring(num.length-3, num.length)
                } else { return num }
            },
            getWeek: function (shift) {return this.timePeriods[this.timePeriods.length-1-shift]},            
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
            previousWeek: function () {return this.timePeriods[this.timePeriods.length-2]},
            totalLikesLastTwoWeeks: function () {
                if (this.totalLikes) {
                    return [
                        this.totalLikes[this.totalLikes.length-1-this.weekShift]/100,
                        this.totalLikes[this.totalLikes.length-2-this.weekShift]/100
                    ]
                } else {
                    return
                }
            },
            totalLikesPercentageChange: function () {
                return parseFloat((this.totalLikesLastTwoWeeks[0] / this.totalLikesLastTwoWeeks[1] * 100 - 100).toFixed(1))

            },
            totalLikesSixMonthsAverage: function () {
                return Math.round(this.totalLikes.slice(this.totalLikes.length-27-this.weekShift, this.totalLikes.length-1-this.weekShift).map(x => x/100).reduce(function(acc, val) { return acc + val }, 0) / 26)
            },
            totalLikesSixMonthsPercentageChange: function () {
                return parseFloat((this.totalLikesLastTwoWeeks[0] / this.totalLikesSixMonthsAverage *100 -100).toFixed(1))
            },
            partyChange: function () {
                // Return [Party, Likes, LastWeekLikeDifference, LastWeekPercentageDifference]
                return (this.absoluteData.map(x => [
                    x[0], 
                    x[x.length-1-this.weekShift]/100, 
                    x[x.length-1-this.weekShift]/100 - x[x.length-2-this.weekShift]/100, 
                    parseFloat((x[x.length-1-this.weekShift] / x[x.length-2-this.weekShift]*100-100).toFixed(1)),
                    x[x.length-1-this.weekShift]/100 - Math.round(x.slice(x.length-27-this.weekShift, x.length-1-this.weekShift).map(y => y/100).reduce(function(acc, val) { return acc + val }, 0) / 26),
                    ((x[x.length-1-this.weekShift]/100) / (Math.round(x.slice(x.length-27-this.weekShift, x.length-1-this.weekShift).map(y => y/100).reduce(function(acc, val) { return acc + val }, 0) / 26)) *100 -100).toFixed(1)
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
