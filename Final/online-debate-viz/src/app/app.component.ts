import {Component, OnInit} from '@angular/core';
declare var $: any;



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
    '../../node_modules/bootstrap/dist/css/bootstrap.css',
  '../../node_modules/@fortawesome/fontawesome-free/css/all.css']
})
export class AppComponent implements OnInit{
  title = 'online-debate-viz';

  constructor() { }
  ngOnInit(): void {
    $('#add-candidate').hide();
   }
}

