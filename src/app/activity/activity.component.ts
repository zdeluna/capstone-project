import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import { DatePipe, Location } from '@angular/common';


@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  providers: [ DatePipe ]
})

export class ActivityComponent implements OnInit {

  constructor(
    private location: Location
  ) {}

  options: Object[] = []

  ngOnInit() {
    this.options = [
      {
        view: 'Add New Activity',
        location: 'assets/flat-icons/add.svg',
        value: "add"
      },
      {
        view: 'Activities History',
        location: "assets/flat-icons/magnifier.svg",
        value: "view"
      }
    ]
  }

  back() {
   this.location.back();
  }

}
