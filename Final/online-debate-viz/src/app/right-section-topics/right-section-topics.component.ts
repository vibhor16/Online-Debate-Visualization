import { Component, OnInit } from '@angular/core';
import * as d3timeline from 'd3-timeline';
// import * as d3 from 'd3';
// import * as d3 from 'd3-selection';
// import * as d3Scale from 'd3-scale';
// import * as d3Shape from 'd3-shape';
// import * as d3Array from 'd3-array';
// import * as d3Axis from 'd3-axis';


@Component({
  selector: 'app-right-section-topics',
  templateUrl: './right-section-topics.component.html',
  styleUrls: ['./right-section-topics.component.css']
})
export class RightSectionTopicsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // this.timelineLabelColor()
  }

  timelineLabelColor() {
    // debugger;
    var myData = [
      {icon:"guns.png", times: [{"color":"green", "starting_time": 1355752800000, "display_icon":"biden.png"}, {"color":"blue", "starting_time": 1355767900000, "display":"rect"}]},
      {icon:"economic.png", times: [{"color":"pink", "starting_time": 1355759910000, "display_icon":"elizabeth.png"} ]},
      {icon:"immigration.png", times: [{"color":"yellow", "starting_time": 1355761910000, "display_icon":"bernie.png"}, {"color":"blue", "starting_time": 1355767900000, "display_icon":"elizabeth.png"}]}
    ];
    var width = 500;
    // var chart = d3timeline.timeline()
    //   .beginning(1355752800000) // we can optionally add beginning and ending times to speed up rendering a little
    //   .ending(1355774400000)
    //   .stack() // toggles graph stacking
    //   .margin({left:70, right:30, top:0, bottom:0})
    //   ;

    var chart = d3timeline.timeline()
      .relativeTime()
      .tickFormat({
        format: function(d) { return d3timeline.time.format("%H:%M")(d) },
        tickTime: d3timeline.time.minutes,
        tickInterval: 30,
        tickSize: 15,
      });  
    // var svg = d3timeline.select("#timeline6").append("svg").attr("width", width)
    //   .datum(myData).call(chart);
  }

}
