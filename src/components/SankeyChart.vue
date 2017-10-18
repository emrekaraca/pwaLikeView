<template>
    <div class="main container">
        <div class="row card chartCard grey lighten-4">
            <div class="col s12">
                <div class="card-content">
                    <span class="card-title section-title">Sankey Chart</span>
                </div>
                <div class="row">
                    <div class="col s0 l2"></div>
                    <div class="col s12 l8">
                        <div class="start label left">From</div>
                        <div class="end label right">To</div>
                    </div>
                </div>
                <div class="row">
                    <div class="col s12 center-align sankeyChartContainer">
                        <svg id="sankeyChart" v-bind:width="containerWidth" v-bind:height="chartHeight"></svg>

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
                    <div class="col s1 m2"></div>
                    <div class="col s10 m8">
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
                                <span>Until {{getSunday(timePeriods[pickedDate2])}}</span>
                                <input type="range" id="test5" min="0" v-bind:max="timePeriods.length-1" v-model="pickedDate2"/>
                            </p>
                        </form>                
                    </div>
                </div>
            </div>    
            </div>    

    </div>
  
</template>

<style>
    .spinner-layer {
        border-color: #90a4ae;
    }

    .group-tick line {
    stroke: #000;
    }

    .ribbons {
    fill-opacity: 0.67;
    }    

    .chartContainer {
        width: 100%
    }

    .greyClass {
        stroke: grey!important
    }

    rect:hover {
        opacity: 1!important
    }

    div.tooltip {	
        position: absolute;	
        font-size: 18px;
        line-height: 1.5;
        width: 150px;
        height: 100px;	
        text-align: center;			
        pointer-events: none;	
        box-shadow: 0 2px 4px rgba(0,0,0,0.15)
    }    


    .tooltip-header {
        background-color: white;
        height: 50px;
        padding-top: 12px;
    }

    .tooltip-header>i {
        font-size: inherit;
        transform: translateY(3px)
    }

    .tooltip-value {
        background-color: #eeeeee;
        height: 50px;
        padding-top: 12px;
    }
    
    .tooltip-header>* {
        display: inline-flex;
    }


</style>

<script>
    import Config from './../interface_config.json'
    import * as d3 from 'd3'
    d3.sankey = require("d3-sankey").sankey
    d3.sankeyLinkHorizontal = require("d3-sankey").sankeyLinkHorizontal
    //var d3 = Object.assign({}, require("d3"), require("d3-sankey"));

    export default {
        data () {
            return {
                columns: [],
                loading: true,
                partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
                partyNamesFull: ['Socialdemokratiet', 'Ålternativet', 'Radikale Venstre', 'Det Konservative Folkeparti', 'Socialistisk Folkeparti', 'Liberal Alliance', 'Nye Borgerlige', 'Dansk Folkeparti', 'Enhedslisten', 'Venstre'],
                partyActive: {'A': true, 'AA': true, 'B': true, 'C': true, 'F': true, 'I': true, 'NB': true, 'O': true, 'OE': true, 'V': true},
                timePeriods: [],
                pickedDate1: 0,
                pickedDate2: 0,
                multiWeek: false,    
                containerWidth: 0,
                partyColors: [
                    'rgba(227, 47, 59, 1)',
                    'rgba(90, 255, 90, 1)',
                    'rgba(229, 43, 145, 1)',
                    'rgba(15, 133, 75, 1)',
                    'rgba(156, 29, 42, 1)',
                    'rgba(239, 133, 53, 1)',
                    'rgba(99, 99, 99, 1)',
                    'rgba(0, 80, 120, 1)',
                    'rgba(115, 21, 37, 1)',
                    'rgba(15, 132, 187, 1)'],
                partyColors2: {
                    A: 'rgb(227, 47, 59)',
                    AA: 'rgb(90, 255, 90)',
                    B: 'rgb(229, 43, 145)',
                    C: 'rgb(15, 133, 75)',
                    F: 'rgb(156, 29, 42)',
                    I: 'rgb(239, 133, 53)',
                    NB:'rgb(99, 99, 99)',
                    O: 'rgb(0, 80, 120)',
                    OE: 'rgb(115, 21, 37)',
                    V: 'rgb(15, 132, 187)'                
                },
                themeColor: Config.themeColor
            }
        },
        methods: {
            getMonday: function (date) {
                let monday = new Date(new Date(date).setDate(new Date(date).getDate()-6))
                return monday.getDate() + '.' + parseInt(monday.getMonth()+1) + '.' + monday.getFullYear()
            },
            getSunday: function (date) {
                let sunday = new Date(date)
                return sunday.getDate() + '.' + parseInt(sunday.getMonth()+1) + '.' + sunday.getFullYear()
            },
            toggleParty: function (party) {
                this.partyActive[party] = !this.partyActive[party]
            },
            loadData: function() {
                let self = this;
                let data = self.$store.state.voteSwingData
                self.loading = false
                self.timePeriods = data[0].slice(1, data[0].length)
                self.pickedDate1 = self.timePeriods.length-1
                self.pickedDate2 = self.timePeriods.length-1
                self.columns = data.slice(1, data.length)
                if ($('.sankeyChartContainer').width() > 900) {
                    self.containerWidth = 900
                } else {
                    self.containerWidth = +$('.sankeyChartContainer').width()
                }
            },
            drawChart: function () {
                $('#sankeyChart').html('')

                let self = this

                let svg = d3.select("#sankeyChart"),
                    width = +svg.attr("width"),
                    height = +svg.attr("height");

                var formatNumber = d3.format(",.0f"),
                    format = function(d) { return formatNumber(d) + " Likes"; };

                var color = d3.scaleOrdinal()
                    .range(this.partyColors);

                var sankey = d3.sankey()
                    .nodeWidth(40)
                    .nodePadding(10)
                    .extent([[1, 1], [width - 1, height - 6]])
                    //.layout(0);

                var link = svg.append("g")
                    .attr("class", "links")
                    .attr("fill", "none")
                    .attr("stroke", "#000")
                    .attr("stroke-opacity", 0.2)
                .selectAll("path");

                var node = svg.append("g")
                    .attr("class", "nodes")
                    .attr("font-family", "sans-serif")
                    .attr("font-size", 10)
                .selectAll("g");

                var div = d3.select(".sankeyChartContainer").append("div")	
                    .html('<h5>test</h5>')
                    .attr("class", "tooltip")				
                    .style("opacity", 0);                

                let voteSwings = this.selectedColumn
                sankey(voteSwings);

                link = link
                    .data(voteSwings.links)
                    .enter().append("path")
                    .attr("d", d3.sankeyLinkHorizontal())
                    .attr("stroke-width", function(d) { return Math.max(1, d.width); })
                    .attr("id", function(d) { return "link-" + d.index})
                    .style('stroke', function(d) { return self.partyColors2[d.source.name]})
                    .attr("class", "greyClass")
                    .on("mouseover", function(d) {	
                        console.log(d)	
                        div.transition()		
                            .duration(200)		
                            .style("opacity", .95);
                        div	.html(
                            '<div class="tooltip-header"><div>' + d.source.name + '</div><i class="material-icons small">trending_flat</i> <div>' + d.target.name + '</div></div><div class="tooltip-value"><strong>' + d.value + '</strong> Likes</div></div>'
                        )
                    })
                    .on("mousemove", function(d) {
                        div.style("left", (d3.event.pageX - 100) + "px")
                            .style("top", (d3.event.pageY - 120) + "px");
                    })
                    .on("mouseout", function(d) {		
                        div.transition()		
                            .duration(500)		
                            .style("opacity", 0);	
                    })
                    
                    

                /*link.append("title")
                    .text(function(d) { return d.source.name + " → " + d.target.name + "\n" + format(d.value); });*/

                node = node
                    .data(voteSwings.nodes)
                    .enter().append("g")


                node.append("rect")
                    .attr("x", function(d) { return d.x0; })
                    .attr("y", function(d) { return d.y0; })
                    .attr("height", function(d) { return d.y1 - d.y0; })
                    .attr("width", function(d) { return d.x1 - d.x0; })
                    .attr("fill", function(d) { return color(d.name.replace(/ .*/, "")); })
                    .style("opacity", 0.7)
                    .style("cursor", 'pointer')
                    .on("click",highlight_node_links)
                    .on("mouseover", function(d) {	
                        console.log(d)	
                        div.transition()		
                            .duration(200)		
                            .style("opacity", 0.95);
                        div	.html(
                            '<div class="tooltip-header"><div>' + d.name + '</div></div><div class="tooltip-value"><strong>' + d.value + '</strong> Likes</div></div>'
                        )
                    })
                    .on("mousemove", function(d) {
                        div.style("left", (d3.event.pageX - 100) + "px")
                            .style("top", (d3.event.pageY - 120) + "px");
                    })
                    .on("mouseout", function(d) {		
                        div.transition()		
                            .duration(500)		
                            .style("opacity", 0);	
                    })
                    

                node.append("text")
                    .attr("x", function(d) { return d.x0 - 6; })
                    .attr("y", function(d) { return (d.y1 + d.y0) / 2; })
                    .attr("dy", "0.35em")
                    .attr("text-anchor", "end")
                    .text(function(d) { return d.name; })
                    .filter(function(d) { return d.x0 < width / 2; })
                    .attr("x", function(d) { return d.x1 + 6; })
                    .attr("text-anchor", "start");           

                /*node.append("title")
                    .text(function(d) { return d.name + "\n" + format(d.value); });*/

                function highlight_node_links(node,i){

                    var remainingNodes=[],
                        nextNodes=[];

                    let stroke_opacity = 0;
                    let classChange = true;
                    if( d3.select(this).attr("data-clicked") == "1" ){
                    d3.select(this).attr("data-clicked","0");
                    stroke_opacity = 0.2;
                    classChange = true
                    }else{
                    d3.select(this).attr("data-clicked","1");
                    stroke_opacity = 0.7;
                    classChange = false
                    }

                    var traverse = [{
                                    linkType : "sourceLinks",
                                    nodeType : "target"
                                    },{
                                    linkType : "targetLinks",
                                    nodeType : "source"
                                    }];

                    traverse.forEach(function(step){
                    node[step.linkType].forEach(function(link) {
                        console.log(link)
                        remainingNodes.push(link[step.nodeType]);
                        highlight_link(link.index, stroke_opacity, classChange);
                    });

                    while (remainingNodes.length) {
                        nextNodes = [];
                        remainingNodes.forEach(function(node) {
                        node[step.linkType].forEach(function(link) {
                            nextNodes.push(link[step.nodeType]);
                            highlight_link(link.index, stroke_opacity, classChange);
                        });
                        });
                        remainingNodes = nextNodes;
                    }
                    });
                }

                function highlight_link(id,opacity, classChange){
                    d3.select("#link-"+id).style("stroke-opacity", opacity)
                    d3.select("#link-"+id).classed("greyClass", classChange)                    

                    console.log('highlighting: ', id, opacity)
                }






            }
        },
        mounted () {
            this.loadData()
            // this.computeData()
        },
        updated () {
            this.drawChart()
        },
        watch: {
            activeParties: function () {
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
            chartHeight: function () {
                return this.containerWidth * 1.1
            },
            activeParties: function () {
                return this.partyNames.filter((i) => this.partyActive[i])
            },
            selectedColumn: function() {
                let self = this

                let week = 1
                let swing = {nodes: [], links: []};

                for (let party1 in this.partyNames) {
                    for (let party2 in this.partyNames) {
                        let link = {
                            "source": parseInt(party1), 
                            "target": parseInt(party2)+this.partyNames.length, 
                            "value": this.columns
                                .filter((column) => column[0] == this.partyNames[party1] + '-' + this.partyNames[party2])
                                .map((column) => {
                                    let sum = 0;
                                    for (let i = parseInt(this.pickedDate1)+1; i <= parseInt(this.pickedDate2)+1; i++) {
                                        sum += parseInt(column[i])
                                    }
                                    return [sum]
                                })[0][0]
                        }
                        if (link.value > 0) {
                            swing.links.push(link)
                        }
                    }
                }
                for (let party in this.partyNames) {
                    swing.nodes.push({'name': this.partyNames[party]})
                }
                for (let party in this.partyNames) {
                    swing.nodes.push({'name': this.partyNames[party]})
                }
                return swing
            }
            
        }
    
    }
</script>
