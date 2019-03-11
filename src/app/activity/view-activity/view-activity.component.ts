import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { UserService } from 'src/app/services/user.service';
import { Activity_Type } from 'src/app/models/activity_type.model';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.css']
})
export class ViewActivityComponent implements OnInit {

  constructor(
    private location: Location,
    private activityService: ActivityService,
    private userService: UserService
  ) { }

  error: boolean = false;
  activities: Array<Activity> = [];
  displayedColumns: string[] = ['type', 'measurement', 'value', 'units', 'date', 'description'];
  dataSource;


  ngOnInit() {
    this.getActivities();
  }

  back() {
    this.location.back();
   }

   getActivities() { 
    this.activityService
    .getUserActivities()
    .subscribe(
      data => { //data is array of arrays of objects
        console.log(data);
        let indexCounter = 0;
        for(var activityType = 0; activityType < data.length; activityType++)
        {        
          // console.log(data[activityType]); //for every activity array in data array
  
          for( var activity in data[activityType]) { //for every activity in array
            // console.log('index: ' + activity);     
            // console.log(data[activityType][activity]);
          
            this.activities[indexCounter] = data[activityType][activity];
            indexCounter++;
        }
      }

      console.log(this.activities);
      
      },
      error => {
        this.error = true;
        console.log(error);
      },
      () => {
        console.log('Completed');
        this.dataSource = this.activities;
      }
    )
    // this.error = true; //for now
   }

}
