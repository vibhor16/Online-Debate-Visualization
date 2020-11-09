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
  ws: WebSocket;
  mainData: DataService;
  constructor(private data: DataService) {
    console.log('constructor', data);
    // console.log(data);

    this.mainData = data;
    this.client_id = Date.now();
    let that = this;
    this.ws = new WebSocket(`ws://localhost:8000/ws/${this.client_id}`);
    this.ws.onmessage = function(event) {
      if(event.data.indexOf('democrats') > 0){
        that.mainData.changeFishEntry(JSON.parse(event.data));
      } else {
        that.mainData.changeMessage(JSON.parse(event.data));
      }
    };
  }

  // constructor() { }

  onNewTagEntry(newEntry): void{
    console.log('newEntry: ', newEntry);
    if(newEntry != '') {

      // {'democrats': ['1'], 'republican': ['2'], 'timestamp': '0.24', 'direction': 'to'}
      // ["'democrats'", " ['1', '2', '3'], 'republican'", " ['4'], 't

      const temp = newEntry.replace('{','').replace('}','').split(":");
      const t_demo = temp[1].split("],")[0].trim().replace('[','').split(',');
      const demoArr = [];
      let index;
      for(index = 0; index < t_demo.length; index++){
        demoArr.push(t_demo[index].replaceAll('\'',''));
      }

      const r_demo = temp[2].split("],")[0].trim().replace('[','').split(',');
      const repubArr = [];
      for(index = 0; index < r_demo.length; index++){
        repubArr.push(r_demo[index].replaceAll('\'',''));
      }

      const timestamp = temp[3].split(",")[0].replaceAll('\'','').trim()
      const direction = temp[4].split(",")[0].replaceAll('\'','').trim()

      const thisEntry = {
        democrats: demoArr,
        republican: repubArr,
        timestamp,
        direction
      };

      this.all_tag_entries_topics.push(thisEntry);
      this.drawFishDiagram(this.all_tag_entries_topics);
    }
  }


  ngOnInit(): void {
    this.all_tag_entries_topics = [];
    console.log("subscribing");
    this.data.currentFishMessage.subscribe(message => this.onNewTagEntry(message));
    console.log("subscribed");
  }

  drawFishDiagram(all_tag_entries_topics): void {
    document.getElementById("mydiv").innerHTML = "";
    console.log("hello");
    var margin = {top: 0, right: 20, bottom: 0, left: 130},
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
      console.log("preparing data", this.all_tag_entries_topics[index]);
      var democrats = this.all_tag_entries_topics[index].democrats;
      var republican = this.all_tag_entries_topics[index].republican;
      var direction = this.all_tag_entries_topics[index].direction;
      var time = this.all_tag_entries_topics[index].timestamp;
      let i: any;
      let j: any;
      var previousTime = time;
      for(i=0; i< democrats.length; i++){
        for(j=0; j<republican.length; j++){
          var temp_entry = [];
          if(time == previousTime){
            time = parseFloat(time) + 2;
          }
          if("to" == direction){
            temp_entry = [time
              , Utilities.getDebaterRecordById(democrats[i]).name
              , Utilities.getDebaterRecordById(republican[j]).name];
            console.log("ppp", temp_entry);
            data.push(temp_entry);
          }else{
            temp_entry = [time
              , Utilities.getDebaterRecordById(republican[j]).name
              , Utilities.getDebaterRecordById(democrats[i]).name];
            console.log("ppp", temp_entry);
            data.push(temp_entry);
          }
          previousTime = time;
        }
      }

    }

    // var people = ["Bernie","Elizabeth", "Trump", "Obama", "Kamala"];

    // var colors = ["red", "yellow", "green", "blue", "purple"];


    console.log("people",people);
    console.log(colors);
    console.log("xxxx");
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
      // .style("color", "white")
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    console.log("svg: ", svg);

    //     var data = [
    // [0,"Bernie", "Elizabeth"],
    // [10,"Elizabeth", "Trump"],
    // [20,"Bernie", "Trump"],
    // [30,"Trump", "Bernie"],
    // [40, "Kamala", "Bernie"],
    // [5,"Bernie", "Elizabeth"],
    // [15,"Elizabeth", "Trump"],
    // [25,"Bernie", "Trump"],
    // [35,"Trump", "Bernie"],
    // [33, "Kamala", "Bernie"],
    // [45, "Kamala", "Bernie"]];
    console.log(data);
    var data2 = []
    //   if (error) throw error;

    // format the data
    data.forEach(function(d) {
      data2.push({time:d[0], attacker:d[1], victim: d[2]})
      // console.log(data2)
      // d.sales = +d.sales;
    });
    data = data2
    console.log("data is: ", data);
    console.log(data);

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
      .attr("markerWidth", 15)
      .attr("markerHeight", 15)
      .attr("markerUnits","userSpaceOnUse")
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M 0 0 12 6 0 12 3 6")
      .style("fill", "white");
    // path
    // svg.append("path")
    //       .attr("marker-end", "url(#triangle)")
    //       .attr("d", "M10 80 C 40 10, 65 10, 95 80 S 150 150, 180 80")
    //       .attr("stroke", "grey")
    //       .attr("stroke-width", "1.5")
    //       .attr("fill", "transparent")
    //       .attr("class", "edges");



    svg.selectAll(".bar")
      .data(data)
      .enter().append("line")
      .attr("class", "bar")
      .attr("color", "grey")
      //   .attr("x", function(d) { return x(d.time); })
      //   .attr("width", 2)
      //   .attr("y", function(d) { return pady+Math.min(y(d.attacker), y(d.victim)); })
      //   .attr("height", function(d) {
      //       return Math.abs(y(d.attacker) - y(d.victim));
      //     })
      //     .attr("marker-end", "url(#triangle)");

      .attr("x1", function(d) {
        console.log(d);
        console.log(d.time);
        return x(d.time);
      })
      .attr("y1", function(d) { return pady+y(d.attacker)})
      .attr("x2", function(d) { return x(d.time); })
      .attr("y2", function(d) { return pady+y(d.victim)})
      .attr("stroke-width", 1)
      .attr("stroke", function(d) {
        console.log(d.attacker);
        console.log(people.indexOf(d.attacker ));
        console.log(colors[people.indexOf(d.attacker)]);
        return myColor(people.indexOf(d.attacker));
      })
      .attr("stroke","white")
      .attr("marker-end", "url(#triangle)");

    svg.selectAll(".bar-axis")
      .data(people)
      .enter().append("rect")
      .attr("class", "bar-axis")
      .attr("x", function(d) { return 0; })
      .attr("width", width)
      .attr("y", function(d) { return pady+y(d)})
      .attr("height", 1)
      .attr("fill", "grey");




    // add the x Axis
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
      .call(d3.axisLeft(y));


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
