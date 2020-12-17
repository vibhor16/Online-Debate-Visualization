import { BehaviorSubject } from 'rxjs';
import {Injectable} from '@angular/core';
declare var $: any;

export function GET_DEBATERS_JSON() {

  var democrats = [];
  var republicans = [];
  var results = {};

  var debaters = Utilities.debatersList;

  var index = 0;
  for(;index < debaters.profiles.length; index++){
    var field = debaters.profiles[index];
    if(field.party == "democratic")
      democrats.push(field);
    else
      republicans.push(field);
  }

  results["democrats"] = democrats;
  results["republicans"] = republicans;
  return results;
}

export class VideoObject {
  static obj: any;
  static currentTime: any;
  static DUMMY_URL = "https://www.youtube.com/watch?v=F_TYe2wdaGg";
}

export class Utilities {
  static topics = [
    // {name:"Cybersecurity", icon:"fa fa-lock", img:'https://img.icons8.com/color/48/000000/user-credentials.png'},
    {name:"Economy", icon:"fa fa-dollar-sign", img:'https://img.icons8.com/color/48/000000/money-bag.png'},
    {name:"Education", icon:"fa fa-book", img:'https://img.icons8.com/color/48/000000/book.png'},
    {name:"Elections", icon:"fa fa-person-booth", img:'https://img.icons8.com/color/48/000000/elections.png'},
    {name:"Food", icon:"fa fa-hamburger", img:'https://img.icons8.com/color/48/000000/food.png'},
    // {name:"Gun Control", icon:"fa fa-fighter-jet", img:'https://img.icons8.com/color/48/000000/space-fighter.png'},
    {name:"Healthcare", icon:"fa fa-file-medical", img:'https://img.icons8.com/color/48/000000/medical-doctor.png'},
    {name:"Immigration", icon:"fa fa-user-friends", img:'https://img.icons8.com/color/48/000000/customs-officer.png'},
    // {name:"Infrastructure", icon:"fa fa-building", img:'https://img.icons8.com/color/48/000000/rope-bridge.png'},
    {name:"Military", icon:"fa fa-meteor", img:'https://img.icons8.com/color/48/000000/wwi-german-helmet.png'},
    {name:"Taxes", icon:"fa fa-passport", img:'https://img.icons8.com/color/48/000000/refund-2--v1.png'}
  ];

  static topicNames = [
    // "Cybersecurity",
    "Economy",
    "Education",
    "Elections",
    "Food",
    // "Gun Control",
    "Healthcare",
    "Immigration",
    // "Infrastructure",
    "Military",
    "Taxes"
  ];

  static getRecordByName(name){
    let index;
    for (index=0;index < Utilities.topics.length; index++){
      if(Utilities.topics[index].name == name){
        return Utilities.topics[index];
      }
    }
  }

  static  getDebaterRecordByName(name){
    let index;
    for (index=0;index < Utilities.debatersList.profiles.length; index++){
      if(Utilities.debatersList.profiles[index].name == name){
        return Utilities.debatersList.profiles[index];
      }
    }
  }

  static  getDebaterRecordById(id){
    let index;
    for (index=0;index < Utilities.debatersList.profiles.length; index++){
      if(Utilities.debatersList.profiles[index].id == id){
        return Utilities.debatersList.profiles[index];
      }
    }
  }

  static debatersList = {
    "profiles": [
      {
        "id": 1,
        "name": "Amy Klobuchar",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/klobucha.png",
        "party": "democratic"
      },
      {
        "id": 2,
        "name": "Cory Booker",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/booker.png",
        "party": "democratic"
      },
      {
        "id": 3,
        "name": "Pete Buttigieg",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/buttigieg.png",
        "party": "democratic"
      },
      {
        "id": 4,
        "name": "Bernie Sanders",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/sanders.png",
        "party": "democratic"
      },
      {
        "id": 5,
        "name": "Joseph Biden",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/biden.png",
        "party": "democratic"
      },
      {
        "id": 6,
        "name": "Elizabeth",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/warren.png",
        "party": "democratic"
      },
      {
        "id": 7,
        "name": "Kamala Harris",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/harris.png",
        "party": "democratic"
      },
      {
        "id": 8,
        "name": "Andrew Yang",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/yang.png",
        "party": "democratic"
      },
      {
        "id": 9,
        "name": "Beto",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/orourke.png",
        "party": "democratic"
      },
      {
        "id": 10,
        "name": "Julián Castro",
        "pic": "https://static01.nyt.com/newsgraphics/2019/08/17/dnc-candidate-announcement-2/c86a7c0d5d477f0a14b1eb7b7c64cdd04297cf51/castro.png",
        "party": "democratic"
      },
      {
        "id": 11,
        "name": "Mike Bloomberg",
        "pic": "https://static01.nyt.com/newsgraphics/2020/01/06/candidate-videos-vi/58b5fcfb508762d11fb31d5c9920af4e88ea503d/bloomberg.png",
        "party": "democratic"
      }
    ]
  };

}

@Injectable()
export class DataService {

  private messageSource = new BehaviorSubject('');
  currentMessage = this.messageSource.asObservable();

  private fishSource = new BehaviorSubject('');
  currentFishMessage = this.fishSource.asObservable();


  private videoMsgSource = new BehaviorSubject('https://www.youtube.com/watch?v=JKj4ziW6Euo');
  currentVideo = this.videoMsgSource.asObservable();

  private defaultIntSumm = this.initializeIntSummaryObj();
  private intSummSource = new BehaviorSubject(this.defaultIntSumm);
  currentIntSummMessage = this.intSummSource.asObservable();

  private defaultRankEvol = this.initializeRankEvolObj();
  private intRankEvolSource = new BehaviorSubject(this.defaultRankEvol);
  currentRankEvolMessage = this.intRankEvolSource.asObservable();

  taggerType = "neutral";
  taggerID = "default-tagger";

  constructor() {
  }

  changeMessage(tag_entry: any, tagger_type : any) {
    if(this.taggerType == tagger_type){
      this.messageSource.next(tag_entry);
    }
  }

  changeVideoURL(newURL: any){
    this.videoMsgSource.next(newURL);
  }

  changeFishEntry(new_fish_entry : any, tagger_type : any){
    if(this.taggerType == tagger_type){
      this.fishSource.next(new_fish_entry);
    }
  }

  changeInteractionSummaryEntry(new_int_summary: any){
    this.intSummSource.next(new_int_summary);
  }

  changeRankEvolutionEntry(new_rank_evol: any){
    this.intRankEvolSource.next(new_rank_evol);
  }

  initializeIntSummaryObj() {
    return '';
  }

  initializeRankEvolObj() {
    return '';
  }

}
