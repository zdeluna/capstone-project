import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity_Type } from 'src/app/models/activity_type.model';

@Component({
  selector: 'app-activities-data',
  templateUrl: './activities-data.component.html',
  styleUrls: ['./activities-data.component.css']
})


export class ActivitiesDataComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private _activityService: ActivityService,
  ) { }

  user: User = new User;
  activities: Object[] = [];
  distanceTotalsTable = {};
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
          array.map((activity: any) => this.extractDataValues(activity))
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
      'Steps': this.start,
      'Minutes' : this.start
    };
  }

  extractDataValues(activity: any) {
    let type : string = activity['type'];
    console.log('Type: ' + type);
    let measurement = activity['measurement'];
    console.log('Measurement: ' + measurement);
    let value : number = activity['value'];
    console.log('Value: ' + value);
    let unit : string = activity['units'];
    console.log('Unit: ' + unit);
    let desc : string = activity['description'];
    if(desc) console.log(desc);
    else console.log('none');
    
    console.log('');
    

    if(unit == 'Hours') {
      unit = 'Minutes'
      value = (1*value) * 60;
    }
    
    //https://stackoverflow.com/questions/5961000/javascript-sign-concatenates-instead-of-giving-sum-of-variables/5961057
    this.distanceTotalsTable[type][unit] += (1 * value); 
  }
  

}
