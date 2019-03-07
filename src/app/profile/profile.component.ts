import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import { UserService } from '../services/user.service';
//import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  constructor(
    private userservice: UserService
  ) { }

  sports: Object = []
  user: User = new User

  ngOnInit() {

    //if user hit remember me on last session at login,
    //loads user and navigates to home page skipping login
    // this.authservice.loadRememberedUser()
    this.user = this.userservice.user;

    //these values should come from the user object
    //in the user service
    this.sports = this.user.activity_types;
  }

}
