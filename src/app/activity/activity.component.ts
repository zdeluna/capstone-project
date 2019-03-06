import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../models/activity.model';
import { ActivityService } from '../services/activity.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css'],
  providers: [ DatePipe ]
})

export class ActivityComponent implements OnInit {

  @ViewChild(MatButtonToggleGroup) group: MatButtonToggleGroup;
  @ViewChildren(MatButtonToggle) toggles: QueryList<MatButtonToggle>;
  ngAfterViewInit() {
    setTimeout(() => {
      this.toggles.forEach(toggle => toggle.buttonToggleGroup = this.group);
    });
  }

  sports: Object = []
  
  constructor(
    private fb: FormBuilder,
    private activityService: ActivityService,
    private DatePipe : DatePipe
  ) { }

  activity: Activity = new Activity
  activityForm: FormGroup;
  submitted: boolean = false;
  error: boolean = false;
  _units: Object[] = [];
  measurments: Array<String> = ["Distance", "Time"];

  ngOnInit() {

      //form group controls form fields
      this.activityForm = this.fb.group({
        type: ['', [
          Validators.required,
        ]],
        measurement: ['',[
          Validators.required,
        ]],
        units: ['',[
          Validators.required,
        ]],
        value: ['', [
          Validators.required,
          Validators.min(0)
        ]],
        date: ['', [
          Validators.required,
        ]],
        description: ['']
      });
    
    this.sports = [  
      {name: "Biking"},
      {name: "Running"},
      {name: "Weights"},
      {name: "Swimming"},
      {name: "Rowing"},
      {name: "Hiking"},
      {name: "Kayaking"},
      {name: "Video Games"},
      {name: "Biking"},
      {name: "Running"},
      {name: "Weights"},
      {name: "Swimming"},
      {name: "Rowing"},
      {name: "Hiking"},
      {name: "Kayaking"},
      {name: "Video Games"}
    ];

    this._units = [
      { type: "Miles" },
      { type: "KM" }
    ];
  }

  get type() {
    return this.activityForm.get('Type');
  }
  get measurment() {
    return this.activityForm.get('Measurment');
  }
  get unit() {
    return this.activityForm.get('Unit');
  }
  get value() {
    return this.activityForm.get('Value');
  }
  get date() {
    return this.activityForm.get('Date');
  }
  get description() {
    return this.activityForm.get('Descripton');
  }

  // descriptionChange() {
  //   console.log(this.activityForm
  //     .get("Description").value)
  // }

  onSubmit() {
    this.submitted = true;
    console.log('submitted');
    this.activityForm.value.date = this.DatePipe.transform(
      this.activityForm.value.date,
      'MM-dd-yyyy'
    );
    console.log(this.activityForm.value);
    this.activity = new Activity(this.activityForm.value);
    this.activityService.fillActivity(this.activity);
    this.activityService
    .sendActivity()
      .subscribe(
      data => {
        console.log(data);
      },
      error => {
        console.log(error);
        
      }
    );
  }

  back() {

  }

}
