import { Component, OnInit, NgModule } from '@angular/core';
import { VideoComponent} from '../video/video.component';

@Component({
  selector: 'app-right-section-video',
  templateUrl: './right-section-video.component.html',
  styleUrls: ['./right-section-video.component.css']
})

export class RightSectionVideoComponent implements OnInit {
  public videoID = "BGy8DdGw_WE";
  constructor() { }

  ngOnInit(): void {

  }
}
