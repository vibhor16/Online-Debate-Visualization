import { Component, OnInit } from '@angular/core';
import {  Utilities, DataService } from 'src/app/common-utils.service';


declare let d3: any;
declare let $: any;

@Component({
  selector: 'app-rank-evolution',
  templateUrl: './rank-evolution.component.html',
  styleUrls: ['./rank-evolution.component.css']
})
export class RankEvolutionComponent implements OnInit {

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.data.currentRankEvolMessage.subscribe( message => this.onNewTagEntry(message))

  }

  onNewTagEntry(message): void{
    if(message.length == 0)
      return;
    $('#rankEvolution').html('');
    this.renderRankEvol(message);
  }

  renderRankEvol(data): void{
    // let data = [
    //   {
    //     name: "USA",
    //     values: [
    //       {date: "2000", price: "100"},
    //       {date: "2001", price: "110"},
    //       {date: "2002", price: "145"},
    //       {date: "2003", price: "241"},
    //       {date: "2004", price: "101"},
    //       {date: "2005", price: "90"},
    //       {date: "2006", price: "10"},
    //       {date: "2007", price: "35"},
    //       {date: "2008", price: "21"},
    //       {date: "2009", price: "201"}
    //     ]
    //   },
    //   {
    //     name: "Canada",
    //     values: [
    //       {date: "2000", price: "200"},
    //       {date: "2001", price: "120"},
    //       {date: "2002", price: "33"},
    //       {date: "2003", price: "21"},
    //       {date: "2004", price: "51"},
    //       {date: "2005", price: "190"},
    //       {date: "2006", price: "120"},
    //       {date: "2007", price: "85"},
    //       {date: "2008", price: "221"},
    //       {date: "2009", price: "101"}
    //     ]
    //   }
    // ];

    let width = 700;
    let height = 600;
    let margin = 150;
    let duration = 250;
    let maxVideoDuration = 200; // seconds
    let lineOpacity = "0.25";
    let lineOpacityHover = "0.85";
    let otherLinesOpacityHover = "0.1";
    let lineStroke = "1.5px";
    let lineStrokeHover = "2.5px";

    let circleOpacity = '0.85';
    let circleOpacityOnLineHover = "0.25"
    let circleRadius = 3;
    let circleRadiusHover = 6;


    /* Format Data */
    // let parseDate = d3.timeParse("%I:%M");
    // data.forEach(function(d) {
    //   d.values.forEach(function(d) {
    //     d.date2 = parseDate(d.date2);
    //   });
    // });


    /* Scale */
    let xScale = d3.scaleTime()
      .domain(d3.extent(data[0].values, d => d.date2))
      .range([0, width-margin]);

    let yScale = d3.scaleLinear()
      .domain([0.7*d3.max(data[0].values, d => d.rank), 1.3*d3.max(data[0].values, d => d.rank)])
      .range([height-margin, 0]);

    let color = d3.scaleOrdinal(d3.schemeCategory10);

    /* Add SVG */
    let svg = d3.select("#rankEvolution").append("svg")
      .attr("width", (width+margin)+"px")
      .style('border','1px solid grey')
      .attr("height", (height+margin)+"px")
      .append('g')
      .attr("transform", `translate(${margin}, ${margin})`);


    /* Add line into SVG */
    let line = d3.line()
      .x(d => xScale(d.date2))
      .y(d => yScale(d.rank));

    let lines = svg.append('g')
      .attr('class', 'lines');

    lines.selectAll('.line-group')
      .data(data).enter()
      .append('g')
      .attr('class', 'line-group')
      .on("mouseover", function(d, i) {
        svg.append("text")
          .attr("class", "title-text")
          .style("fill", color(i))
          .style('font-size', '14px')
          .text(d.name)
          .attr("text-anchor", "middle")
          .attr("x", (width-margin)/2);
      })
      .on("mouseout", function(d) {
        svg.select(".title-text").remove();
      })
      .append('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => color(i))
      .style('opacity', lineOpacity)
      .style('fill','none')
      .style('stroke-width',2)
      .on("mouseover", function(d) {
        d3.selectAll('.line')
          .style('opacity', otherLinesOpacityHover);
        d3.selectAll('.circle')
          .style('opacity', circleOpacityOnLineHover);
        d3.select(this)
          .style('opacity', lineOpacityHover)
          .style("stroke-width", lineStrokeHover)
          .style("cursor", "pointer");
      })
      .on("mouseout", function(d) {
        d3.selectAll(".line")
          .style('opacity', lineOpacity);
        d3.selectAll('.circle')
          .style('opacity', circleOpacity);
        d3.select(this)
          .style("stroke-width", lineStroke)
          .style("cursor", "none");
      });


    /* Add circles in the line */
    lines.selectAll("circle-group")
      .data(data).enter()
      .append("g")
      .style("fill", (d, i) => color(i))
      .selectAll("circle")
      .data(d => d.values).enter()
      .append("g")
      .attr("class", "circle")
      .on("mouseover", function(d,i) {
        d3.select(this)
          .style("cursor", "pointer")
          .append("text")
          .attr("class", "text")
          .style('font-size', '14px')
          .style("fill", 'black')
          .text(parseInt(d.rank))
          .attr("x", d => xScale(d.date2) - 10)
          .attr("y", d => yScale(d.rank) - 20);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .style("cursor", "none")
          .transition()
          .duration(duration)
          .selectAll(".text").remove();
      })
      .append("circle")
      .attr("cx", d => xScale(d.date2))
      .attr("cy", d => yScale(d.rank))
      .attr("r", circleRadius)
      .style('opacity', circleOpacity)
      .on("mouseover", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadiusHover);
      })
      .on("mouseout", function(d) {
        d3.select(this)
          .transition()
          .duration(duration)
          .attr("r", circleRadius);
      });


    /* Add Axis into SVG */
    let xAxis = d3.axisBottom(xScale).tickFormat(function(d) {
      let minutes = Math.floor(d / 60);
      let seconds = +((d % 60)).toFixed(0);
      return (seconds == 60 ? (minutes+1) + ":00" : minutes + ":" + (seconds < 10 ? "0" : "") + seconds);

    });
    let yAxis = d3.axisLeft(yScale);

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${height-margin})`)
      .style("color","black")
      .style("stroke-width","1")
      .style("stroke","grey")
      .call(xAxis)
      .append('text')
      .attr("y", 40)
      .style('font-size','14px')
      .style('fill','black')
      .attr("x", width-margin)
      .attr("fill", "#000")
      .text("Interaction");

    svg.append("g")
      .attr("class", "y axis")
      .style("color","black")
      .style("stroke","grey")
      .call(yAxis)
      .append('text')
      .attr("y", -10)
      .style('font-size','14px')
      .style('fill','black')
      // .attr("transform", "rotate(-90)")
      .attr("fill", "#000")
      .text("Rank");

    // legend
    svg.selectAll("mydots")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", width-margin/2-60)
      .attr("cy", function(d,i){ return 10 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .attr("r", 7)
      .style("fill", function(d,i){ return color(i)})

// Add one dot in the legend for each name.
    svg.selectAll("mylabels")
      .data(data)
      .enter()
      .append("text")
      .attr("x", width-margin/2 - 50)
      .attr("y", function(d,i){ return 10 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
      .style("fill", function(d,i){ return color(i)})
      .text(function(d){ return d.name})
      .attr("text-anchor", "left")
      .style("alignment-baseline", "middle");

    const chartName = svg.append('text')
      .text('RANK EVOLUTION')
      .style('font-size', '12px')
      .style('text-align', 'center')
      .style('fill', 'grey')
      .attr('transform', function(d) {
        // @ts-ignore
        // return "translate( " + parseInt(x(domain[parseInt(num/2)-1]) + xLinePad) + ",-50)"
        return 'translate( -130,-130)';
      });
  }

}
