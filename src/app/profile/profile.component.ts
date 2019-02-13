import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor() { }

  sports: Object = []
  // public successClass = "text-success";
  // public hasError = false;
  // public isSpecial = true;
  // public messageClasses = {
  //   Running: 'blue'
  // }

  ngOnInit() {
    this.sports = [
      {name: 'Running', miles: 55},
      {name: 'Biking', miles: 103},
      {name: 'Elliptical', miles: 13},
      {name: 'Rowing', miles: 37}
    ];
  }

}
