import { Component, OnInit } from '@angular/core';
import {DataService, Utilities} from '../../common-utils.service';
import {Data} from '@angular/router';
declare var d3: any;

@Component({
  selector: 'app-right-section-fish-cust',
  templateUrl: './right-section-fish-cust.component.html',
  styleUrls: ['./right-section-fish-cust.component.css']
})
export class RightSectionFishCustComponent implements OnInit {

  // tslint:disable-next-line:variable-name
  all_tag_entries_topics: any[];
  client_id: any;
  tagger_type: any;
  wsNeutral: WebSocket;
  wsDemocrat: WebSocket;
  wsRepublican: WebSocket;
  mainData: DataService;
  constructor(private data: DataService) {
    this.mainData = data;
    this.client_id = Date.now();
    let that = this;
    this.tagger_type = this.data.taggerType;
    this.wsNeutral = new WebSocket(`ws://localhost:8000/ws/neutral`);
    this.wsDemocrat = new WebSocket(`ws://localhost:8000/ws/democrat`);
    this.wsRepublican = new WebSocket(`ws://localhost:8000/ws/republican`);

    this.wsNeutral.onmessage = function(event) {
      if(event.data.indexOf("[{'Amy'")>=0){
        that.mainData.changeInteractionSummaryEntry(JSON.parse(event.data));
      }else if(event.data.indexOf("[{'name'")>=0){
        that.mainData.changeRankEvolutionEntry(JSON.parse(event.data));
      }
      else if(event.data.indexOf('democrats') >= 0){
        that.mainData.changeFishEntry(JSON.parse(event.data),"neutral");
      } else {
        that.mainData.changeMessage(JSON.parse(event.data),"neutral");
      }
    };

    this.wsDemocrat.onmessage = function(event) {
      if(event.data.indexOf('democrats') > 0){
        that.mainData.changeFishEntry(JSON.parse(event.data),"democrat");
      } else {
        that.mainData.changeMessage(JSON.parse(event.data),"democrat");
      }
    };

    this.wsRepublican.onmessage = function(event) {
      if(event.data.indexOf('democrats') > 0){
        that.mainData.changeFishEntry(JSON.parse(event.data),"republican");
      } else {
        that.mainData.changeMessage(JSON.parse(event.data),"republican");
      }
    };
  }

  onNewTagEntry(newEntry): void{
    if(newEntry != '') {
      for(let i=0;i<newEntry.length;i++) {
        this.all_tag_entries_topics.push(newEntry[i]);
        this.drawFishDiagram(this.all_tag_entries_topics);
      }
    }
  }


  ngOnInit(): void {
    this.all_tag_entries_topics = [];
    this.data.currentFishMessage.subscribe(message => this.onNewTagEntry(message));
  }

  drawFishDiagram(all_tag_entries_topics): void {
    document.getElementById("mydiv").innerHTML = "";
    var margin = {top: 0, right: 20, bottom: 0, left: 95},
    width = document.getElementById("mydiv").clientWidth - margin.left - margin.right,
    height = document.getElementById("mydiv").clientHeight - margin.top - margin.bottom-50;

    // set the ranges

    let index:any;
    var people = [];
    var colors = [];
    for (index=0;index < Utilities.debatersList.profiles.length; index++){
      people.push(Utilities.debatersList.profiles[index].name);
      colors.push(this.Colors[index]);
    }

    var myColor = d3.scaleLinear().domain([0, Utilities.debatersList.profiles.length])
      .range(this.Colors);

    var data = [];
    for (index=0;index < all_tag_entries_topics.length; index++){
      var democrats = this.all_tag_entries_topics[index].democrats;
      var republican = this.all_tag_entries_topics[index].republican;
      var direction = this.all_tag_entries_topics[index].direction;
      var time = this.all_tag_entries_topics[index].timestamp;
      let i: any;
      let j: any;
      // var previousTime = time;
      for(i=0; i< democrats.length; i++){
        for(j=0; j<republican.length; j++){
          var temp_entry = [];
          // if(time == previousTime){
          //   time = parseFloat(time) + 2;
          // }
          if("to" == direction){
            temp_entry = [time
              , Utilities.getDebaterRecordById(democrats[i]).name
              , Utilities.getDebaterRecordById(republican[j]).name];
            data.push(temp_entry);
          }else{
            temp_entry = [time
              , Utilities.getDebaterRecordById(republican[j]).name
              , Utilities.getDebaterRecordById(democrats[i]).name];
            data.push(temp_entry);
          }
          // previousTime = time;
        }
      }

    }

    // var people = ["Bernie","Elizabeth", "Trump", "Obama", "Kamala"];

    // var colors = ["red", "yellow", "green", "blue", "purple"];


    // d3.scaleLinear
    var x = d3.scaleLinear()
            .range([0, width]);


    var y = d3.scaleBand()
            .range([height, 0]);

    var svg = d3.select("#mydiv").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .style("background-color", "white")
      .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");


  var data2 = [];
    // format the data
    data.forEach(function(d) {
      data2.push({time:d[0], attacker:d[1], victim: d[2]})
    });
  data = data2;

    const maxX = parseInt(d3.max(data, function(d) { return +d.time;} ));
    x.domain([0,maxX]);
    y.domain(people);

    // append the rectangles for the bar chart
    var pady = (height - y(people[0]))/2;


    const temptry = svg.selectAll(".bar")
    .data(data)
    .enter();

    temptry.append("line")
      .attr("class", "bar")
      .attr("stroke", "black")
      .attr("x1", function(d) {
        return x(d.time);
      })
      .attr("y1", function(d) { return pady+y(d.attacker)})
      .attr("x2", function(d) { return x(d.time); })
      .attr("y2", function(d) { return pady+y(d.victim)})
      .attr("stroke-width", 1);

      temptry.append("circle").attr("cx", function(d) {
        return x(d.time);
      }).attr("cy", function(d) { return pady+y(d.attacker)})
      .attr("r", 3)
      .style("fill", "red");

      temptry.append("circle").attr("cx", function(d) {
        return x(d.time);
      }).attr("cy", function(d) { return pady+y(d.victim)})
      .attr("r", 3)
      .style("fill", "blue");


      svg.selectAll(".bar-axis")
        .data(people)
        .enter().append("rect")
        .attr("class", "bar-axis")
        .attr("x", function(d) { return 0; })
        .attr("width", width)
        .attr("y", function(d) { return pady+y(d)})
        .attr("height", 1);

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    let yaxis = svg.append("g")
        .call(d3.axisLeft(y));

        yaxis.selectAll("text").style("stroke","black");

        yaxis.selectAll("line").style("stroke","white");

        yaxis.selectAll("path").style("stroke","white");

  }

  ngAfterContentInit(): void {
    this.drawFishDiagram(this.all_tag_entries_topics);
  }

  Colors = [
    'darkblue',
    "darkcyan",
    "darkgrey",
    "darkgreen",
    "darkkhaki",
    "darkmagenta",
    "darkolivegreen",
    "darkorange",
    "darkorchid",
    "darkred",
    "darksalmon",
    "darkviolet",
    "fuchsia",
    "gold",
    "green",
    "indigo",
    "red",
    "silver",
    "white",
    "yellow"
  ];



}
