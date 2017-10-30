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
                                    <td>{{parseNumberWithSign(totalLikesLastTwoWeeks[0] - totalLikesLastTwoWeeks[1])}} / <span v-if="totalLikesPercentageChange>0">+</span>{{totalLikesPercentageChange}}% <i v-if="totalLikesPercentageChange<0" class="material-icons arrow red-text">arrow_drop_down</i><i v-if="totalLikesPercentageChange>0" class="material-icons arrow green-text">arrow_drop_up</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{parseNumberWithSign(totalLikesLastTwoWeeks[0] - totalLikesSixMonthsAverage)}} / <span v-if="totalLikesSixMonthsPercentageChange>0">+</span>{{totalLikesSixMonthsPercentageChange}}% <i v-if="totalLikesSixMonthsPercentageChange<0" class="material-icons arrow red-text">arrow_drop_down</i><i v-if="totalLikesSixMonthsPercentageChange>0" class="material-icons arrow green-text">arrow_drop_up</i></td>
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
                                    <td>{{parseNumberWithSign(biggestWinner[2])}} / <span v-if="biggestWinner[3]>0">+</span>{{biggestWinner[3]}}% <i v-if="biggestWinner[3]<0" class="material-icons arrow red-text">arrow_drop_down</i><i v-if="biggestWinner[3]>0" class="material-icons arrow green-text">arrow_drop_up</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{parseNumberWithSign(biggestWinner[4])}} / <span v-if="biggestWinner[5]>0">+</span>{{biggestWinner[5]}}% <i v-if="biggestWinner[5]<0" class="material-icons arrow red-text">arrow_drop_down</i><i v-if="biggestWinner[5]>0" class="material-icons arrow green-text">arrow_drop_up</i></td>
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
                                    <td>{{parseNumberWithSign(biggestLoser[2])}} / {{biggestLoser[3]}}% <i class="material-icons arrow red-text">arrow_drop_down</i></td>
                                </tr>
                                <tr>
                                    <td>6-Month-Avg</td>
                                    <td>{{parseNumberWithSign(biggestLoser[4])}} / <span v-if="biggestLoser[5]>0">+</span>{{biggestLoser[5]}}% <i v-if="biggestLoser[5] < 0" class="material-icons arrow red-text">arrow_drop_down</i><i v-if="biggestLoser[5] > 0" class="material-icons arrow green-text">arrow_drop_up</i></td>
                                </tr>
                            </tbody>
                        </table>                        
                    </div>                    
                </div>
            </div>
            <div class="col s12 l6">
                <div class="card bottomCard grey lighten-4">
                    <div class="card-content">
                        <span class="card-title">Ranking by posts in week</span>
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
                                    <td>{{parseNumberWithSign(party[2])}} / <span v-if="party[3]>0">+</span>{{party[3]}}% <i v-if="party[2]<0" class="material-icons arrow red-text">arrow_drop_down</i><i v-if="party[2]>0" class="material-icons arrow green-text">arrow_drop_up</i></td>
                                    <td>{{parseNumberWithSign(party[4])}} / <span v-if="party[5]>0">+</span>{{party[5]}}% <i v-if="party[4]<0" class="material-icons arrow red-text">arrow_drop_down</i><i v-if="party[4]>0" class="material-icons arrow green-text">arrow_drop_up</i></td>
                                </tr>                            
                            </tbody>
                        </table>
                    </div>                    
                </div>
            </div>
            


            <div class="col s12 l6">
                <transition name="fade">
                    <div class="card bottomCard grey lighten-4">
                        <div class="card-content" :class="changinDataClass">
                            <span class="card-title">Top 10 Posts - {{getMonday(posts.week)}} - {{getSunday(posts.week)}}</span>
                            <table class="striped highlight bottomCardTable">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>FB-Page</th>
                                        <th>Likes in Week</th>
                                        <th>Total Likes</th>
                                        <th>Post</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <!-- <transition name="fade"> -->
                                        <tr v-for="(post, index) in posts.posts">
                                            <td>{{index+1}}</td>
                                            <td><img :src="partyPic(post.party)" alt="" max-width="100%" height="30px" class="partyPic"><img :src="post.userPic" class="circle userPic" alt="" max-width="100%" height="30px"><span class="userName">{{post.name}}</span></td>
                                            <td>{{post.count}}</td>
                                            <td>{{post.totalLikes}}</td>
                                            <!-- <td><a :href="post.url" target="_blank">Post</a></td> -->
                                            <td><button class="btn waves-effect waves-light" :class="themeColor + ' lighten-1'" @click="showPost(post.url)"><i class="material-icons">speaker_notes</i></button></td>
                                        </tr>
                                    <!-- </transition> -->
                                </tbody>
                            </table>
                        </div>
                    </div>
                </transition>
            </div>

            <transition>
                <modal name="post"
                    :width="500"
                    height="auto"
                    :scrollable="true"
                    @before-open="modalData">
                
                    <iframe :src="'https://www.facebook.com/plugins/post.php?href=' + postUrl + '&width=500'" width="500" style="border:none; height: 80vh" frameborder="0" allowTransparency="true"></iframe>
                
                </modal>
            </transition>





            <div class="col s12">
                <div class="row">
                    <div class="col s6 m4 l2">
                        <button class="btn btn-large waves-effect waves-light" style="width: 100%" :class="weekClass(0)" @click="weekShift = 0">Last Week</button>
                    </div>
                    <div class="col s6 m4 l2" v-for="week in maxWeeks">
                        <button class="btn btn-large waves-effect waves-light" style="width: 100%" :class="weekClass(week)" @click="weekShift = week">{{week+1}} Weeks ago</button>
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
        height: 45px;
        padding: 4px 10px;
    }

    .bottomCard .card-title {
        padding: 20px 0 0 20px
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

    i.arrow {
        position: absolute;
        transform: translateY(-3px)
    }


    .changingData {
        opacity: 0;
    }

    .card-content {
        transition: opacity 0.2s;
    }

    .userPic {
        position: absolute;
        transform: translate(5px, 0px);
        box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.3);
    }

    .partyPic {
        position: absolute;
        transform: translate(-10px, -8px);
    }

    .userName {
        padding-left: 45px;
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
                maxWeeks: 11,
                posts: [],
                postsLoading: true,
                postUrl: ''
            }
        },
        methods: {
            showPost: function (url) {this.$modal.show('post', { url: url })},
            hidePost: function () {this.$modal.hide('post')},
            modalData: function (data) {
                this.postUrl = data.params.url
            },
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
            loadPosts: function () {
                this.postsLoading = true
                let self = this
                let myInit = { mode: 'cors' }
                fetch(Config.apiUrl + 'api/getposts/' + this.getWeek(this.weekShift), myInit)
                .then((response) => {
                    return response.json();
                })
                .then(function(data) {
                    console.log(data.posts)
                    self.postsLoading = false
                    self.posts = data
                })
            },
            getWeek: function (shift) {return this.timePeriods[this.timePeriods.length-1-shift]},            
        },
        computed: {
            data: function () {return this.$store.state.rawLikesData.filter(arr => !arr[0].includes('_') && !arr[0].includes('x')).map(x => x.slice(0, x.length-1))},
            absoluteData: function () {return this.$store.state.rawLikesAbsoluteData.filter(arr => !arr[0].includes('x') && !arr[0].includes('totalLikes')).map(x => x.slice(0, x.length-1))},
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
            timePeriods: function () {return this.$store.state.rawLikesData.filter(arr => arr[0].includes('x1')).map(x => x.slice(0, x.length-1))[0]},
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
            },
            changinDataClass: function () {
                if (this.postsLoading) {
                    return 'changingData'
                } else {
                    return
                }
            }
        },
        mounted () {
            this.loadPosts()
        },
        watch: {
            weekShift: function () {
                this.loadPosts()
            }
        }
    }
</script>
