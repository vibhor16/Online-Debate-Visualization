import { Component, HostListener, OnInit } from '@angular/core';
import { ElementFinder } from 'protractor';
import { GET_DEBATERS_JSON, VideoObject, Utilities, DataService } from 'src/app/common-utils.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  ws: WebSocket;
  interactionSummaryMatrix: any[];
  interactionSummaryEntries: any[];
  rankEvolutionEntries: any[];
  globalEloRanks: any;
  entryList: any[];
  fishEntryList: any[];
  baseURL = 'http://127.0.0.1:8000/';

  constructor(private data: DataService, private http: HttpClient) {

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
    this.interactionSummaryMatrix = [];
    this.rankEvolutionEntries = [];
    this.globalEloRanks = [];
    this.entryList = [];
    this.fishEntryList = [];

  }

  saveFile(): void {
    const taggerType = this.data.taggerType;
    let path1 = '';
    let path2 = '';
    let path3 = '';
    let path4 = '';
    if (taggerType === 'democrat') {
       path1 = '/democrat/entryList_'+this.data.taggerID+'.txt';
       path2 = '/democrat/fishEntry_'+this.data.taggerID+'.txt';
       path3 = '/democrat/interaction_'+this.data.taggerID+'.txt';
       path4 = '/democrat/rankEvolution_'+this.data.taggerID+'.txt';
    } else if (taggerType === 'republican') {
      path1 = '/republican/entryList_'+this.data.taggerID+'.txt';
      path2 = '/republican/fishEntry_'+this.data.taggerID+'.txt';
      path3 = '/republican/interaction_'+this.data.taggerID+'.txt';
      path4 = '/republican/rankEvolution_'+this.data.taggerID+'.txt';
    } else {
      path1 = '/neutral/entryList_'+this.data.taggerID+'.txt';
      path2 = '/neutral/fishEntry_'+this.data.taggerID+'.txt';
      path3 = '/neutral/interaction_'+this.data.taggerID+'.txt';
      path4 = '/neutral/rankEvolution_'+this.data.taggerID+'.txt';
    }

    const tp1 =  JSON.stringify(this.entryList);
    this.http.post<any>(this.baseURL + 'saveFile', {data: tp1, path: path1}).subscribe();

    const tp2 =  JSON.stringify(this.fishEntryList);
    this.http.post<any>(this.baseURL + 'saveFile', {data: tp2, path: path2}).subscribe();

    const tp3 =  JSON.stringify(this.interactionSummaryEntries);
    this.http.post<any>(this.baseURL + 'saveFile', {data: tp3, path: path3}).subscribe();

    const tp4 =  JSON.stringify(this.rankEvolutionEntries);
    this.http.post<any>(this.baseURL + 'saveFile', {data: tp4, path: path4}).subscribe();

    const saveSuccess = "Success! Tags are saved as - \n" + path1 + "\n" + path2 + "\n" + path3 + "\n" + path4 + "\n";
    alert(saveSuccess);
  }

  ngOnInit(): void {
    this.topics = Utilities.topics;
    const debaters = GET_DEBATERS_JSON();
    this.democrats = debaters['democrats'];
    this.republicans = debaters['republicans'];

    $('#test_btn').on('click', () => {
      // $('#left').css('visibility', 'hidden');
      this.testBtn();
    });
    $('#play_btn').prop('disabled', false);
    $('#pause_btn').prop('disabled', true);
    this.disableTaggingSection(true);

    // $('#tag_direction_left').hide();

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

    this.initIntSummAndRankEvol(debaters);
  }

  initIntSummAndRankEvol(debaters): void{
    const allMembers = [];
    const intSumObject = [];
    for (const id in debaters.democrats){
      const tmp = {};
      allMembers.push(debaters.democrats[id].name);
      for (const id2 in debaters.democrats){
        const name = debaters.democrats[id2].name.split(' ')[0];
        if (id == id2) {
          tmp[name] = -1;
        }
        else {
          tmp[name] = 0;
        }
      }
      intSumObject.push(tmp);
    }

    const rankEvolObj = [];
    for (const id in allMembers) {
      // take first name as key
      const member = allMembers[id];
      const tmp = {
        name : member,
        values : []
      };
      tmp.values
        .push({
          rank : 1000,
          date2 : 0
        });
      rankEvolObj.push(tmp);
    }
    this.data.changeInteractionSummaryEntry(intSumObject);
    this.data.changeRankEvolutionEntry(rankEvolObj);
  }

  getAttackDirection(): string {
    // let direction = 'to';
    // if ($('#tag_direction_left').is(':visible')) {
    //   direction = 'from';
    // }
    return 'to';
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
    const allMembers = [];

    $('.democrats-check').each(function() {

      // All members got - both list same people
      allMembers.push($(this).html());
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
      alert('topic is null = ' + this.topicSelected);
 }
      // alert("Select a topic from the list!");
    else {
      fishEntry['democrats'] = democrats;
      fishEntry['republican'] = republicans;
      fishEntry['timestamp'] = VideoObject.currentTime;
      fishEntry['direction'] = this.getAttackDirection();
      fishEntry['category'] = this.data.taggerType;

      let time = new Date(this.playerElem.getCurrentTime() * parseInt('1000'));

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



      // Interaction summary object

      if (this.interactionSummaryMatrix.length == 0){
        for (const id in allMembers) {
          const tmp = [];
          for (let i = 0; i < allMembers.length; i++){
            tmp.push(0);
          }
          tmp[id] = -1;
          this.interactionSummaryMatrix.push(tmp);
        }
      }
      for (const dId in democrats){
          for (const rId in republicans){
            if (democrats[dId] != republicans[rId]) {
              this.interactionSummaryMatrix[parseInt(democrats[dId]) - 1][parseInt(republicans[rId]) - 1] += 1;
            }
          }
        }

      this.interactionSummaryEntries = [];
      for (const id in allMembers){
        const temp = {};
        const attacker = allMembers[id].split(' ')[0];
        temp['d'] = attacker;
        for (const id2 in allMembers) {
          const recipient = allMembers[id2].split(' ')[0];
          if (attacker == recipient){
            temp[recipient] = -1;
          } else {
            temp[recipient] = this.interactionSummaryMatrix[id][id2];
          }
        }
        this.interactionSummaryEntries.push(temp);
      }

      // Rank Evolution object

      // Initialise the rank evolution object
      if (this.rankEvolutionEntries.length == 0){
        for (const id in allMembers) {
          // take first name as key
          const member = allMembers[id];
          const tmp = {
            name : member,
            values : []
          };
          tmp.values
            .push({
              rank : 1000,
              date2 : 0
            });
          this.rankEvolutionEntries.push(tmp);
        }
      }
      const thisAttack = [];
      for (const dId in democrats) {
        for (const rId in republicans) {
          if (democrats[dId] != republicans[rId]){
            const tmp = {};
            const attacker = allMembers[parseInt(democrats[dId]) - 1];
            const victim = allMembers[parseInt(republicans[rId]) - 1];
            tmp['Attacker'] = attacker;
            tmp['Victim'] = victim;
            thisAttack.push(tmp);
          }
        }
      }
      // [{…}]
      // 0:
      // Amy Klobuchar: 1050
      // Andrew Yang: 1000
      // Bernie Sanders: 1000
      // Beto: 1000
      // Cory Booker: 1000
      // Elizabeth Warren: 1000
      // Joseph R. Biden: 1000
      // Julián Castro: 1000
      // Kamala Harris: 1000
      // Pete Buttigieg: 950

      let eloRanks = [{}];
      if (this.globalEloRanks.length == 0){
        allMembers.forEach(function(d) {
          eloRanks[0][d] = 1000;
        });
        this.globalEloRanks  = eloRanks;
      } else {
        eloRanks = this.globalEloRanks;
      }
      const newEloRanks =  this.computeEloRanks(thisAttack, allMembers, eloRanks);
      this.globalEloRanks = newEloRanks;
      for (const id in allMembers){
       const name = allMembers[id];
       for (const id2 in this.rankEvolutionEntries){
         // Get that record
         if (this.rankEvolutionEntries[id2].name === name){

           this.rankEvolutionEntries[id2].values
             .push({
             rank : newEloRanks[0][name],
             date2 : parseInt(VideoObject.currentTime)
           });
           break;
         }
       }
     }

      this.data.changeMessage(entry, this.data.taggerType);
      this.data.changeFishEntry(fishEntry, this.data.taggerType);
      this.data.changeInteractionSummaryEntry(this.interactionSummaryEntries);
      this.data.changeRankEvolutionEntry(this.rankEvolutionEntries);

      this.entryList.push(entry);
      this.fishEntryList.push(fishEntry);

    }
  }


  testBtn(): void{
    const that = this;
    $('#play_btn').click();
    this.playerElem.seekTo(VideoObject.currentTime + 10, true);
    setTimeout(function(){
      $('#pause_btn').click();
      $('#tagging-overlay').hide();
      const a = Math.floor(Math.random() * 9) + 1;
      let b = Math.floor(Math.random() * 9) + 1;

      if (a == b){
        b = (b + 1) % 10;
      }

      $('#demo_label_' + a).addClass('selectDemocrat');
      $('#rep_label_' + b).addClass('selectRepublican');
      that.topicSelected = 'Economy';
      $('#save_btn').click();
    }, 1000);

  }

  computeEloRanks(props, participants, eloRanks) {
    if (props.length > 0 ) {
      const const_K = 100;



      for (let i = 0; i < props.length; i++) {
        const d = props[i];
        const x = JSON.parse(JSON.stringify(eloRanks[eloRanks.length - 1]));
        const newElos = this.computeEloScore(x[d.Attacker], x[d.Victim], const_K);
        x[d.Attacker] = newElos.win;
        x[d.Victim] = newElos.lose;
        eloRanks[0] = x;
      }
      return eloRanks;
    }
  }

  computeEloScore(eloW, eloL, k) {
    const eloDiff = Math.abs(eloW - eloL); // Elo Winner - Loser
    const zScore = eloDiff / (200 * Math.sqrt(2));
    const pWin = this.pnorm(zScore);

    let newEloW = 0;
    let newEloL = 0;

    if (eloW > eloL) {
      // Higher Rated Wins
      newEloW = eloW + (1 - pWin) * k;
      newEloL = eloL - (1 - pWin) * k;
    }
    else {
      // Lower Rated Wins
      newEloW = eloW + pWin * k;
      newEloL = eloL - pWin * k;
    }
    return {win: newEloW, lose: newEloL};
  }

  pnorm(z) {
    // Algorithm AS66 Applied Statistics (1973) vol22 no.3
    // Computes P(Z<z)
    z = parseFloat(z);
    let upper = false;
    const ltone = 7.0;
    const utzero = 18.66;
    const con = 1.28;
    const a1 = 0.398942280444;
    const a2 = 0.399903438504;
    const a3 = 5.75885480458;
    const a4 = 29.8213557808;
    const a5 = 2.62433121679;
    const a6 = 48.6959930692;
    const a7 = 5.92885724438;
    const b1 = 0.398942280385;
    const b2 = 3.8052e-8;
    const b3 = 1.00000615302;
    const b4 = 3.98064794e-4;
    const b5 = 1.986153813664;
    const b6 = 0.151679116635;
    const b7 = 5.29330324926;
    const b8 = 4.8385912808;
    const b9 = 15.1508972451;
    const b10 = 0.742380924027;
    const b11 = 30.789933034;
    const b12 = 3.99019417011;

    let alnorm = 0;
    if (z < 0) {
      upper = !upper;
      z = -z;
    }

    if (z <= ltone || upper && z <= utzero) {
      const y = 0.5 * z * z;
      if (z > con) {
        alnorm = b1 * Math.exp(-y) / (z - b2 + b3 / (z + b4 + b5 / (z - b6 + b7 / (z + b8 - b9 / (z + b10 + b11 / (z + b12))))));
      }
      else {
        alnorm = 0.5 - z * (a1 - a2 * y / (y + a3 - a4 / (y + a5 + a6 / (y + a7))));
      }
    }
    else {
      alnorm = 0;
    }
    if (!upper) { alnorm = 1 - alnorm; }
    return(alnorm);
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

  selectTopic(el){

    $('#side_center label').css('background', '#19569f');
    this.topicSelected = el.target.id.split('_')[1];
    $('#' + el.target.id).css('background', 'red');
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
