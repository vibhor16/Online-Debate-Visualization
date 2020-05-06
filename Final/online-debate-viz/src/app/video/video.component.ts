import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import { VideoObject } from 'src/app/common-utils.service'


declare var $: any
@Component({
  template: '<youtube-player #videoPlayer (stateChange)=onPlayerStateChange($event) width="100%"></youtube-player>',
  selector: 'app-video',
})
export class VideoComponent implements OnInit {
  @Input() public VideoID;
  @ViewChild('videoPlayer', { static: true }) youtube_player: ElementRef;

  ngOnInit() {
    const tag = document.createElement('script');

    tag.src = "https://www.youtube.com/iframe_api";
    document.body.appendChild(tag);
    console.log("Video ID");
    // @ts-ignore
    console.log("changing id to :"+this.VideoID);
    // @ts-ignore
    this.youtube_player._videoId._value = this.VideoID;
    VideoObject.obj = this.youtube_player;
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
        VideoObject.currentTime = this.youtube_player.getCurrentTime();
    }
  }

  record(str) {
    console.log(str)
  }
}
