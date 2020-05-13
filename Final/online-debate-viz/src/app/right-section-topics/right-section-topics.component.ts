import { Component, OnInit } from '@angular/core';
import {  Utilities, DataService } from 'src/app/common-utils.service';


declare var $: any;
declare var d3: any;
@Component({
  selector: 'app-right-section-topics',
  templateUrl: './right-section-topics.component.html',
  styleUrls: ['./right-section-topics.component.css']
})
export class RightSectionTopicsComponent implements OnInit {

  all_tag_entries_topics: any[];
  myData: any[];

  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.all_tag_entries_topics = [];
    this.myData = [{
      icon: '../../assets/images/empty_profile.png',
      times: [
        {
          'color': 'green',
          'starting_time': 1355752800000,
          'ending_time': 1355759900000,
          'display_icon': '../../assets/images/empty_profile.png'
        }
      ]
    },
      {
        icon: '../../assets/images/empty_profile.png',
        times: [{
          'color': 'pink',
          'starting_time': 1355759910000,
          'ending_time': 1355761900000,
          'display_icon': '../../assets/images/empty_profile.png'
        }]
      },
      {
        icon: '../../assets/images/empty_profile.png',
        times: [{
          'color': 'yellow',
          'starting_time': 1355761910000,
          'ending_time': 1355763910000,
          'display_icon': 'https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/klobucha.png'
        }]
      }
    ];
    this.data.currentMessage.subscribe(message => this.onNewTagEntry(message));

  }

  onNewTagEntry(newEntry): void{
    if(newEntry != '') {

      this.all_tag_entries_topics.push(newEntry);
      this.myData.push(newEntry);
      this.D3TimelineFunctions(this.myData);
    }
  }

  D3TimelineFunctions(myData): void{
    d3.selectAll("svg > *").remove();
    var width = 500;
    function timelineLabelColor() {

      var chart = d3.timeline()
        .relativeTime()
        .stack()
        .margin({left:70, right:30, top:0, bottom:0})
        .tickFormat({
          format: function(d) { return d3.time.format("%H:%M:%S")(d) },
          tickTime: d3.time.minutes,
          tickInterval: 30,
          tickSize: 10 ,
        });
      var svg = d3.select("svg").attr("width", width)
        .datum(myData).call(chart);
    }
    timelineLabelColor();
  }
}
