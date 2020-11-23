import { Component, OnInit } from '@angular/core';
import {DataService} from '../../common-utils.service';
declare var $: any;

@Component({
  selector: 'app-top-section-cust',
  templateUrl: './top-section-cust.component.html',
  styleUrls: ['./top-section-cust.component.css',
    '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css',
    '../../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class TopSectionCustComponent implements OnInit {
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

  recordTaggerType(){
    this.data.taggerType = $("#tagger_type").val();  
    console.log("AAAAAAAAAAAAAAAAAAAAAAAA");
    console.log(this.data.taggerType);
  }

}
