import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { UserService } from 'src/app/services/user.service';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.css']
})
export class ViewActivityComponent implements OnInit, AfterViewInit {

  constructor(
    private location: Location,
    private activityService: ActivityService,
    private userService: UserService
  ) { }

  error: boolean = false;
  activities: Array<Activity> = [];
  displayedColumns: string[] = ['type', 'measurement', 'value', 'units', 'date', 'description'];
  dataSource : MatTableDataSource<Activity>;
  date_range_options: Array<number> = [30, 60];
  date_option = 0;
  date_range_value: number = this.date_range_options[this.date_option];
  autoFocusResult: boolean; //dont think I need this take out
  default: number = 30;
  start_date: Date
  end_date: Date

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getDateRange(this.date_range_value);
    this.getActivities();
    // this.dataSource = this.activities;
  }

  ngAfterViewInit() {
    // this.dataSource = this.activities;
    // this.dataSource.sort = this.sort;
  }

  back() {
    this.location.back();
   }

  //got help here https://stackoverflow.com/questions/8842732/how-to-get-30-days-prior-to-current-date
  getDateRange(val: number) {
    var date_today = new Date()
    var date_span = new Date().setDate(date_today.getDate()-val)
    this.start_date = new Date(date_span)
    this.end_date = new Date(new Date().setDate(date_today.getDate()))
  }

  changeDateRange() {
    if(this.date_option) 
      this.date_option = 0;
    else this.date_option = 1;
    this.date_range_value = this.date_range_options[this.date_option]
    this.getDateRange(this.date_range_value)
    this.getActivities()
  }

   getActivities(){ 
    this.activityService
    .getUserActivities(this.start_date, this.end_date)
    .subscribe(
      activityData => { //data is array of arrays of objects
        console.log(activityData);
        let indexCounter = 0;
        for(var activityType = 0; activityType < activityData.length; activityType++)
        {        
          // console.log(data[activityType]); //for every activity array in data array
  
          for( var activity in activityData[activityType]) { //for every activity in array
            // console.log('index: ' + activity);     
            // console.log(data[activityType][activity]);
          
            this.activities[indexCounter] = activityData[activityType][activity];
            indexCounter++;
        }
      }

      console.log(this.activities);
      this.dataSource = new MatTableDataSource(this.activities);
      this.dataSource.sort = this.sort;
      // this.dataSource.data = this.activities;
      // this.dataSource.sort = this.sort;
     
      },
      activityError => {
        this.error = true;
        console.log(activityError);
      },
      () => {
        console.log('Completed');
      }
    )
   }

}
