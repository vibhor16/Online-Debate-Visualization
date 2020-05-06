import { Component, OnInit } from '@angular/core';
import { GET_DEBATERS_JSON, VideoObject } from 'src/app/common-utils.service';

declare var $: any;

@Component({
  selector: 'app-right-section-tagging',
  templateUrl: './right-section-tagging.component.html',
  styleUrls: ['./right-section-tagging.component.css',
    '../../../node_modules/@fortawesome/fontawesome-free/css/all.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class RightSectionTaggingComponent implements OnInit {
  playerElem: any;
  democrats: any[];
  republicans: any[];
  constructor() { }

  ngOnInit(): void {
    let debaters = GET_DEBATERS_JSON();
    this.democrats = debaters["democrats"];
    this.republicans = debaters["republicans"];

    $("#tag_direction_left").hide();

    $('#tag_btn').on('click', () => {
      this.perform_tag();
    });

    $('#save_btn').on('click', () => {
      this.addToTaggedEntriesObject();
    });

    $('.tag_direction').on('click', () => {

      let direction = this.getAttackDirection();
      if(direction == "from"){
        $("#tag_direction_left").hide();
        $("#tag_direction_right").show();
      } else {
        $("#tag_direction_right").hide();
        $("#tag_direction_left").show();
      }

    });
  }

  getAttackDirection(): string {
    let direction = "to";
    if ($("#tag_direction_left").is(":visible")) {
      direction = "from";
    }
    return direction;
  }
  perform_tag(): void {
    this.playerElem = VideoObject.obj;
    this.playerElem.pauseVideo();
    let time = this.playerElem.getCurrentTime().toFixed(2);
    if(time != 0.00)
    $("#tag_time").html("<b>"+this.secondsToMs(VideoObject.currentTime)+"</b>");
  }

  addToTaggedEntriesObject(): void{
    let entry = {};
    let democrats = [];
    $('.democrats-check:checkbox:checked').each(function() {
      democrats.push($(this).attr('id'));
    });

    let republicans = [];
    $('.republican-check:checkbox:checked').each(function() {
      republicans.push($(this).attr('id'));
    });

    entry['democrats'] = democrats;
    entry['republican'] = republicans;
    entry['timestamp'] = VideoObject.currentTime;
    entry['direction'] = this.getAttackDirection();

    if(democrats.length == 0)
      alert("Please select at least 1 democrat!")

    else if(republicans.length == 0)
      alert("Please select at least 1 republican!")

    else if(VideoObject.currentTime == null)
      alert("Press Tag button before tagging!");
    debugger;
    // VideoObject.taggedEntriesObject.push(entry);
  }

  // var myData = [
  //   {icon:"guns.png", times: [{"color":"green", "starting_time": 1355752800000, "display":"biden.png"}, {"color":"blue", "starting_time": 1355767900000, "display":"elizabeth.png"}]},
  //   {icon:"economic.png", times: [{"color":"pink", "starting_time": 1355759910000, "display":"elizabeth.png"} ]},
  //   {icon:"immigration.png", times: [{"color":"yellow", "starting_time": 1355761910000, "display":"bernie.png"}, {"color":"blue", "starting_time": 1355767900000, "display":"elizabeth.png"}]}
  // ];

  secondsToMs(d) {
    d = Number(d);
    let h;
    let m;
    let s;

    h = Math.floor(d / 3600);
    m = Math.floor(d % 3600 / 60);
    s = Math.floor(d % 3600 % 60);

    if (m < 10) {
      m = "0" + m;
    }
    if (s < 10) {
      s = "0" + s;
    }
    var min = m + ":";
    return min + s;
  }


  highlightDebaterPic(party, pic_id) {
    party += "_";
    $("#left_"+ party + pic_id).toggleClass("red");
  }
}
