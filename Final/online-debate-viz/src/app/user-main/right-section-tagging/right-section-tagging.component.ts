import { Component, OnInit } from '@angular/core';
import { ElementFinder } from 'protractor';
import { GET_DEBATERS_JSON, VideoObject, Utilities, DataService } from 'src/app/common-utils.service';

declare var $: any;

@Component({
  selector: 'app-right-section-tagging',
  templateUrl: './right-section-tagging.component.html',
  styleUrls: ['./right-section-tagging.component.css',
    '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css',
    '../../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class RightSectionTaggingComponent implements OnInit {
  playerElem: any;
  democrats: any[];
  republicans: any[];
  topics: any;
  topicSelected: string;
  // tslint:disable-next-line:variable-name
  client_id: any;
  wsNeutral: WebSocket;
  wsDemocrat: WebSocket;
  wsRepublican: WebSocket;
  constructor(private data: DataService) {

    this.client_id = Date.now();
    this.wsNeutral = new WebSocket(`ws://localhost:8000/ws/neutral`);
    this.wsDemocrat = new WebSocket(`ws://localhost:8000/ws/democrat`);
    this.wsRepublican = new WebSocket(`ws://localhost:8000/ws/republican`);
    this.wsNeutral.onmessage = function(event) {
    };
    this.wsDemocrat.onmessage = function(event) {
    };
    this.wsRepublican.onmessage = function(event) {
    };

  }

  ngOnInit(): void {
    this.topics = Utilities.topics;
    const debaters = GET_DEBATERS_JSON();
    this.democrats = debaters['democrats'];
    this.republicans = debaters['republicans'];

    $('#play_btn').prop('disabled', false);
    $('#pause_btn').prop('disabled', true);
    this.disableTaggingSection(true);

    $('#tag_direction_left').hide();

    $('#play_btn').on('click', () => {
      // $('#left').css('visibility', 'hidden');
      this.playVideo();
    });
    $('#pause_btn').on('click', () => {
      // $('#left').css('visibility', 'visible');
      this.pauseVideo();
    });

    $('#save_btn').on('click', () => {
      this.addToTaggedEntriesObject();
    });

    $('.tag_direction').on('click', () => {

      const direction = this.getAttackDirection();
      if (direction == 'from'){
        $('#tag_direction_left').hide();
        $('#tag_direction_right').show();
      } else {
        $('#tag_direction_right').hide();
        $('#tag_direction_left').show();
      }

    });
  }

  getAttackDirection(): string {
    let direction = 'to';
    if ($('#tag_direction_left').is(':visible')) {
      direction = 'from';
    }
    return direction;
  }

  playVideo(): void {
    this.playerElem = VideoObject.obj;
    this.playerElem.playVideo();
    $('#play_btn').prop('disabled', true);
    $('#pause_btn').prop('disabled', false);
    this.disableTaggingSection(true);
    this.resetTaggingElements();
  }

  pauseVideo(): void{
    this.playerElem = VideoObject.obj;
    this.playerElem.pauseVideo();
    const time = this.playerElem.getCurrentTime().toFixed(2);
    VideoObject.currentTime = time;
    if (time != 0.00) {
      $('#tag_time').html('<b>' + this.secondsToMs(time) + '</b>');
    }
    $('#play_btn').prop('disabled', false);
    $('#pause_btn').prop('disabled', true);
    this.disableTaggingSection(false);

  }

  addToTaggedEntriesObject(): void{
    let entry = {};
    const democrats = [];
    const fishEntry = {};
    $('.democrats-check').each(function() {
      if ($(this).hasClass('selectDemocrat')) {
        const id = $(this).attr('id').split('_')[2];
        democrats.push(id);
      }
    });

    const republicans = [];
    $('.republican-check').each(function() {
      if ($(this).hasClass('selectRepublican')) {
        const id = $(this).attr('id').split('_')[2];
        republicans.push(id);
      }
    });



    if (democrats.length == 0) {
      alert('Please select at least 1 democrat!');
    }

    else if (republicans.length == 0) {
      alert('Please select at least 1 republican!');
 }

    else if (VideoObject.currentTime == null) {
      alert('Press Tag button before tagging!');
 }

    else if (this.topicSelected == null) {
      console.log('ok');
 }
      // alert("Select a topic from the list!");
    else {
      fishEntry['democrats'] = democrats;
      fishEntry['republican'] = republicans;
      fishEntry['timestamp'] = VideoObject.currentTime;
      fishEntry['direction'] = this.getAttackDirection();
      fishEntry['category'] = this.data.taggerType;

      let time = new Date(this.playerElem.getCurrentTime() * parseInt('1000'));
      console.log('time youtube = ' + time);

      const startingTime = new Date(0, 0, 0, time.getHours(), time.getMinutes(), time.getSeconds());
      time = new Date(this.playerElem.getCurrentTime()  * parseInt('1000') + parseInt('2000'));
      const endingTime = new Date(0, 0, 0, time.getHours(), time.getMinutes(), time.getSeconds());

      const topicRecord = Utilities.getRecordByName(this.topicSelected);
      const debaterRecord = Utilities.getDebaterRecordById(democrats[0]);


      // entry = [topicRecord.name, debaterRecord.name, startingTime, endingTime];
      const seconds1 = Number(this.playerElem.getCurrentTime());
      const seconds2 = Number(this.playerElem.getCurrentTime()) + 2;

      const tooltip = '<p style="text-align: center">' + debaterRecord.name + '<br/>' + this.secondsToMs(this.playerElem.getCurrentTime()) + '</p>';

      const startTime = new Date(0, 0, 0,  Math.floor(seconds1 / 3600), Math.floor(seconds1 % 3600 / 60), Math.floor(seconds1 % 3600 % 60));
      const endTime = new Date(0, 0, 0,  Math.floor(seconds1 / 3600),  Math.floor(seconds2 % 3600 / 60), Math.floor(seconds2 % 3600 % 60));


      entry = [
        topicRecord.name,
        debaterRecord.name,
        tooltip,
        startTime,
        endTime
      ];

      // debugger;
      this.data.changeMessage(entry, this.data.taggerType);
      this.data.changeFishEntry(fishEntry, this.data.taggerType);

      if ("democrat" == this.data.taggerType){
        this.wsDemocrat.send(JSON.stringify(entry));
        this.wsDemocrat.send(JSON.stringify(fishEntry));  
      }else if("republican" == this.data.taggerType){
        this.wsRepublican.send(JSON.stringify(entry));
        this.wsRepublican.send(JSON.stringify(fishEntry));  
      }else{
        this.wsNeutral.send(JSON.stringify(entry));
        this.wsNeutral.send(JSON.stringify(fishEntry));  
      }
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
      m = '0' + m;
    }
    if (s < 10) {
      s = '0' + s;
    }
    const min = m + ':';
    return min + s;
  }


  highlightDebaterPic(party, pic_id) {
    party += '_';
    $('#left_' + party + pic_id).toggleClass('blue');
  }

  changeTopic(value) {
    this.topicSelected = value;
  }

  selectRepublican(el) {
    const target = '#' + el.target.id.split('_')[1];

    if ($(target).prop('checked')){
      $(target).prop('checked', false);
    } else {
      $(target).prop('checked', true);
    }
    $('#' + el.target.id).toggleClass('selectRepublican');
  }

  selectDemocrat(el) {
    const target = '#' + el.target.id.split('_')[1];


    if ($(target).prop('checked')){
      $(target).prop('checked', false);
    } else {
      $(target).prop('checked', true);
    }
    $('#' + el.target.id).toggleClass('selectDemocrat');
  }

  private disableTaggingSection(option) {
    if (option) {
      $('#tagging-overlay').show();
    } else {
      $('#tagging-overlay').hide();
    }
  }

  private resetTaggingElements(){
    $('.democrats-check').each(function() {
      if ($(this).hasClass('selectDemocrat')) {
        $(this).toggleClass('selectDemocrat');
      }
    });

    $('.republican-check').each(function() {
      if ($(this).hasClass('selectRepublican')) {
        $(this).toggleClass('selectRepublican');
      }
    });

    $('#tag_time').html('00:00');
  }
}
