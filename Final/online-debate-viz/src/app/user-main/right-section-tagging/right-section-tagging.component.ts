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
  ws: WebSocket;
  interactionSummaryMatrix: any[];
  interactionSummaryEntries: any[];
  rankEvolutionEntries: any[];
  globalEloRanks:any;
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
    this.interactionSummaryMatrix = [];
    this.rankEvolutionEntries = [];
    this.globalEloRanks = [];
  }

  ngOnInit(): void {
    this.topics = Utilities.topics;
    const debaters = GET_DEBATERS_JSON();
    this.democrats = debaters['democrats'];
    this.republicans = debaters['republicans'];

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

    // $('.tag_direction').on('click', () => {
    //
    //   const direction = this.getAttackDirection();
    //   if (direction == 'from'){
    //     $('#tag_direction_left').hide();
    //     $('#tag_direction_right').show();
    //   } else {
    //     $('#tag_direction_right').hide();
    //     $('#tag_direction_left').show();
    //   }
    //
    // });

    // Initialize interaction summary and rank evolution
    this.initIntSummAndRankEvol(debaters);
  }

//
// (10) [{…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}, {…}]
// 0: {Amy: -1, Cory: 0, Pete: 1, Bernie: 0, Joseph: 0, …}
// 1: {Amy: 0, Cory: -1, Pete: 0, Bernie: 0, Joseph: 0, …}
// 2: {Amy: 0, Cory: 0, Pete: -1, Bernie: 0, Joseph: 0, …}
// 3: {Amy: 0, Cory: 0, Pete: 0, Bernie: -1, Joseph: 0, …}
// 4: {Amy: 0, Cory: 0, Pete: 0, Bernie: 0, Joseph: -1, …}
// 5: {Amy: 0, Cory: 0, Pete: 0, Bernie: 0, Joseph: 0, …}
// 6: {Amy: 0, Cory: 0, Pete: 0, Bernie: 0, Joseph: 0, …}
// 7: {Amy: 0, Cory: 0, Pete: 0, Bernie: 0, Joseph: 0, …}
// 8: {Amy: 0, Cory: 0, Pete: 0, Bernie: 0, Joseph: 0, …}
// 9: {Amy: 0, Cory: 0, Pete: 0, Bernie: 0, Joseph: 0, …}


  initIntSummAndRankEvol(debaters): void{
    let allMembers = [];
    let intSumObject = [];
    for(let id in debaters.democrats){
      let tmp = {};
      allMembers.push(debaters.democrats[id].name);
      for(let id2 in debaters.democrats){
        let name = debaters.democrats[id2].name.split(' ')[0];
        if(id == id2)
          tmp[name] = -1;
        else
          tmp[name] = 0;
      }
      intSumObject.push(tmp);
    }

    let rankEvolObj = [];
    for(let id in allMembers) {
      // take first name as key
      let member = allMembers[id];
      let tmp = {
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
    console.log(intSumObject);
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
    let allMembers = [];

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


      // Interaction summary object

      if(this.interactionSummaryMatrix.length == 0){
        for(let id in allMembers) {
          let tmp = [];
          for(let i=0; i<allMembers.length;i++){
            tmp.push(0);
          }
          tmp[id] = -1;
          this.interactionSummaryMatrix.push(tmp);
        }
      }
      for(let dId in democrats){
          for(let rId in republicans){
            if(democrats[dId] != republicans[rId])
              this.interactionSummaryMatrix[parseInt(democrats[dId])-1][parseInt(republicans[rId])-1] += 1;
          }
        }

      this.interactionSummaryEntries = [];
      for(let id in allMembers){
        let temp = {};
        let attacker = allMembers[id].split(' ')[0];
        temp[""] = attacker;
        for(let id2 in allMembers) {
          let recipient = allMembers[id2].split(' ')[0];
          if(attacker == recipient){
            temp[recipient] = -1;
          } else {
            temp[recipient] = this.interactionSummaryMatrix[id][id2];
          }
        }
        this.interactionSummaryEntries.push(temp);
      }

      // Rank Evolution object

      // Initialise the rank evolution object
      if(this.rankEvolutionEntries.length == 0){
        for(let id in allMembers) {
          // take first name as key
          let member = allMembers[id];
          let tmp = {
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
      let thisAttack = [];
      for(let dId in democrats) {
        for (let rId in republicans) {
          if(democrats[dId] != republicans[rId]){
            let tmp = {};
            let attacker = allMembers[parseInt(democrats[dId])-1];
            let victim = allMembers[parseInt(republicans[rId])-1];
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
      // Beto O'Rourke: 1000
      // Cory Booker: 1000
      // Elizabeth Warren: 1000
      // Joseph R. Biden: 1000
      // Julián Castro: 1000
      // Kamala Harris: 1000
      // Pete Buttigieg: 950

      let eloRanks = [{}];
      if(this.globalEloRanks.length == 0){
        allMembers.forEach(function(d) {
          eloRanks[0][d] = 1000;
        });
        this.globalEloRanks  = eloRanks;
      } else {
        eloRanks = this.globalEloRanks;
      }
     let newEloRanks =  this.computeEloRanks(thisAttack, allMembers, eloRanks);
      this.globalEloRanks = newEloRanks;
     for(let id in allMembers){
       let name = allMembers[id];
       for(let id2 in this.rankEvolutionEntries){
         // Get that record
         if(this.rankEvolutionEntries[id2].name === name){

           this.rankEvolutionEntries[id2]['values']
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


      this.ws.send(JSON.stringify(entry));
      this.ws.send(JSON.stringify(fishEntry));
    }
  }

  computeEloRanks(props, participants, eloRanks) {
    if(props.length > 0 ) {
      var const_K = 100;



      for(var i=0; i < props.length; i++) {
        var d = props[i];
        var x = JSON.parse(JSON.stringify(eloRanks[eloRanks.length-1]));
        var newElos = this.computeEloScore(x[d.Attacker], x[d.Victim], const_K);
        x[d.Attacker] = newElos.win;
        x[d.Victim] = newElos.lose;
        eloRanks[0] = x;
      }
      return eloRanks;
    }
  }

  computeEloScore(eloW, eloL, k) {
    var eloDiff = Math.abs(eloW - eloL) //Elo Winner - Loser
    var zScore = eloDiff/(200*Math.sqrt(2));
    var pWin = this.pnorm(zScore);

    var newEloW = 0;
    var newEloL = 0;

    if(eloW > eloL) {
      //Higher Rated Wins
      newEloW = eloW + (1-pWin)*k;
      newEloL = eloL - (1-pWin)*k;
    }
    else {
      //Lower Rated Wins
      newEloW = eloW + pWin*k;
      newEloL = eloL - pWin*k;
    }
    return {win: newEloW, lose: newEloL};
  }

  pnorm(z) {
    // Algorithm AS66 Applied Statistics (1973) vol22 no.3
    // Computes P(Z<z)
    z = parseFloat(z);
    var upper = false;
    var ltone = 7.0;
    var utzero = 18.66;
    var con = 1.28;
    var a1 = 0.398942280444;
    var a2 = 0.399903438504;
    var a3 = 5.75885480458;
    var a4 = 29.8213557808;
    var a5 = 2.62433121679;
    var a6 = 48.6959930692;
    var a7 = 5.92885724438;
    var b1 = 0.398942280385;
    var b2 = 3.8052e-8;
    var b3 = 1.00000615302;
    var b4 = 3.98064794e-4;
    var b5 = 1.986153813664;
    var b6 = 0.151679116635;
    var b7 = 5.29330324926;
    var b8 = 4.8385912808;
    var b9 = 15.1508972451;
    var b10 = 0.742380924027;
    var b11 = 30.789933034;
    var b12 = 3.99019417011;

    var alnorm = 0;
    if(z < 0) {
      upper = !upper;
      z = -z;
    }

    if(z<=ltone || upper && z<=utzero) {
      var y = 0.5*z*z;
      if(z>con) {
        alnorm=b1*Math.exp(-y)/(z-b2+b3/(z+b4+b5/(z-b6+b7/(z+b8-b9/(z+b10+b11/(z+b12))))));
      }
      else {
        alnorm=0.5-z*(a1-a2*y/(y+a3-a4/(y+a5+a6/(y+a7))));
      }
    }
    else {
      alnorm=0;
    }
    if(!upper) alnorm=1-alnorm;
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

    $('#side_center label').css('background', '#19569f')
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
