<template>
    <div class="main container" >
        <div class="row">
            <div class="col s12 m12">
            <app-jobs-list></app-jobs-list>
            </div>
            
            <div class="col s12">
                <div :class="themeColor" class="card title-card lighten-1">
                    <div class="card-content">
                        <span class="card-title section-title white-text">Results from: {{selectedJob}} ({{country[0]}})</span>
                    </div>
                </div>
            </div>    

            <div class="col s12">

                <!-- ZoomOut Button for the graph -->
                <div class="right-align" style="margin-top: -40px; margin-right: 10px">
                    <a :class="themeColor" class="btn btn-floating waves-effect waves-light" onclick="$('#infomodal').modal('open')"><i class="material-icons">info_outline</i></a>
                    <a :class="themeColor" @click="zoomOut()" class="btn btn-floating waves-effect waves-light"><i class="material-icons">zoom_out</i></a>
                    <a :class="themeColor" @click="toggleSettings()" class="btn btn-floating waves-effect waves-light"><i class="material-icons">settings</i></a>
                    <a data-activates="slide-out" :class="themeColor" class="button-collapse2 btn btn-floating waves-effect waves-light"><i class="material-icons">timeline</i></a>                    
                </div>
                
                <!-- Chart Container // Contains Loading-Spinner, which is replaced when the chart is generated -->
                <div class="center-align chartContainer" v-if="initialLoading && selectedJob">
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
                
                
                <div class="card chartCard" v-if="selectedJob">
                    <div id="chart" >
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
                        <button :class="themeColor" class="btn btn-large waves-effect waves-light lighten-1 validate" @click="fetchGraph(true)">
                            <i class="material-icons">loop</i>
                        </button>
                    </div>
                    <div class="col s3 m2 l2 center-align">
                        <button class="btn btn-large waves-effect waves-light validate" v-bind:class="classLabels" @click="toggleLabels()">
                            <i class="material-icons">label_outline</i>
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
            
            <!-- Quick Action Buttons for showing/hiding all predictions/polls -->
            <div class="col s6 m6 l3 center-align">
                <button class="btn btn-large waves-effect waves-light " v-bind:class="classPredictions" @click="togglePredictions()">
                    Predictions
                </button>
            </div>                
            <div class="col s6 m6 l3 center-align">
                <button class="btn btn-large waves-effect waves-light " v-bind:class="classPolls" @click="togglePolls()">
                    Polls
                </button>
            </div>                
            <div class="col s6 m6 l3 center-align">
                <button class="btn btn-large waves-effect waves-light " v-bind:class="classElec1"  @click="toggleElec1()">
                    {{electionYears[0]}} Election
                </button>
            </div>
            <div class="col s6 m6 l3 center-align">
                <button class="btn btn-large waves-effect waves-light " v-bind:class="classElec2"  @click="toggleElec2()">
                    {{electionYears[1]}} Election
                </button>
            </div>
            
            <div>
                <p style="color: white">.</p>
                <br/>
            </div>

            <!-- Dynamic settings area // populated from database -->
            <div v-show="showSettings" class="col s12 m6 l3 xl3 settingsContainer" v-for="(vals, settingName) in settings">
                <div :class="themeColor" class="card title-card lighten-1">
                    <div class="card-content">
                        <span class="card-title section-title">{{settingName}}</span>
                    </div>
                </div>
                <p v-for="(option, index) in settings[settingName]">
                    <input v-if="index == 0" v-bind:name="settingName" type="radio" v-bind:id="option + '-' + settingName" v-model="selectedSettings[settingName]" v-bind:value="option" class="radio" />
                    <input v-else v-bind:name="settingName" type="radio" v-bind:id="option + '-' + settingName" v-bind:value="option" v-model="selectedSettings[settingName]"/>
                    <label v-bind:for="option + '-' + settingName">{{ option }}</label>
                </p>
            </div>

        </div>
    </div>
</template>

<style>
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
        background: #f2f5f7 
    }


    .c3-xgrid-line.grid4 line {
        stroke: pink; /* Color for Election-Marker-Line */
        stroke-width: 1.5px;
    }

    .c3-grid .lineClass2 line {
        stroke: red;
        //transform: translateX(-20px);
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





    .c3-circles-A, .c3-circles-AA, .c3-circles-B, .c3-circles-C, .c3-circles-D, .c3-circles-F, .c3-circles-K, .c3-circles-I, .c3-circles-N, .c3-circles-O, .c3-circles-OE, .c3-circles-Q, .c3-circles-V {
        opacity: 0.3
    }    

    .c3-circles-A-poll, .c3-circles-AA-poll, .c3-circles-B-poll, .c3-circles-C-poll, .c3-circles-D-poll, .c3-circles-F-poll, .c3-circles-K-poll, .c3-circles-I-poll, .c3-circles-N-poll, .c3-circles-O-poll, .c3-circles-OE-poll, .c3-circles-Q-poll, .c3-circles-V-poll {
        opacity: 0.3
    }    

    .btn-large {
        margin-bottom: 5px;
        width: 100%
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

    
</style>


<script>
import { eventBus } from './../main';
import JobsList from './JobsList.vue'
import Config from './../interface_config.json'
import c3 from 'c3'
let chart; /* Defining chart in component scope, in order to be able to load new data after chart-generation */


export default {
    components: {
        'app-jobs-list': JobsList
    },    
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
            start: '03-2017',
            end: '12-2017',
            showingPredictions: true,
            showingPolls: true,
            showElec1: true,
            showElec2: true,
            partiesElec1: [],
            partiesElec2: [],
            showLabels: false,
            country: '',
            jobinfo: '',
            coll: 'jobs3',
            showSettings: false,
            themeColor: Config.themeColor
        }
    },
    methods: {
        partyPic: (party) => require('./../assets/dk/' + party + '-small.png'),
        toggleSettings: function() {
            this.showSettings = !this.showSettings
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
                else if (columns[array][0] !== 'x1' && columns[array][0] !== 'x2' && !columns[array][0].includes('poll')) {
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
        toggleLabels: function() {
            console.log("toggling labels")
            if (this.showLabels) {
                chart.legend.hide()
                this.showLabels = false
            }
            else {
                chart.legend.show()
                this.showLabels = true
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
        },
        fetchGraph: function(timePeriodWasChanged = false) {
            let self = this; 
            if (timePeriodWasChanged) {
                this.dataIsReloading = true
            }
            let queryString = "?&jobid=" + this.selectedJob
            for (let setting in this.selectedSettings) {
                queryString += '&' + setting + '=' + this.selectedSettings[setting]
            }   
            queryString += '&start=' + this.start + '&end=' + this.end
            if (this.initialLoading || timePeriodWasChanged) {
                if (this.country == 'dk') {
                    queryString += '&pol=dk'
                } 
                else if (this.country == 'de')
                    queryString += '&pol=de'
            }
            console.log(Config.apiUrl + 'api/getresult/' + this.coll + queryString)
            let myInit = { 
                mode: 'cors'
            };            
            fetch(Config.apiUrl + 'api/getresult/' + this.coll + queryString, myInit)
            .then((response) => {
                console.log("result returned")
                return response.json();
            })
            .then(data => {
                self.columns = data

                if (this.initialLoading) {
                    this.drawChart(data)
                    this.fetchPartyNames(this.columns)
                    this.resetSettings()
                    this.toggleElec1()
                    this.toggleElec2()
                    this.togglePolls()
                    this.drawLines()
                    this.initialLoading = false
                    this.dataIsReloading = false
                    console.log("drawing new chart")
                } 
                else if (timePeriodWasChanged) {
                    chart.load(
                        {
                            unload: true,
                            columns: data
                        }
                    )
                    chart.resize()
                    //setTimeout(() => {chart.unzoom()}, 500)
                    console.log("loading chart with new date period")
                    this.dataIsReloading = false                    
                    setTimeout(function() {chart.unzoom()}, 500)
                }
                else {
                    chart.load(
                        {
                            columns: data
                        }
                    )
                    console.log("loading chart with new setting")
                    this.dataIsReloading = false                
                }
            })
        },
        drawChart: data => {
            let self = this
            chart = c3.generate({
                bindto: '#chart',
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
                    order: null
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
        eventBus.$on('selectedJob', (data) => {
            console.log(data.job)
            let self = this;            
            this.coll = data.coll;
            this.selectedSettings = {};

            this.selectedJob = data['job']; /* Saving passed jobId */
            this.initialLoading = true
            if (chart) {
                chart.destroy()
            }
            let myInit = { 
                mode: 'cors'
            };            
            fetch(Config.apiUrl + 'api/getjobinfo/' + this.coll + '/' + this.selectedJob, myInit) /* Fetching Available settings and setting-values for selected job */
            .then((response) => {
                return response.json();
            })
            .then(data => {
                self.settings = data; /* Saving settings and setting-values */
                self.country = data.country
                delete self.settings['country']
                self.jobinfo = data.jobinfo
                delete self.settings['jobinfo']
                for (let setting in self.settings) {
                    self.$set(self.selectedSettings, setting, self.settings[setting][0])
                }
                $('.modal').modal();
                self.fetchGraph()
            })
        });
    },
    watch: {
        selectedSettings: {
            handler: function(val) {            
                console.log("Selected Setting changed")
                if (!this.initialLoading) {
                    this.dataIsReloading = true;
                    this.fetchGraph();
                }
            },
            deep: true
        }
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
                return this.themeColor
            }
            else {
                return 'grey lighten-1'
            } 
        },
        classElec2: function() {
            if (this.showElec2) {
                return this.themeColor
            }
            else {
                return 'grey lighten-1'
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
