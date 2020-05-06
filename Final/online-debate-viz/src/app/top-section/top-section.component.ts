import { Component, OnInit } from '@angular/core';
import { VideoObject } from 'src/app/common-utils.service';
declare var $: any;

@Component({
  selector: 'app-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.css',
  '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class TopSectionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    $("#input_video_url").val(VideoObject.DUMMY_URL);
  }

}
