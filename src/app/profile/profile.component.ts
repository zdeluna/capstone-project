import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import { UserService } from '../services/user.service';
import { ActivityService } from '../services/activity.service';
// import { Activity } from '../models/activity.model';
import { Activity_Type } from '../models/activity_type.model';
//import { AuthService } from '../services/auth.service';
//import * as _ from "lodash";
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  constructor(
    private _userService: UserService,
    private _activityService: ActivityService,
    private _dbService: DatabaseService
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
  new_profile: User;
  age : number | string;

  ngOnInit() {

    this.user = this._userService.user;
    //deep copy object so edit input doesn't bind to both objects
    this.new_profile = {...this.user}; 
    this.activities = this.user.activity_types;

    //if values are null 
    if(!this._userService.user.location)
      this.user.location = 'No location'
    if(!this._userService.user.firstName)
      this.user.firstName = 'No First Name'
    if(!this._userService.user.lastName)
      this.user.lastName = 'No Last Name'
    if(!this._userService.user.dateOfBirth)
      this.age = 'No Date Of Birth'

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

  editProfile() {
    this.edit = true;
    this.edit_btn_disabled = false;
  }

  saveProfile() {
    this.edit = false;
    this.edit_btn_disabled = true;
    if(JSON.stringify(this.new_profile) != JSON.stringify(this.user)) {
      console.log('Editing Profile: ');
      this._dbService.setToken(this.user.token)
      this._dbService.editUser(this.new_profile, this.user.id)
      .subscribe(
        editData => {
          console.log('new user' + JSON.stringify(editData));
          this._dbService.getUser(this.user.id)
          .subscribe(
            getUserData => {
              this._userService.setUserDataFromDb(getUserData);
              console.log(this._userService.user);
              this.user = {...this._userService.user} 
              var today = new Date();
              var birthDate = new Date(this.user.dateOfBirth);
              this.age = today.getFullYear() - birthDate.getFullYear();
              var m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  this.age--;
              }
              console.log('User age is: ' + this.age);
              
            },
            getUserError => {
              console.log(getUserError);
            }
          )
        },
        editError => console.log(editError)
      );
    }
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
