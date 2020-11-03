import { Component, OnInit } from '@angular/core';
import { VideoObject, DataService } from 'src/app/common-utils.service';
declare var $: any;

@Component({
  selector: 'app-top-section',
  templateUrl: './top-section.component.html',
  styleUrls: ['./top-section.component.css',
    '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css',
  '../../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class TopSectionComponent implements OnInit {

  constructor(private data: DataService) { }
  youtubeVideoURL: any;

  ngOnInit(): void {
    this.data.currentVideo.subscribe( message => this.youtubeVideoURL = message);
    $("#input_video_url").val(this.youtubeVideoURL);
  }

  clearSearchBox() {
    $("#input_video_url").val('');
  }

  playYoutubeVide(event) {
    if(event.which == 13) {
      let videoURL = $("#input_video_url").val();
      this.data.changeVideoURL(videoURL);
    }

    // let videoId = videoURL.split("v=")[1];
    // let newURL = "https://www.youtube.com/embed/" + videoId;
    // $("iframe").attr("src", newURL);
  }
}


