import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';
//import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  constructor(
    private userservice: UserService,
    private activityService: ActivityService
  ) { }

  sports: Object[] = []
  btnOptions: Array<String> = [
    'General',
    'Achievements',
    'Current Challenges',
    'Records'
  ]
  user: User = new User;
  edit_btn_disabled: boolean = true;
  edit: boolean = false;

  ngOnInit() {

    //if user hit remember me on last session at login,
    //loads user and navigates to home page skipping login
    // this.authservice.loadRememberedUser()
    this.user = this.userservice.user;

    //these values should come from the user object
    //in the user service
    this.sports = this.user.activity_types;

    this.activityService.getUserActivities()
    .subscribe(
      data => { //data is array of arrays of objects
        console.log(data);
      },
      error => {
        console.log(error);
      },
      () => { console.log('completed'); }
    )
  }

  editProfile() {
    this.edit = !this.edit;
    this.edit_btn_disabled = !this.edit_btn_disabled;
  }

}
