import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { UserService } from 'src/app/services/user.service';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity_Type } from 'src/app/models/activity_type.model';

@Component({
  selector: 'app-activities-records',
  templateUrl: './activities-records.component.html',
  styleUrls: ['./activities-records.component.css']
})


export class ActivitiesRecordsComponent implements OnInit {
  

  constructor(
    private _userService: UserService,
    private _activityService: ActivityService,
  ) { }

  user: User = new User;
  activities: Object[] = [];
  distanceTotalsTable = {};
  start_totals: number = 0;
  start_date: Date;
  end_date: Date;
  date: Date;
  date_range_options: Array<number | string> = ['All time', 30, 60, 120];
  date_option = 0;
  date_range_value: number | string = this.date_range_options[this.date_option];
  default: number | string = "All time";
  
  ngOnInit() {
    this.user = this._userService.user;
    this.activities = this.user.activity_types;

    this.getDateRange(this.date_range_value);

    //get the user activity names to display
    this.user.activity_types.map(activity => this.initActivities(activity));

    this.getActivityTotals()
  }

  getActivityTotals() {
    //get the user activity data to display
    this._activityService.getUserActivities(this.start_date, this.end_date)
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

  //got help here https://stackoverflow.com/questions/8842732/how-to-get-30-days-prior-to-current-date
  getDateRange(val: any) {
    if(val == 'All time') {
      val = <number>10000;
    }
    var date_today = new Date()
    var date_span = new Date().setDate(date_today.getDate()-val)
    this.start_date = new Date(date_span)
    this.end_date = new Date(new Date().setDate(date_today.getDate()))
  }

  changeDateRange(val: any) {
    console.log(val);
    if(val == 'All time')
      this.date_option = 0
    else if(val == 30)
      this.date_option = 1
    else if(val == 60)
      this.date_option = 2
    else if(val == 120)
      this.date_option = 3
    else
      console.log('error val is: ' + val);

    this.date_range_value = this.date_range_options[this.date_option]
    this.getDateRange(this.date_range_value)
    this.user.activity_types.map(activity => this.initActivities(activity));
    this.getActivityTotals()
  }

  initActivities(activity: Activity_Type) {
    this.distanceTotalsTable[activity.name] = {
      'Kilometers' : this.start_totals, 
      'Miles': this.start_totals,
      'Steps': this.start_totals,
      'Minutes' : this.start_totals
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
    if((1*value) > this.distanceTotalsTable[type][unit])
      this.distanceTotalsTable[type][unit] = (1 * value); 
  }
  

}
