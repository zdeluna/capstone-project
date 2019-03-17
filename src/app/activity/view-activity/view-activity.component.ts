import { Component, OnInit, ViewChild } from '@angular/core';
import { Location } from '@angular/common';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { MatSort, MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.css']
})
export class ViewActivityComponent implements OnInit{

  constructor(
    private location: Location,
    private activityService: ActivityService,
  ) { }

  error: boolean = false;
  activities: Array<Activity> = [];
  displayedColumns: string[] = ['type', 'measurement', 'value', 'units', 'date', 'description'];
  dataSource : MatTableDataSource<Activity>;
  date_range_options: Array<number | string> = ['All time', 30, 60, 120];
  date_option = 0;
  date_range_value: number | string = this.date_range_options[this.date_option];
  default: number | string = 'All time';
  start_date: Date
  end_date: Date

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    this.getDateRange(this.date_range_value);
    this.getActivities();
  }

  back() {
    this.location.back();
   }

  //got help here https://stackoverflow.com/questions/8842732/how-to-get-30-days-prior-to-current-date
  getDateRange(val: any) {
    if(val == 'All time') {
      val = <number>10000
    }
    var date_today = new Date()
    var date_span = new Date().setDate(date_today.getDate()-val)
    this.start_date = new Date(date_span)
    this.end_date = new Date(new Date().setDate(date_today.getDate()))
  }

  changeDateRange(val: number | string) {
    console.log(val);
    if (val == 'All time')
     this.date_option = 0
    else if(val == 30)
      this.date_option = 1
    else if(val == 60)
      this.date_option = 2
    else if(val == 120)
      this.date_option = 3
    else
      console.log('Error val: ' + val);

    this.date_range_value = this.date_range_options[this.date_option]
    this.getDateRange(this.date_range_value)
    this.getActivities()
  }

   getActivities(){ 
    this.activities = []
    this.activityService
    .getUserActivities(this.start_date, this.end_date)
    .subscribe(
      activityData => { //data is array of arrays of objects
        console.log(activityData);
        let indexCounter = 0;
        for(var activityType = 0; activityType < activityData.length; activityType++)
        {        
          // console.log(activityData[activityType]); //for every activity array in data array
          for( var activity in activityData[activityType]) { //for every activity in array
            // console.log('index: ' + activity);     
            // console.log(activityData[activityType][activity]);
            this.activities[indexCounter] = activityData[activityType][activity];
            indexCounter++;
        }
      }

      console.log(this.activities);
      this.dataSource = new MatTableDataSource(this.activities);
      this.dataSource.sort = this.sort;
      },
      activityError => {
        this.error = true;
        console.log(activityError);
      },
      () => {
        console.log('Get activities Completed!!');
      }
    )
   }

}
