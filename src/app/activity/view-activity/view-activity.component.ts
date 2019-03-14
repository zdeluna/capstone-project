import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivityService } from 'src/app/services/activity.service';
import { Activity } from 'src/app/models/activity.model';
import { UserService } from 'src/app/services/user.service';
import { Activity_Type } from 'src/app/models/activity_type.model';
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

  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
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

   getActivities(){ 
    // this.activityService
    // .getUserActivities('', '')
    // .subscribe(
    //   data => { //data is array of arrays of objects
    //     console.log(data);
    //     let indexCounter = 0;
    //     for(var activityType = 0; activityType < data.length; activityType++)
    //     {        
    //       // console.log(data[activityType]); //for every activity array in data array
  
    //       for( var activity in data[activityType]) { //for every activity in array
    //         // console.log('index: ' + activity);     
    //         // console.log(data[activityType][activity]);
          
    //         this.activities[indexCounter] = data[activityType][activity];
    //         indexCounter++;
    //     }
    //   }

    //   console.log(this.activities);
    //   this.dataSource = new MatTableDataSource(this.activities);
    //   this.dataSource.sort = this.sort;
    //   // this.dataSource.data = this.activities;
    //   // this.dataSource.sort = this.sort;
     
    //   },
    //   error => {
    //     this.error = true;
    //     console.log(error);
    //   },
    //   () => {
    //     console.log('Completed');
    //   }
    // )
   }

}
