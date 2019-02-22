import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {

  constructor() { }

  sports: Object = []
  user: User = new User

  ngOnInit() {
    //these values should come from the user object
    //in the user service
    this.sports = [
      {name: 'Running', miles: 55},
      {name: 'Biking', miles: 103},
      {name: 'Elliptical', miles: 13},
      {name: 'Rowing', miles: 37}
    ];
  }

}
