import { Component, OnInit } from '@angular/core';
import {DataService} from '../../common-utils.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;

@Component({
  selector: 'app-top-section-cust',
  templateUrl: './top-section-cust.component.html',
  styleUrls: ['./top-section-cust.component.css',
    '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css',
    '../../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class TopSectionCustComponent implements OnInit {
  constructor(private data: DataService, private http: HttpClient) { }
  youtubeVideoURL: any;
  baseURL = 'http://127.0.0.1:8000/';

  ngOnInit(): void {
    this.data.currentVideo.subscribe( message => this.youtubeVideoURL = message);
    $("#user-id-select").hide();
  }

  getTaggedData(type, idx){
    this.data.taggerType = type;
    for(let i=0;i<3;i++){
      $($(".topSection")[i]).removeClass("highlightBtn");
    }
    $($(".topSection")[idx]).addClass("highlightBtn");

    var $dropdown = $("#user-id-select");
    $dropdown.empty();
    let uniqueTaggers = ['Select a Tagger'];
    this.http.post<any>(this.baseURL + 'getAllUsers', {tagger_type: type}).subscribe(
      res => {

        for(let i=0;i<res.length;i++){
          uniqueTaggers.push(res[i]);
        }
        $("#user-id-select").show();
        $.each(uniqueTaggers, function(idx, val) {
          console.log("val = " + val);
          $dropdown.append($("<option/>").val(val).text(val));
        });
      });

    let that = this;
    $("select#user-id-select").change(function(){
      that.data.taggerID = $(this).children(":selected").html();
      $("#spinner-main").show();
        setTimeout(function () {
          that.loadGraphs(type);
          $("#spinner-main").hide();
          $('#tagging-overlay-main').hide();
        }, 1000);
        });
  }

  loadGraphs(type): void{

    let uid = this.data.taggerID;
    let path1 = '';
    let path2 = '';
    let path3 = '';
    let path4 = '';
    if (type === 'democrat') {
      path1 = '/democrat/entryList_'+uid+'.txt';
      path2 = '/democrat/fishEntry_'+uid+'.txt';
      path3 = '/democrat/interaction_'+uid+'.txt';
      path4 = '/democrat/rankEvolution_'+uid+'.txt';
    } else if (type === 'republican') {
      path1 = '/republican/entryList_'+uid+'.txt';
      path2 = '/republican/fishEntry_'+uid+'.txt';
      path3 = '/republican/interaction_'+uid+'.txt';
      path4 = '/republican/rankEvolution_'+uid+'.txt';
    } else {
      path1 = '/neutral/entryList_'+uid+'.txt';
      path2 = '/neutral/fishEntry_'+uid+'.txt';
      path3 = '/neutral/interaction_'+uid+'.txt';
      path4 = '/neutral/rankEvolution_'+uid+'.txt';
    }

    this.http.post<any>(this.baseURL + 'getFile', {path: path1}).subscribe(
      res => {
        res = JSON.parse(res);
        this.data.changeMessage(res, this.data.taggerType);

        this.http.post<any>(this.baseURL + 'getFile', {path: path2}).subscribe(
          res => {
            res = JSON.parse(res);
            this.data.changeFishEntry(res, this.data.taggerType);

            this.http.post<any>(this.baseURL + 'getFile', {path: path3}).subscribe(
              res => {
                res = JSON.parse(res);
                this.data.changeInteractionSummaryEntry(res);

                this.http.post<any>(this.baseURL + 'getFile', {path: path4}).subscribe(
                  res => {
                    res = JSON.parse(res);
                    this.data.changeRankEvolutionEntry(res);
                  });
              });
          });
      });

  }

}
