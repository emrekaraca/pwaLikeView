<template id="">
    <div class="main container" >
        <div class="right-align" style="margin-top: -30px; margin-right: -20px">
            <a href="#" data-activates="slide-out" class="button-collapse2 btn-large btn-floating waves-effect waves-light blue-grey darken-1"><i class="material-icons">timeline</i></a>
        </div>

        <div class="row" style="margin-top: -15px">
                
                <ul id="slide-out" class="side-nav">
                    <div class="center-align listHeader">
                        <h5>Select Country</h5>
                        <button class="btn btn-flat waves-effect waves-light" v-bind:class="deClass" @click="changeCountry('de')">DE</button>
                        <button class="btn btn-flat waves-effect waves-light" v-bind:class="dkClass" @click="changeCountry('dk')">DK</button>
                        <button class="btn blue-grey disabled">NO</button>
                        <button class="btn blue-grey disabled">NZ</button>
                    </div>
                    <table class="striped">
                        <thead>
                            <tr>
                                <th>Job Name</th>
                                <th>Country</th>
                                <th>
                                    <div class="switch right-align">
                                        <label>
                                        <input type="checkbox" v-model="deleteActive">
                                        <span class="lever"></span>
                                        </label>
                                    </div>                                    
                                </th>
                            </tr>
                        </thead>
                        <tbody v-if="loading">
                            <br>
                            <div class="center-align abc">
                                <div class="preloader-wrapper big active">
                                    <div class="spinner-layer spinner-green-only">
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
                        </tbody>
                        <tbody v-else>
                            <tr v-for="job in predictionJobs2">
                                <td>{{ job }}</td>
                                <td>{{ selectedCountry.toUpperCase()}}</td>
                                <td class="right-align">
                                    <a class="btn-floating waves-effect waves-light blue-grey lighten-1" @click="passJob(job)"><i class="material-icons">timeline</i></a>
                                    <a class="btn-floating waves-effect waves-light red lighten-3" v-bind:class="deleteClass" @click="deleteJob(job)"><i class="material-icons">delete</i></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </ul>
            </div>
        </div>
    </div>
</template>

<style>
    .switch label input[type=checkbox]:checked+.lever {
        background-color: #90a4ae;
    }


    .switch label input[type=checkbox]:checked+.lever:after {
        background-color: #607d8b;
    }    

    .listHeader {
        margin: 30px 0px 20px 0px
    }
</style>

<script>
  import Config from './../interface_config.json'
  import { eventBus } from './../main';

  export default {
    data() {
        return {
            loading: true,
            predictionJobs: [],
            deleteActive: false,
            selectedCountry: 'de'
        }
    },
    computed:  {
        predictionJobs2: function() {return this.predictionJobs},
        deleteClass: function() {
            if (this.deleteActive) {
                return
            } else {
                return 'disabled'
            }
        },
        coll: function() {
            if (this.selectedCountry == 'de') {
                return 'jobs'
            }
            else if (this.selectedCountry == 'dk') {
                return 'danishresults'
            }
        },
        deClass: function() {
            if (this.selectedCountry == 'de') {
                return 'blue-grey'
            }
            else {
                return 'blue-grey lighten-3'
            }
        },
        dkClass: function() {
            if (this.selectedCountry == 'dk') {
                return 'blue-grey'
            }
            else {
                return 'blue-grey lighten-3'
            }
        }
    },
    methods: {
        changeCountry: function(country) {
            this.loading = true;
            this.selectedCountry = country;
            this.loadJobs()
        },

        loadJobs: function() {
            let self = this;
            let myInit = { 
                mode: 'cors'
            };
            fetch(Config.apiUrl + 'api/getjobslist/' + this.coll, myInit)
            .then((response) => {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                self.loading = false
                self.predictionJobs = data;
            })
        },
        passJob: function(job) {
            $('.button-collapse').sideNav('hide');
            console.log("passing ", job);
            let data = {job: job, coll: this.coll}
            eventBus.$emit('selectedJob', data);
        },
            deleteJob: function(job) {
            let self = this
            let myInit = { 
                mode: 'cors'
            };            
            console.log("deleting ", job);
            fetch(Config.apiUrl + 'api/deletejob/' + this.coll + '/' + job, myInit)
            .then((response) => {
                console.log(response)
                return fetch(Config.apiUrl + 'api/getjobslist/' + this.coll, myInit)
            })        
            .then((response) => {
                return response.json();
            })
            .then(function(data) {
                console.log(data);
                self.loading = false
                self.predictionJobs = data;
            })        
          
            //eventBus.$emit('selectedJob', job);
        }      
    },
    mounted() {
        $(".button-collapse2").sideNav({
            menuWidth: 450,
            closeOnClick: true
        });
        $(".button-collapse2").sideNav('show')
    },
    created() {
        this.loadJobs()
    }
  }

</script>
