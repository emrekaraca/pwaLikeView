<template>
    <div class="main container">
        <div class="row">
            <div class="col s12 l6">
                <app-ex1></app-ex1>
            </div>
            <div class="col s12 l6">
                <app-ex3></app-ex3>
            </div>
            <div class="col s12 l6">
                <app-ex4></app-ex4>
            </div>
            <div class="col s12 l6">
                <app-ex5></app-ex5>
            </div>
            <div class="col s12 l6">
                <app-ex6></app-ex6>
            </div>
            <div class="col s12 l6">
                <app-ex7></app-ex7>
            </div>
        </div>
    </div>
  
</template>


<script>
import Timeseries from './Timeseries.vue'
import PieChart from './PieChart.vue'
import ChordChart from './ChordChart.vue'
import SankeyChart from './SankeyChart.vue'
import FlowChart from './FlowChart.vue'
import WaffleChart from './WaffleChart.vue'

    export default {
        data () {
            return {
            }
        },
        components: {
            'app-ex1': Timeseries,
            'app-ex3': PieChart,
            'app-ex4': ChordChart,
            'app-ex5': SankeyChart,
            'app-ex6': FlowChart,
            'app-ex7': WaffleChart,
        }        
    }
</script>
