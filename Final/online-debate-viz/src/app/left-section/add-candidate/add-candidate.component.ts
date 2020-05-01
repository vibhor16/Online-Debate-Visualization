import { Component, OnInit } from '@angular/core';
declare var $: any;
declare var isCandidateEdit: false;
const debaters = $.getJSON('../../../assets/json/debaters.json')['profiles'];

@Component({
  selector: 'app-add-candidate',
  templateUrl: './add-candidate.component.html',
  styleUrls: ['./add-candidate.component.css',
  '../../../../node_modules/@fortawesome/fontawesome-free/css/all.css',
  '../../../../node_modules/bootstrap/dist/css/bootstrap.css']
})

export class AddCandidateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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

      if(isCandidateEdit){
        editCandidate(id);
      } else {
        addCandidate();
      }

      function editCandidate(id) {
        $.each(debaters, function(i, field) {
          if(field["id"] == id){
            debaters[i]["name"] = candidate_name;
            debaters[i]["pic"] = file_path;
          }
        });

      }

      function addCandidate() {
        var id = getNextId();
      }

      function getCandidateIdByName(name){
        $.each(debaters, function(i, field) {
          if(field["name"] == name)
            return field["id"]
        });
      }

      function getNextId(){
        return  Object.keys(debaters).length + 1;
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
