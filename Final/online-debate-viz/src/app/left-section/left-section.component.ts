import { Component, OnInit } from '@angular/core';
declare var $: any;

function populateDebatersList() {
  $('#debaters_democrats').html('');
  $('#debaters_republicans').html('');

  $.getJSON('../../assets/json/debaters.json', function(result){
    $("#debaters_democrats").append("Democrats");
    $("#debaters_republicans").append("Republicans");
    $.each(result['profiles'], function(i, field){
      if(field["party"] == 'democratic') {
        var html = '<img class="democratic-img" src="' + field.pic + '" alt="' + field.name + '" onmouseover="showImgName(this)" onmouseout="hideImgName(this)"></img><br/>';
        $("#debaters_democrats").append(html);
      } else {
        var html = '<img class="republican-img" src="' + field.pic + '" alt="' + field.name + '" onmouseover="showImgName(this)" onmouseout="hideImgName(this)"></img><br/>';
        $("#debaters_republicans").append(html);
      }
    });
  });
}


@Component({
  selector: 'app-left-section',
  templateUrl: './left-section.component.html',
  styleUrls: ['./left-section.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css',
    '../../../node_modules/@fortawesome/fontawesome-free/css/all.css']
})
export class LeftSectionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    populateDebatersList();

    $('#add-candidate-btn').on('click', () => {
      $('#add-candidate').show();
    });
  }


}
