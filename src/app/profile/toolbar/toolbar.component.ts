import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor() { }

  isActive1 = 'active';
  isActive2 = ''

  ngOnInit() {
  }

  changeOptions() {
    let temp = this.isActive1;
    this.isActive1 = this.isActive2;
    this.isActive2 = temp;
  }


  btnOptions: Array<String> = [
    'Totals',
    'Records'
  ]

}
