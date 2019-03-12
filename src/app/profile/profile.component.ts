import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';
import { Activity } from '../models/activity.model';
import { Activity_Type } from '../models/activity_type.model';
//import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  constructor(
    private userservice: UserService,
    private activityService: ActivityService,
  ) { }

  btnOptions: Array<String> = [
    'General',
    'Achievements',
    'Current Challenges',
    'Records'
  ]
  user: User = new User;
  edit_btn_disabled: boolean = true;
  edit: boolean = false;
  activities: Object[] = [];
  distanceTotalsTable = {'Kilometers': 0, 'Miles': 0 };
  start: number = 0;
  

  ngOnInit() {

    //if user hit remember me on last session at login,
    //loads user and navigates to home page skipping login
    // this.authservice.loadRememberedUser()
    this.user = this.userservice.user;
    this.activities = this.user.activity_types;

    //these values should come from the user object
    //in the user service
    this.user.activity_types.map(activity => this.assignSports(activity));

    console.log(this.distanceTotalsTable['Biking'].Miles);
    

    this.activityService.getUserActivities()
    .subscribe(
      data => { //data is array of arrays of objects
        console.log(data);
        for(let array of data) {
          array.map((activity: any) => this.extractDistanceValues(activity))
        }
      },
      error => {
        console.log(error);
      },
      () => { console.log('completed'); 
      console.log(this.distanceTotalsTable);}
    )
  }

  editProfile() {
    this.edit = !this.edit;
    this.edit_btn_disabled = !this.edit_btn_disabled;
  }

  assignSports(activity: Activity_Type) {
    this.distanceTotalsTable[activity.name] = {
      'Kilometers' : this.start, 
      'Miles': this.start,
      'Steps': this.start
    };
  }

  extractDistanceValues(activity: any) {
    let type : string = activity['type'];
    console.log('Type: ' + type);
    // let measurement = activity['measurement'];
    // console.log('Measurement: ' + measurement);
    let value : number = activity['value'];
    console.log('Value: ' + value);
    let unit : string = activity['units'];
    console.log('Unit: ' + unit);
    
    // if(type == 'Biking') {
      //https://stackoverflow.com/questions/5961000/javascript-sign-concatenates-instead-of-giving-sum-of-variables/5961057
      this.distanceTotalsTable[type][unit] += (1 * value); 
    // }
   
  }

}
