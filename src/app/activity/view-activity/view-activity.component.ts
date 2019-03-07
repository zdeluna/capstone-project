import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-view-activity',
  templateUrl: './view-activity.component.html',
  styleUrls: ['./view-activity.component.css']
})
export class ViewActivityComponent implements OnInit {

  constructor(
    private location: Location,
    private activityService: ActivityService
  ) { }

  ngOnInit() {
    this.activityService
    .getUserActivities()
    .subscribe(
      data=> {
        console.log(data);
        
      },
      error => {
        console.log(error);
        
      }
    )
  }

  back() {
    this.location.back();
   }

}
