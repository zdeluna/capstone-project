import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';
// import { Activity } from '../models/activity.model';
import { Activity_Type } from '../models/activity_type.model';
//import { AuthService } from '../services/auth.service';
//import * as _ from "lodash";
// import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  constructor(
    private _userService: UserService,
    private _activityService: ActivityService,
    // private _dbService: DatabaseService
  ) { }


  user: User = new User;
  activities: Object[] = [];
  distanceTotalsTable = {'Kilometers': 0, 'Miles': 0 };
  start: number = 0;
 

  ngOnInit() {

    this.user = this._userService.user;
    this.activities = this.user.activity_types;

    //get the user activity names to display
    this.user.activity_types.map(activity => this.getActivities(activity));

    //get the user activity data to display
    this._activityService.getUserActivities()
    .subscribe(
      activitydata => { //data is an array of arrays of objects
        console.log(activitydata);
        for(let array of activitydata) {
          array.map((activity: any) => this.extractDistanceValues(activity))
        }
      },
      activityError => {
        console.log(activityError);
      },
      () => { console.log('get user activities completed'); 
      console.log(this.distanceTotalsTable);}
    )
  }

  

  getActivities(activity: Activity_Type) {
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
