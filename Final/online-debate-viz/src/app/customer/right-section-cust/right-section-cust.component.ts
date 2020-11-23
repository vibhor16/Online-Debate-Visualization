import { Component, OnInit } from '@angular/core';

declare var $: any;
@Component({
  selector: 'app-right-section-cust',
  templateUrl: './right-section-cust.component.html',
  styleUrls: ['./right-section-cust.component.css',
    '../../../../node_modules/bootstrap/dist/css/bootstrap.css']
})
export class RightSectionCustComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

  }
  switchGraph(): void{
    $("#interaction_summary").toggle();
    $("#rank_evolution").toggle();
  }

}
