import { Component, OnInit } from '@angular/core';
import * as d3 from "d3";
import {  Utilities, DataService } from 'src/app/common-utils.service';

@Component({
  selector: 'app-right-section-fish',
  templateUrl: './right-section-fish.component.html',
  styleUrls: ['./right-section-fish.component.css']
})
export class RightSectionFishComponent implements OnInit {
  all_tag_entries_topics: any[];
  constructor(private data: DataService) { 
    // debugger
    console.log("constructor", data);
    // console.log(data);
  }

  // constructor() { }

  onNewTagEntry(newEntry): void{
    console.log("newEntry: ", newEntry);
    if(newEntry != '') {
      console.log("newEntry is: ");
      console.log(newEntry);
      this.all_tag_entries_topics.push(newEntry);
    }
  }


  ngOnInit(): void {
    this.all_tag_entries_topics = [];
    console.log("subscribing");
    this.data.currentMessage.subscribe(message => this.onNewTagEntry(message));
    console.log("subscribed");
  }

  ngAfterContentInit(): void {
    document.getElementById("mydiv").innerHTML = "";
    console.log("hello");
    var margin = {top: 0, right: 20, bottom: 0, left: 80},
    width = document.getElementById("mydiv").clientWidth - margin.left - margin.right,
    height = document.getElementById("mydiv").clientHeight - margin.top - margin.bottom;

    // set the ranges
    var people = ["Bernie","Elizabeth", "Trump", "Obama", "Kamala"];
    var colors = ["red", "yellow", "green", "blue", "purple"];
    console.log("people",people);
    console.log(colors);
    console.log("xxxx");
    // debugger
    // d3.scaleLinear
    var x = d3.scaleLinear()
            .range([0, width]);
    console.log("x: ", x);
                

    var y = d3.scaleBand()
            .range([height, 0]);
    console.log("y: ", y);

    var svg = d3.select("#mydiv").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", 
            "translate(" + margin.left + "," + margin.top + ")");
    
    console.log("svg: ", svg);

      var data = [
  [0,"Bernie", "Elizabeth"],
  [10,"Elizabeth", "Trump"],
  [20,"Bernie", "Trump"],
  [30,"Trump", "Bernie"],
  [40, "Kamala", "Bernie"],
  [5,"Bernie", "Elizabeth"],
  [15,"Elizabeth", "Trump"],
  [25,"Bernie", "Trump"],
  [35,"Trump", "Bernie"],
  [33, "Kamala", "Bernie"],
  [45, "Kamala", "Bernie"]];
  console.log(data);
  var data2 = []
  //   if (error) throw error;

    // format the data
    data.forEach(function(d) {
      data2.push({time:d[0], attacker:d[1], victim: d[2]}) 
      // console.log(data2) 
      // d.sales = +d.sales;
    });
  //   debugger
  data = data2
  console.log("data is: ", data);
  console.log(data);

  // debugger
  //   Scale the range of the data in the domains
    // x.domain(data.map(function(d) { return d.salesperson; }));
    x.domain([0, 120]);
  //   y.domain([0, d3.max(data, function(d) { return d.sales; })]);
    y.domain(people);

    // append the rectangles for the bar chart
    var pady = (height - y(people[0]))/2;

    svg.append("svg:defs").append("svg:marker")
      .attr("id", "triangle")
      .attr("refX", 6)
      .attr("refY", 6)
      .attr("markerWidth", 30)
      .attr("markerHeight", 30)
      .attr("markerUnits","userSpaceOnUse")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "black");
      // path
      // svg.append("path")
      //       .attr("marker-end", "url(#triangle)")
      //       .attr("d", "M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80")
      //       .attr("stroke", "grey")
      //       .attr("stroke-width", "1.5")          
      //       .attr("fill", "transparent")
      //       .attr("class", "edges");


      // debugger
      
    svg.selectAll(".bar")
      .data(data)
      .enter().append("line")
      .attr("class", "bar")
      //   .attr("x", function(d) { return x(d.time); })
      //   .attr("width", 2)
      //   .attr("y", function(d) { return pady+Math.min(y(d.attacker), y(d.victim)); })
      //   .attr("height", function(d) { 
      //       return Math.abs(y(d.attacker) - y(d.victim)); 
      //     })
      //     .attr("marker-end", "url(#triangle)");
      
      .attr("x1", function(d) {
        console.log("gagan");
        console.log(d.time); 
        return x(d.time); 
      })
      .attr("y1", function(d) { return pady+y(d.attacker)})
      .attr("x2", function(d) { return x(d.time); })
      .attr("y2", function(d) { return pady+y(d.victim)})
      .attr("stroke-width", 1)
      .attr("stroke", function(d) { 
          // debugger
          console.log(d.attacker);
          console.log(people.indexOf(d.attacker ));
          console.log(colors[people.indexOf(d.attacker)]);
          return colors[people.indexOf(d.attacker)];
      })
      .attr("marker-end", "url(#triangle)");

      svg.selectAll(".bar-axis")
        .data(people)
        .enter().append("rect")
        .attr("class", "bar-axis")
        .attr("x", function(d) { return 0; })
        .attr("width", width)
        .attr("y", function(d) { return pady+y(d)})
        .attr("height", 1)
        .attr("stroke", "black");




    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

        // debugger

  }

}
