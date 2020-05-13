import {Component, Input, OnInit} from '@angular/core';
import { saveAs } from 'file-saver';
declare var $: any;
// @Input let global_debaters_list;
function populateDebatersList(debaters) {
  $('#debaters_democrats').html('');
  $('#debaters_republicans').html('');

  $("#debaters_democrats").append("Democrats");
  $("#debaters_republicans").append("Republicans");
  $.each(debaters, function(i, field){
      if(field["party"] == 'democratic') {
        var html = '<img id="democrat_'+ field.id+'" class="democratic-img" src="' + field.pic + '" alt="' + field.name + '" onmouseover="showImgName(this)" onmouseout="hideImgName(this)"></img><br/>';
        $("#debaters_democrats").append(html);
      } else {
        var html = '<img id="republican_'+ field.id+'" class="republican-img" src="' + field.pic + '" alt="' + field.name + '" onmouseover="showImgName(this)" onmouseout="hideImgName(this)"></img><br/>';
        $("#debaters_republicans").append(html);
      }
  });
}

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css',
  '../../../node_modules/@fortawesome/fontawesome-free/css/all.css',
  '../../../node_modules/bootstrap/dist/css/bootstrap.css']
})

export class AddCandidateComponent implements OnInit {
  isCandidateEdit: false;
  debaters: {};

  constructor() { }

  ngOnInit(): void {

    if(localStorage.getItem("debaters") == null) {
        // this.debaters = retrieveDebaterJSON();
    } else {
      this.debaters = localStorage.getItem("debaters");
    }
    this.attachListeners();
  }
  attachListeners(): void{

    $('#close-pop-up').on('click', () => {
      $('#add-candidate').toggle();
    });

    $('#save-pop-up').on('click',() => {
      var id =  $('#candidate_id').val();
      var candidate_name = $('#candidate_name').val();
      var party  = $('input:radio[name=\'parties\']:checked').val();
      var file_path = $('#input_file').val();

      // var FileSaver = require('file-saver');
      // var blob = new Blob([debaters], {type: "text/plain;charset=utf-8"});
      // FileSaver.saveAs(blob, "../../assets/json/debaters1.json");


      if(this.isCandidateEdit){
        editCandidate(id);
      } else {
        addCandidate();
      }

      function editCandidate(id) {
        $.each(this.debaters, function(i, field) {
          if(field["id"] == id){
            this.debaters[i]["name"] = candidate_name;
            this.debaters[i]["pic"] = file_path;
            this.debaters[i]["party"] = party;
          }
        });
        localStorage.setItem("debaters", this.debaters);
        populateDebatersList(this.debaters);
      }

      function addCandidate() {
        const id = getNextId();
        const json = {};
        json["id"] = id;
        json["name"] = candidate_name;
        json["pic"] = file_path;
        json["party"] = party;
        this.debaters.append(json);
        localStorage.setItem("debaters", this.debaters);
        populateDebatersList(this.debaters);
      }

      function getCandidateIdByName(name){
        $.each(this.debaters, function(i, field) {
          if(field["name"] == name)
            return field["id"]
        });
      }

      function getNextId(){
        return  Object.keys(this.debaters).length + 1;
      }

      alert(candidate_name+" "+party+" "+file_path);
    });
  }

  uploadImage(event) {
    const file_src = $("#input_file").val()
    const imgtag = $("#candidate-img");
    if (event.keyCode === 13) {
      if (file_src.length > 0)
        imgtag.attr('src', file_src);
    }
  }
}
