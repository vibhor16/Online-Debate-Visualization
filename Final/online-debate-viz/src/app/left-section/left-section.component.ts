import { Component, OnInit } from '@angular/core';
import { GET_DEBATERS_JSON } from 'src/app/common-utils.service';

declare var $: any;

@Component({
  selector: 'app-left-section',
  templateUrl: './left-section.component.html',
  styleUrls: ['./left-section.component.css',
    '../../../node_modules/bootstrap/dist/css/bootstrap.css',
    '../../../node_modules/@fortawesome/fontawesome-free/css/all.css']
})
export class LeftSectionComponent implements OnInit {

  democrats: any[];
  republicans: any[];
  constructor() { }

  ngOnInit(): void {
    let debaters = GET_DEBATERS_JSON();
    this.democrats = debaters["democrats"];
    this.republicans = debaters["republicans"];

    // populateDebatersList();

    $('#add-candidate-btn').on('click', () => {
      $('#add-candidate').show();
    });
  }


  toggleLabel(el) {
    $("#"+el.target.id).toggleClass("blue");
    $("#label_"+el.target.id).fadeToggle();
  }
}
