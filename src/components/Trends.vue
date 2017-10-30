<template>
    <div class="main container" >
        <div class="row">
            
            <div class="col s12 card grey lighten-4">

                <!-- ZoomOut Button for the graph -->
                <div style="margin-top: 20px; margin-right: 20px; position: absolute; right: 0">
                    <!-- <a :class="themeColor" class="btn btn-large btn-floating waves-effect waves-light" onclick="$('#infomodal').modal('open')"><i class="material-icons">info_outline</i></a> -->
                    <a :class="themeColor" @click="zoomOut()" class="btn btn-large btn-floating waves-effect waves-light"><i class="material-icons">zoom_out</i></a>
                </div>
                
                <div class="card-content">
                    <span class="card-title section-title">Raw Likes Distribution to Parties</span>
                </div>                    

                <!-- Chart Container // Contains Loading-Spinner, which is replaced when the chart is generated -->
                <div class="center-align" v-if="initialLoading && selectedJob">
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

                <div id="infomodal" class="modal">
                    <div class="modal-content">
                    <h4>Results Description</h4>
                    <p v-if="jobinfo" v-for="par in paragraphs">{{par}}</p>
                    <p v-else>Unfortunately, no description is available for this dataset.</p>
                    </div>
                    <div class="modal-footer">
                    <a href="#!" class="modal-action modal-close waves-effect waves-green btn-flat">Close</a>
                    </div>
                </div>                
                
                
                <div class="chartCard">
                    <div id="rawchart"></div>
                </div>

                <div class="row">
                    <div class="col s12 graphBtn center-align">
                        <template v-for="party in predictionPartyNames" v-if="!party.includes('x')">
                            <img class="graphBtn" :src="partyPic(party)" :alt="party" @click="toggleParty(party)" :class="partyButtonClass(party)" :title="party" max-width="100%" height="25px">
                            <img class="pollBtn graphBtn" :src="partyPic(party)" :alt="party + '_poll'" @click="toggleParty(party + '_poll')" :class="partyButtonClass(party + '_poll')" :title="party + ' polls'" max-width="100%" height="25px">
                        </template>
                        <i class="material-icons graphBtn" @click="showAllParties()" title="Show all parties">radio_button_checked</i>
                        <i class="material-icons graphBtn" @click="showAllPolls()" title="Show all polls">radio_button_checked</i>
                        <i class="material-icons graphBtn" @click="hideAllParties()" title="Hide all parties">radio_button_unchecked</i>
                        <i class="material-icons graphBtn" @click="hideAllPolls()" title="Hide all polls">radio_button_unchecked</i>
                        <button class="graphBtn graphBtnTxt btn btn-floating grey" @click="toggleElec1()" :class="classElec1" :title="'Toggle ' + electionYears[0] + ' election results'">{{electionYears[0]}}</button>
                        <button class="graphBtn graphBtnTxt btn btn-floating grey" @click="toggleElec2()" :class="classElec2" :title="'Toggle ' + electionYears[1] + ' election results'">{{electionYears[1]}}</button>

                    </div>
                </div>
            </div>
        </div>    

        <!-- Settings Area // Becomes visible, when initial loading is done -->
        <div class="row" v-show="!initialLoading">
            <div class="col s12">
                <div class="row">

                    <!-- Time Period Selector // defines for which time period data is loaded in the graph -->
                    <div class="col s6 m3 l3 center-align">
                        <input placeholder="MM-YYYY" id="start" type="text" class="validate center-align" v-model="start" pattern="\d\d-\d\d\d\d">
                        <label for="start">From</label>                
                    </div>                
                    <div class="col s6 m3 l3 center-align">
                        <input placeholder="MM-YYYY" id="end" type="text" class="validate center-align" v-model="end" pattern="\d\d-\d\d\d\d">
                        <label for="end">Until</label>                
                    </div>                
                    <div class="col s3 m2 l2 center-align">
                        <button :class="themeColor" class="btn btn-large waves-effect waves-light lighten-1 validate" @click="loadRawLikesData()">
                            <i class="material-icons">loop</i>
                        </button>
                    </div>

                    <!-- Loading-Spinner, which is running at any kind of graph-refresh -->
                    <div class="col s6 m1 l2 center-align">
                        <div class="preloader-wrapper active" v-if="dataIsReloading">
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
                        
        </div>
    </div>
</template>

<style>

    .btn-large {
        margin-bottom: 5px;
        width: 100%
    }

    body {
        background: #eceff1 
    }

    .spinner-layer {
        border-color: #90a4ae;
    }

    [type="radio"]:checked+label:after, [type="radio"].with-gap:checked+label:after {
        background-color: #90a4ae;
    }  

    [type="radio"]:checked+label:after, [type="radio"].with-gap:checked+label:before, [type="radio"].with-gap:checked+label:after {
        border: 2px solid #90a4ae;
    }

    .chartCard {
        padding: 10px;
    }


    .c3-xgrid-line.grid4 line {
        stroke: pink; /* Color for Election-Marker-Line */
        stroke-width: 1.5px;
    }

    .c3-grid .lineClass2 line {
        stroke: red;
        stroke-opacity: 0.3;
        //transform: translateX(-20px);
    }

    .c3-grid .lineClass line {
        stroke-opacity: 0.3;
    }


    .lineClass {
        font-size: 20px;
        //transform: translateX(-20px);
    }

    .lineClass2 {
        font-size: 20px;
        //transform: translateX(-20px);
    }

    
    .chartContainer {
        height: 600px; /* Fixed container height for reserving space for chart while it is loading */
    }


    .c3-circles-AfD, .c3-circles-CDU, .c3-circles-CDU, .c3-circles-FDP, .c3-circles-Grü, .c3-circles-Lin, .c3-circles-SPD {
        opacity: 0.3
    }    

    .c3-circles-AfD-poll, .c3-circles-CDU-CSU-poll, .c3-circles-FDP-poll, .c3-circles-Gruenen-poll, .c3-circles-Linke-poll, .c3-circles-SPD-poll {
        opacity: 0.3
    }    





    .c3-circles-A, .c3-circles-AA, .c3-circles-B, .c3-circles-C, .c3-circles-D, .c3-circles-F, .c3-circles-K, .c3-circles-I, .c3-circles-N, .c3-circles-O, .c3-circles-OE, .c3-circles-Q, .c3-circles-V, .c3-circles-NB {
        opacity: 0.3
    }    

    .c3-circles-A-poll, .c3-circles-AA-poll, .c3-circles-B-poll, .c3-circles-C-poll, .c3-circles-D-poll, .c3-circles-F-poll, .c3-circles-K-poll, .c3-circles-I-poll, .c3-circles-N-poll, .c3-circles-O-poll, .c3-circles-OE-poll, .c3-circles-Q-poll, .c3-circles-V-poll, .c3-circles-NB-poll {
        opacity: 0.3
    }    


    .c3-line {
        stroke-width: 2px
    }


    .c3-tooltip-name--A .name, .c3-tooltip-name--A-poll .name, .c3-tooltip-name--A-2011 .name, .c3-tooltip-name--A-2015 .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/a_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--A .name span, .c3-tooltip-name--A-poll .name span, .c3-tooltip-name--A-2011 .name span, .c3-tooltip-name--A-2015 .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--AA .name, .c3-tooltip-name--AA-poll .name, .c3-tooltip-name--AA-2015 .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/å_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--AA .name span, .c3-tooltip-name--AA-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--B .name, .c3-tooltip-name--B-poll .name span {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/b_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--B .name span, .c3-tooltip-name--B-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--C .name, .c3-tooltip-name--C-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/c_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--C .name span, .c3-tooltip-name--C-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--D .name, .c3-tooltip-name--D-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/d_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--D .name span, .c3-tooltip-name--D-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--F .name, .c3-tooltip-name--F-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/f_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--F .name span, .c3-tooltip-name--F-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--I .name, .c3-tooltip-name--I-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/i_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--I .name span, .c3-tooltip-name--I-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--K .name, .c3-tooltip-name--K-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/k_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--K .name span, .c3-tooltip-name--K-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--O .name, .c3-tooltip-name--O-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/o_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--O .name span, .c3-tooltip-name--O-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--OE .name, .c3-tooltip-name--OE-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/ø_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--OE .name span, .c3-tooltip-name--OE-poll .name span {
        background-color: transparent!important
    }


    .c3-tooltip-name--V .name, .c3-tooltip-name--V-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/v_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--V .name span, .c3-tooltip-name--V-poll .name span {
        background-color: transparent!important
    }

    .c3-tooltip-name--NB .name, .c3-tooltip-name--NB-poll .name {
        background-image: url("https://www.b.dk/upload/tcarlsen/parties-history/img/d_small.png");
        background-repeat: no-repeat;
        height: 20px;
        background-color: transparent
    }

    .c3-tooltip-name--NB .name span, .c3-tooltip-name--NB-poll .name span {
        background-color: transparent!important
    }

    .hiddenParty {
        opacity: 0.3;
    }

    .graphBtn {
        cursor: pointer;
        margin: 0px 0.5%
    }

    .graphBtnTxt {
        transform: translateY(-7px);
        font-size: 10px;
        width: 30px;
        height: 30px;
        line-height: 2px;
    }
    
</style>


<script>
import { eventBus } from './../main';
import Config from './../interface_config.json'
import c3 from 'c3'
let chart; /* Defining chart in component scope, in order to be able to load new data after chart-generation */


export default {
    data() {
        return {
            selectedJob: '',
            settings: {},
            selectedSettings: {},
            predictionPartyNames: [],
            pollPartyNames: [],
            columns: [],
            pollsLoaded: false,
            initialLoading: true,
            dataIsReloading: false,
            start: '01-2017',
            end: '12-2017',
            showingPredictions: true,
            showingPolls: true,
            showElec1: true,
            showElec2: true,
            partiesElec1: [],
            partiesElec2: [],
            country: 'dk',
            jobinfo: '',
            coll: 'jobs3',
            showSettings: false,
            themeColor: Config.themeColor,
            hiddenParties: []
        }
    },
    methods: {
        toggleParty: function (party) {
            if (this.hiddenParties.includes(party)) {
                chart.show(party)
                let i = this.hiddenParties.indexOf(party)
                this.hiddenParties.splice(i, 1)
            } else {
                chart.hide(party)
                this.hiddenParties.push(party)
            }
        },
        partyButtonClass: function (party) {
            if (this.hiddenParties.includes(party)) {
                return 'hiddenParty'
            } else {
                return
            }
        },
        showAllParties: function () {
            chart.show(this.predictionPartyNames)
            this.hiddenParties = this.hiddenParties.filter(x=>x.includes('poll'))
        },
        hideAllParties: function () {
            chart.hide(this.predictionPartyNames)
            for (let party in this.predictionPartyNames) {
                if (!this.hiddenParties.includes(this.predictionPartyNames[party])) {
                    this.hiddenParties.push(this.predictionPartyNames[party])
                }                 
            }
        },
        showAllPolls: function () {
            chart.show(this.pollPartyNames)
            this.hiddenParties = this.hiddenParties.filter(x=>!x.includes('poll'))
        },
        hideAllPolls: function () {
            chart.hide(this.pollPartyNames)
            for (let party in this.pollPartyNames) {
                if (!this.hiddenParties.includes(this.pollPartyNames[party])) {
                    this.hiddenParties.push(this.pollPartyNames[party])
                }                 
            }
        },
        partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
        loadRawLikesData: function () {
            this.dataIsReloading = true
            let self = this
            let myInit = { mode: 'cors' }
            fetch(Config.apiUrl + 'api/getresult/' + 'dk-rawlikes' + '?&jobid=rawLikesNew&dummySetting=1&start=' + this.start + '&end=' + this.end + '&pol=dk', myInit)
            .then((response) => {
                return response.json();
            })
            .then(function(data) {
                self.$store.commit('fetchRawLikesData', data)
                self.loadData()
                self.dataIsReloading = false
                return
            })
        },        
        fetchPartyNames: function(columns) {
            this.partiesElec1 = [];
            this.partiesElec2 = [];
            this.predictionPartyNames = []
            this.pollPartyNames = []

            for (let array in columns) {

                if (columns[array][0].includes('2013')) {
                    this.partiesElec1.push(columns[array][0])
                }
                else if (columns[array][0].includes('2011')) {
                    this.partiesElec1.push(columns[array][0])
                }
                else if (columns[array][0].includes('2017')) {
                    this.partiesElec2.push(columns[array][0])
                }
                else if (columns[array][0].includes('2015')) {
                    this.partiesElec2.push(columns[array][0])
                }
                else if (!columns[array][0].includes('x') && !columns[array][0].includes('poll')) {
                    this.predictionPartyNames.push(columns[array][0])
                }
                else if (columns[array][0] !== 'x1' && columns[array][0] !== 'x2' && columns[array][0].includes('poll')) {
                    this.pollPartyNames.push(columns[array][0])
                }
            }
        },
        drawLines: function() {
            chart.xgrids.add(this.electionLines)
        },
        zoomOut: function() {
            chart.unzoom()
            console.log("zooming out")
        },
        toggleElec1: function() {
            if (this.showElec1) {
                chart.hide(this.partiesElec1)
                this.showElec1 = false
            }
            else {
                chart.show(this.partiesElec1)
                chart.unzoom()
                this.showElec1 = true
            }
        },
        toggleElec2: function() {
            if (this.showElec2) {
                chart.hide(this.partiesElec2)
                this.showElec2 = false
            }
            else {
                chart.show(this.partiesElec2)
                chart.unzoom()                
                this.showElec2 = true
            }
        },
        togglePredictions: function() {
            if (this.showingPredictions) {
                chart.hide(this.predictionPartyNames)
                this.showingPredictions = false
            } else {
                chart.show(this.predictionPartyNames)
                this.showingPredictions = true
            }
        },
        togglePolls: function() {
            if (this.showingPolls) {
                chart.hide(this.pollPartyNames)
                this.showingPolls = false
            } else {
                chart.show(this.pollPartyNames)
                this.showingPolls = true
            }
        },
        resetSettings: function() {
            this.showElec1 = true;
            this.showElec2 = true;
            this.showingPolls = true;
            this.hiddenParties = this.pollPartyNames.slice()
        },
        loadData: function () {
            this.columns = this.$store.state.rawLikesData.map(x => {
                if (x[0].includes('x') || x[0].includes('poll')) {
                    return x
                } else {
                    return x.slice(0, x.length-1)
                }
            })
            this.fetchGraph()
            $('.modal').modal();

        },
        fetchGraph: function() {
            this.fetchPartyNames(this.columns)
            this.drawChart(this.columns)
            this.resetSettings()
            this.toggleElec1()
            this.toggleElec2()
            this.togglePolls()
            this.drawLines()
            this.initialLoading = false
            console.log("drawing new chart")
        },
        drawChart: data => {
            console.log(data)
            let self = this
            chart = c3.generate({
                bindto: '#rawchart',
                size: {
                    height: 350
                },     
                data: {
                    xs: {
                        AfD: 'x1',
                        CDU: 'x1',
                        FDP: 'x1',
                        Grü: 'x1',
                        Lin: 'x1',
                        SPD: 'x1',
                        bün: 'x1',

                        AfD_2013: 'x3',
                        CDU_2013: 'x3',
                        FDP_2013: 'x3',
                        Grüne_2013: 'x3',
                        Linke_2013: 'x3',
                        SPD_2013: 'x3',
                        AfD_2017: 'x4',
                        CDU_2017: 'x4',
                        FDP_2017: 'x4',
                        Grüne_2017: 'x4',
                        Linke_2017: 'x4',
                        SPD_2017: 'x4',
                        AfD_poll: 'x2',
                        'CDU/CSU_poll': 'x2',
                        FDP_poll: 'x2',
                        Gruenen_poll: 'x2',
                        Linke_poll: 'x2',
                        SPD_poll: 'x2',

                        AA: 'x1',
                        A: 'x1',
                        C: 'x1',
                        B: 'x1',
                        F: 'x1',
                        I: 'x1',
                        OE: 'x1',
                        O: 'x1',
                        N: 'x1',
                        NB: 'x1',
                        Q: 'x1',
                        V: 'x1',
                        AA_poll: 'x2',
                        A_poll: 'x2',
                        C_poll: 'x2',
                        B_poll: 'x2',
                        F_poll: 'x2',
                        I_poll: 'x2',
                        OE_poll: 'x2',
                        O_poll: 'x2',
                        D_poll: 'x2',
                        K_poll: 'x2',
                        V_poll: 'x2',
                        A_2011: 'x3',
                        C_2011: 'x3',
                        B_2011: 'x3',
                        F_2011: 'x3',
                        I_2011: 'x3',
                        OE_2011: 'x3',
                        O_2011: 'x3',
                        D_2011: 'x3',
                        K_2011: 'x3',
                        V_2011: 'x3',
                        AA_2015: 'x4',
                        A_2015: 'x4',
                        C_2015: 'x4',
                        B_2015: 'x4',
                        F_2015: 'x4',
                        I_2015: 'x4',
                        OE_2015: 'x4',
                        O_2015: 'x4',
                        D_2015: 'x4',
                        K_2015: 'x4',
                        V_2015: 'x4'
                    },
                    columns: data,
                    colors: {
                        AfD: '#0099ff',
                        CDU: '#1a1a1a',
                        FDP: '#ffff00',
                        Grü: '#339933',
                        Lin: '#660066',
                        SPD: '#e60000',
                        bün: 'white',
                        AfD_poll: '#80ccff',
                        'CDU/CSU_poll': '#666666',
                        FDP_poll: '#ffff66',
                        Gruenen_poll: '#79d279',
                        Linke_poll: '#ff80ff',
                        SPD_poll: '#ff6666',
                        AfD_2013: 'blue',
                        CDU_2013: 'black',
                        FDP_2013: 'yellow',
                        Grüne_2013: 'green',
                        Linke_2013: 'purple',
                        SPD_2013: 'red',
                        bün_2013: 'white',
                        AfD_2017: 'blue',
                        CDU_2017: 'black',
                        FDP_2017: 'yellow',
                        Grünen_2017: 'green',
                        Linke_2017: 'purple',
                        SPD_2017: 'red',
                        bün_2017: 'white',
                        
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
                        V: 'rgb(15, 132, 187)',
                        
                        A_poll: 'rgba(227, 47, 59, 0.65)',
                        AA_poll: 'rgba(90, 255, 90, 0.65)',
                        B_poll: 'rgba(229, 43, 145, 0.65)',
                        C_poll: 'rgba(15, 133, 75, 0.65)',
                        D_poll: 'rgba(0, 68, 79, 0.65)',
                        F_poll: 'rgba(156, 29, 42, 0.65)',
                        I_poll: 'rgba(239, 133, 53, 0.65)',
                        K_poll: 'rgba((240, 172, 85, 0.65)',
                        O_poll: 'rgba(0, 80, 120, 0.65)',
                        OE_poll: 'rgba(115, 21, 37, 0.65)',
                        V_poll: 'rgba(15, 132, 187, 0.65)',
                        N_poll: 'rgba(0, 80, 120, 0.65)',
                        Q_poll: 'rgba(115, 21, 37, 0.65)',
                        
                        A_2011: 'rgba(227, 47, 59, 1)',
                        AA_2011: 'rgba(90, 255, 90, 1)',
                        B_2011: 'rgba(229, 43, 145, 1)',
                        C_2011: 'rgba(15, 133, 75, 1)',
                        D_2011: 'rgba(0, 68, 79, 1)',
                        F_2011: 'rgba(156, 29, 42, 1)',
                        I_2011: 'rgba(239, 133, 53, 1)',
                        K_2011: 'rgba((240, 172, 85, 1)',
                        O_2011: 'rgba(0, 80, 120, 1)',
                        OE_2011: 'rgba(115, 21, 37, 1)',
                        V_2011: 'rgba(15, 132, 187, 1)',
                        N_2011: 'rgba(0, 80, 120, 1)',
                        Q_2011: 'rgba(115, 21, 37, 1)',
                        
                        A_2015: 'rgba(227, 47, 59, 1)',
                        AA_2015: 'rgba(90, 255, 90, 1)',
                        B_2015: 'rgba(229, 43, 145, 1)',
                        C_2015: 'rgba(15, 133, 75, 1)',
                        D_2015: 'rgba(0, 68, 79, 1)',
                        F_2015: 'rgba(156, 29, 42, 1)',
                        I_2015: 'rgba(239, 133, 53, 1)',
                        K_2015: 'rgba((240, 172, 85, 1)',
                        O_2015: 'rgba(0, 80, 120, 1)',
                        OE_2015: 'rgba(115, 21, 37, 1)',
                        V_2015: 'rgba(15, 132, 187, 1)',
                        N_2015: 'rgba(0, 80, 120, 1)',
                        Q_2015: 'rgba(115, 21, 37, 1)'                        
                    },                    
                    names: {
                        AA: 'Alternativet',
                        A: 'Socialdemokratiet',
                        B: 'Radikale Venstre',
                        C: 'Det Konservative Folkeparti',
                        F: 'Socialistisk Folkeparti',
                        I: 'Liberal Alliance',
                        OE: 'Enhedslisten',
                        O: 'Dansk Folkeparti',
                        N: 'N',
                        Q: 'Q',
                        V: 'Venstre',
                        AA_poll: 'Alternativet-Poll',
                        A_poll: 'Socialdemokratiet-Poll',
                        B_poll: 'Radikale Venstre-Poll',
                        C_poll: 'Konservative Folkeparti-Poll',
                        F_poll: 'Socialistisk Folkeparti-Poll',
                        I_poll: 'Liberal Alliance-Poll',
                        OE_poll: 'Enhedslisten-Poll',
                        O_poll: 'Dansk Folkeparti-Poll',
                        N_poll: 'N-Poll',
                        Q_poll: 'Q-Poll',
                        V_poll: 'Venstre-Poll',
                        D_poll: 'Nye Borg.-Poll',
                        K_poll: 'Kristendem.-Poll'
                    },
                    order: null,
                    type: 'spline',
                },
                tooltip: {
                    grouped: true
                },
                transition: {
                    duration: 500
                },      
                zoom: {
                    enabled: true,
                    rescale: true
                },
                subchart: {
                    show: false
                },        
                point: {
                    show: true,
                    r: 4
                },                        
                axis: {
                    x: {
                        type: 'timeseries',
                        tick: {
                            format: '%d.%m.%Y',
                            count: 20,
                            fit:true
                        }
                    },
                    y: {
                        tick: {
                            format: d => d + "%"
                        },
                        show: false,
                        padding: {
                            top: 50
                        },
                        min: 1
                    }
                },
                legend: {
                    show: false
                },
                grid: {
                        y: {
                            lines: [
                                {value: 5, text: '5%', position: 'start', class: 'lineClass2'},
                                {value: 10, text: '10%', position: 'start', class: 'lineClass'},
                                {value: 15, text: '15%', position: 'start', class: 'lineClass'},
                                {value: 20, text: '20%', position: 'start', class: 'lineClass'},
                                {value: 25, text: '25%', position: 'start', class: 'lineClass'},
                                {value: 30, text: '30%', position: 'start', class: 'lineClass'},
                                {value: 35, text: '35%', position: 'start', class: 'lineClass'},
                                {value: 40, text: '40%', position: 'start', class: 'lineClass'},
                                {value: 45, text: '45%', position: 'start', class: 'lineClass'},
                            ]
                        }
                }
            });
        }
        
    },
    mounted() {
        this.loadData()
    },
    computed: {
        paragraphs: function () {
            if (this.jobinfo) {
                if (this.jobinfo[0]) {
                    return this.jobinfo[0].split('\n')
                }
            }
        },
        classElec1: function() {
            if (this.showElec1) {
                return 
            }
            else {
                return 'hiddenParty'
            } 
        },
        classElec2: function() {
            if (this.showElec2) {
                return
            }
            else {
                return 'hiddenParty'
            } 
        },
        classPredictions: function() {
            if (this.showingPredictions) {
                return this.themeColor
            }
            else {
                return 'grey lighten-1'
            } 
        },
        classPolls: function() {
            if (this.showingPolls) {
                return this.themeColor
            }
            else {
                return 'grey lighten-1'
            } 
        },
        classLabels: function() {
            if (this.showLabels) {
                return this.themeColor
            }
            else {
                return 'grey lighten-1'
            } 
        },
        electionLines: function() {
            if (this.country == 'dk') {
                return [
                    {value: '2015-06-18', class: 'grid4', text: '2015 Election'},
                    {value: '2011-09-15', class: 'grid4', text: '2011 Election'}
                ]
            }
            if (this.country == 'de') {
                return [
                    {value: '2013-09-22', class: 'grid4', text: '2013 Election'},
                    {value: '2017-09-24', class: 'grid4', text: '2017 Election'}
                ]
            }
        },
        electionYears: function() {
            if (this.country == 'dk') {
                return ['2011', '2015']
            }
            else if (this.country == 'de') {
                return ['2013', '2017']
            }
            else {
                return ['2013', '2017']
            }
        }
    }
}

</script>
