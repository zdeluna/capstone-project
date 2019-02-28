import { Component, OnInit } from '@angular/core';
// import {MatButtonToggle} from '@angular/material/button-toggle';
// import {TextFieldModule} from '@angular/cdk/text-field';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {

  sports: Object = []
  
  constructor() { }

  ngOnInit() {
    this.sports = [  
      {name: "Biking"},
      {name: "Running"},
      {name: "Weights"},
      {name: "Swimming"},
      {name: "Rowing"},
      {name: "Hiking"},
      {name: "Kayaking"},
      {name: "Video Games"}
    ];
  }

}
