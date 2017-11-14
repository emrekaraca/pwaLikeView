<template>
    <div class="main container">
        <div class="row card grey lighten-4">            
            <div class="col s12 center-align chordChartContainer">
                <svg id="chordChart" v-bind:width="containerWidth" v-bind:height="containerWidth"></svg>                
            </div>
            <div class="col s0 m2"></div>
            <div class="col s12 m8">
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
                        Until {{getSunday(timePeriods[pickedDate2])}}
                        <input type="range" id="test5" min="0" v-bind:max="timePeriods.length-1" v-model="pickedDate2"/>
                    </p>
                </form>                
            </div>
        </div>
    </div>
  
</template>

<style>
    .group-tick line {
        stroke: #000;
    }

</style>

<script>
    import Config from './../interface_config.json'
    import * as d3 from "d3";

    export default {
        data () {
            return {
                columns: [],
                loading: true,
                partyNames: ['A', 'AA', 'B', 'C', 'F', 'I', 'NB', 'O', 'OE', 'V'],
                partyNamesFull: ['Socialdem.', 'Ålternativet', 'Rad. Venstre', 'Kons. Folkep.', 'Soc. Folkep.', 'Liberal All.', 'Nye Borg.', 'Dansk Folkep.', 'Enhedsl.', 'Venstre'],
                partyActive: {'A': true, 'AA': true, 'B': true, 'C': true, 'F': true, 'I': true, 'NB': true, 'O': true, 'OE': true, 'V': true},
                timePeriods: [],
                pickedDate1: 0,
                pickedDate2: 0,
                multiWeek: false,
                containerWidth: 0,
                partyColors: [
                    'rgba(227, 47, 59, 0.5)',
                    'rgba(90, 255, 90, 0.5)',
                    'rgba(229, 43, 145, 0.5)',
                    'rgba(15, 133, 75, 0.5)',
                    'rgba(156, 29, 42, 0.5)',
                    'rgba(239, 133, 53, 0.5)',
                    'rgba(0, 68, 79, 0.5)',
                    'rgba(0, 80, 120, 0.5)',
                    'rgba(115, 21, 37, 0.5)',
                    'rgba(15, 132, 187, 0.5)'],
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
                let data = self.$store.state.voteSwingData.map(x=>x.slice(0, x.length))
                self.loading = false
                self.timePeriods = data[0].slice(1, data[0].length)
                self.pickedDate1 = self.timePeriods.length-1
                self.pickedDate2 = self.timePeriods.length-1
                self.columns = data.slice(1, data.length)
                if ($('.chordChartContainer').width() > 900) {
                    self.containerWidth = 900
                } else {
                    self.containerWidth = +$('.chordChartContainer').width()
                }
                return 'x'
            },
            drawChart: function () {
                $('#chordChart').html('')

                let self = this

                let opacityDefault = 0.6

                let matrix = this.selectedColumn;

/*              let matrix = [
                    [0, 100, 10, 10], // A
                    [10, 0, 50, 10], // AA
                    [10, 10, 0, 10], // B
                    [10, 10, 10, 0] // C               
                ]
*/
            

                let svg = d3.select("#chordChart"),
                    width = +svg.attr("width"),
                    height = +svg.attr("height"),
                    outerRadius = Math.min(width*0.8, height*0.8) * 0.5 - 40,
                    innerRadius = outerRadius - 30;     
                    
                var formatValue = d3.formatPrefix(",.0", 1e3);

                var chord = d3.chord()
                    .padAngle(0.05)
                    .sortSubgroups(d3.descending);

                var arc = d3.arc()
                    .innerRadius(innerRadius)
                    .outerRadius(outerRadius);

                var ribbon = d3.ribbon()
                    .radius(innerRadius)

                var color = d3.scaleOrdinal()
                    .domain(d3.range(4))
                    .range(this.partyColors);

                var g = svg.append("g")
                    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")")
                    .datum(chord(matrix))
                    

                var group = g.append("g")
                    .attr("class", "groups")
                .selectAll("g")
                .data(function(chords) { return chords.groups; })
                .enter().append("g");

                group.append("path")
                    .style("fill", function(d) { return color(d.index); })
                    .style("stroke", function(d) { return d3.rgb(color(d.index)).darker(); })
                    .attr("class", "group")
                    .attr("id", function(d, i){return "group-" + d.index;})
                    .attr("d", arc);

                group.append("text")
                    .attr("x", 6)
                    .attr("dy", 15)
                .append("textPath")
                    .attr("xlink:href", function(d) { return "#group" + d.index; })
                    .text(function(chords, i){return self.partyNamesFull[i];})
                    .style("fill", "white");             
                    
                group.append("text")
                .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
                .attr("dy", ".35em")
                .attr("class", "titles")
                .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                .attr("transform", function(d) {
                    return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                    + "translate(" + (outerRadius + 40) + ")"
                    + (d.angle > Math.PI ? "rotate(180)" : "");
                })
                .text(function(d,i) { return self.partyNamesFull[i]; });                    

                var groupTick = group.selectAll(".group-tick")
                .data(function(d) { return groupTicks(d, 1e3); })
                .enter().append("g")
                    .attr("class", "group-tick")
                    .attr("transform", function(d) { return "rotate(" + (d.angle * 180 / Math.PI - 90) + ") translate(" + outerRadius + ",0)"; });

                groupTick.append("line")
                    .attr("x2", 6);

                groupTick
                .filter(function(d) { return d.value % 5e3 === 0; })
                .append("text")
                    .attr("x", 8)
                    .attr("dy", ".35em")
                    .attr("transform", function(d) { return d.angle > Math.PI ? "rotate(180) translate(-16)" : null; })
                    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
                    .text(function(d) { return formatValue(d.value); });

                g.append("g")
                    .attr("class", "ribbons")
                .selectAll("path")
                .data(function(chords) { return chords; })
                .enter().append("path")
                    .attr("d", ribbon)
                    .attr("class", "chord")
                    .style("fill", function(d) { return color(d.target.index); })
                    .style("stroke", function(d) { return d3.rgb(color(d.target.index)).darker(); })
                    .style("opacity", "0.6");                                        

                // Returns an array of tick angles and values for a given group and step.
                function groupTicks(d, step) {
                    var k = (d.endAngle - d.startAngle) / d.value;
                    return d3.range(0, d.value, step).map(function(value) {
                        return {value: value, angle: value * k + d.startAngle};
                    });
                }

                d3.selectAll(".group")
                    .on("mouseover", function(d, i) {
                        console.log(d, i)
                        svg.selectAll("path.chord")
                            .filter(function(d) { return d.source.index != i && d.target.index != i; })
                            .transition()
                            .style("stroke-opacity", 0.1)
                            .style("fill-opacity", 0.1);
                    })/*fade*/
                    .on("mouseout", function(d, i) {
                        console.log(d, i)
                        svg.selectAll("path.chord")
                            .filter(function(d) { return d.source.index != i && d.target.index != i; })
                            .transition()
                            .style("stroke-opacity", 0.6)
                            .style("fill-opacity", 0.6);
                    })/*fade*/
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
            partyButtonClasses: function () {
                let classes = {};
                for (let party in this.partyNames) {
                    if (this.partyActive[this.partyNames[party]]) {
                        classes[this.partyNames[party]] = 'blue-grey lighten-1'
                    } else {
                        classes[this.partyNames[party]] = 'grey'
                    }
                }
                return classes
            },
            activeParties: function () {
                return this.partyNames.filter((i) => this.partyActive[i])
            },
            selectedColumn: function() {
                let self = this

                let week = 1
                let matrix = [];
                for (let party1 in self.activeParties) {
                    matrix.push([])
                    for (let party2 in self.activeParties) {
                        if (party1 == party2 + "XXXX") {
                            matrix[party1].push(0)
                        }
                        else {
                            matrix[party1].push(
                                self.columns
                                    .filter((column) => {
                                        if (column[0] == self.activeParties[party1] + '-' + self.activeParties[party2]) {
                                            return column
                                    }})
                                    .map((column) => {
                                        let sum = 0;
                                        for (let i = parseInt(this.pickedDate1)+1; i <= parseInt(this.pickedDate2)+1; i++) {
                                            sum += column[i]
                                        }
                                        return [sum]
                                    })
                                        
                                    [0][0]
                            )
                        }
                    }
                }
                return matrix
            }
        }
    }
</script>
