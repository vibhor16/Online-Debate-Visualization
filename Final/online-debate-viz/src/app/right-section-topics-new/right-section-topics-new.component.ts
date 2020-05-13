import { Component, OnInit } from '@angular/core';
import {GoogleCharts} from 'google-charts';
import {  Utilities, DataService } from 'src/app/common-utils.service';

declare var $: any;
declare var google: any;
@Component({
  selector: 'app-right-section-topics-new',
  templateUrl: './right-section-topics-new.component.html',
  styleUrls: ['./right-section-topics-new.component.css']
})
export class RightSectionTopicsNewComponent implements OnInit {
  all_tag_entries_topics: any[];
  constructor(private data: DataService) { }

  onNewTagEntry(newEntry): void{
    if(newEntry != '') {

      this.all_tag_entries_topics.push(newEntry);
      this.drawTimeline(this.all_tag_entries_topics);
    }
  }

  ngOnInit(): void {
    this.all_tag_entries_topics = [];
    this.data.currentMessage.subscribe(message => this.onNewTagEntry(message));
  }

  drawTimeline(all_entries): void {
    $("#topics-chart").empty();
    GoogleCharts.load(drawChart, {packages:["timeline"]});

    function drawChart() {

      var container = document.getElementById('topics-chart');
      var chart = new google.visualization.Timeline(container);
      var dataTable = new google.visualization.DataTable();
      dataTable.addColumn({ type: 'string', id: 'Position' });
      dataTable.addColumn({ type: 'string', id: 'Name' });
      dataTable.addColumn({ type: 'date', id: 'Start' });
      dataTable.addColumn({ type: 'date', id: 'End' });
      dataTable.addRows(all_entries);


      // dataTable.addRows([
      //   [ 'President', 'George Washington', new Date(1789, 3, 30), new Date(1797, 2, 4) ],
      //   [ 'President', 'John Adams', new Date(1797, 2, 4), new Date(1801, 2, 4) ],
      //   [ 'Secretary of State', 'James Madison', new Date(1801, 4, 2), new Date(1809, 2, 3)]
      // ]);


      chart.draw(dataTable);
      // configureChart();
    }

    function configureChart() {
      var chartContainer = document.getElementById('topics-chart');
      var svg = chartContainer.getElementsByTagName('svg')[0];

      var barLabels = svg.querySelectorAll("text[text-anchor='end']");
      for (var i = 0; i < barLabels.length; i++) {
        if (Utilities.topicNames.includes(barLabels[i].innerHTML)) {
          var index = Utilities.topicNames.indexOf(barLabels[i].innerHTML);
          var barArea = barLabels[i].previousSibling;
          // @ts-ignore
          var x = barArea.getAttribute('x');
          // @ts-ignore
          var y = barArea.getAttribute('y');
          var presidentIcon = createImage({ href: Utilities.topics[index].img, x: x, y: y, width: 30, height: 30 });
          barArea.parentElement.appendChild(presidentIcon);
          // @ts-ignore
          barLabels[i].setAttribute('x', parseFloat(x));

        }
      }
    }


    function createImage(options) {
      var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      image.setAttributeNS(null, 'height', options.height);
      image.setAttributeNS(null, 'width', options.width);
      image.setAttributeNS('http://www.w3.org/1999/xlink', 'href', options.href);
      image.setAttributeNS(null, 'x', options.x);
      // @ts-ignore
      image.setAttributeNS(null, 'y', options.y);
      image.setAttributeNS(null, 'visibility', 'visible');
      return image;
    }
  }





}
