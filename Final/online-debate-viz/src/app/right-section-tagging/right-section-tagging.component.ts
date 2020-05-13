import { Component, OnInit } from '@angular/core';
import { GET_DEBATERS_JSON, VideoObject, Utilities, DataService } from 'src/app/common-utils.service';

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
  topics: any;
  topicSelected: string;
  constructor(private data: DataService) { }

  ngOnInit(): void {
    this.topics = Utilities.topics;
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



    if(democrats.length == 0)
      alert("Please select at least 1 democrat!");

    else if(republicans.length == 0)
      alert("Please select at least 1 republican!");

    else if(VideoObject.currentTime == null)
      alert("Press Tag button before tagging!");

    else if(this.topicSelected == null)
      alert("Select a topic from the list!")
    else {
      entry['democrats'] = democrats;
      entry['republican'] = republicans;
      entry['timestamp'] = VideoObject.currentTime;
      entry['direction'] = this.getAttackDirection();

      let time = new Date(VideoObject.currentTime * parseInt('1000'));
      console.log("time youtube = "+time);

      let startingTime = new Date(2020,5,5,time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());
      time = new Date(VideoObject.currentTime  * parseInt('1000') + parseInt('2000'));
      let endingTime = new Date(2020,5,5,time.getHours(), time.getMinutes(), time.getSeconds(), time.getMilliseconds());

      let topicRecord = Utilities.getRecordByName(this.topicSelected);
      let debaterRecord = Utilities.getDebaterRecordByName(democrats[0]);


      entry = [topicRecord.name, debaterRecord.name, startingTime, endingTime];
      this.data.changeMessage(entry);
    }
  }

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

  changeTopic(value) {
    this.topicSelected = value;
  }
}
