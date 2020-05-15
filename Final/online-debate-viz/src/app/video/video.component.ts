import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { VideoObject,DataService } from 'src/app/common-utils.service'


declare var $: any;
@Component({
  template: '<youtube-player #videoPlayer (stateChange)=onPlayerStateChange($event) width="100%"></youtube-player>',
  selector: 'app-video',
})
export class VideoComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) youtube_player: ElementRef;
  youtubeVideoURL : any;

  constructor(private data: DataService) {
  }

  ngOnInit() {
    this.data.currentVideo.subscribe(message =>  this.createYoutubePlayer(message));
  }

  createYoutubePlayer(message){

    this.youtubeVideoURL = message;
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);

    VideoObject.obj = this.youtube_player;
    let videoId = this.youtubeVideoURL.split("v=")[1];
    console.log("this.youtubeVideoURL = " + this.youtubeVideoURL);

    if($("iframe").length > 0) {
      $("iframe").attr("src","https://www.youtube.com/embed/"+videoId);
    } else {
      VideoObject.obj._videoId._value =  videoId;
    }

  }

   public onPlayerStateChange(event) {
    switch (event.data) {
      case 0:
        this.record('video ended');
        break;
      case 1:
        // this.record('video playing from ' + );
      case 2:
        // @ts-ignore
        this.record('video paused at ' + this.youtube_player.getCurrentTime());
        // @ts-ignore
    }
  }

  record(str) {
    console.log(str)
  }
}
