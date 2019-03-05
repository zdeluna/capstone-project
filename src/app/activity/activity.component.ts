import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import {TextFieldModule} from '@angular/cdk/text-field';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
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
  ) { }

  activityForm: FormGroup;
  submitted: boolean = false;
  error: boolean = false;
  sport: String;
  _measure: String;
  _unit: String;
  units: Object[] = [];
  _value: String;
  _date: String;
  _description: String;
  measurments: Array<String> = ["Distance", "Time"];

  ngOnInit() {

      //form group controls form fields
      this.activityForm = this.fb.group({
        Type: [this.sport, [
          Validators.required,
        ]],
        Measurment: [this._measure,[
          Validators.required,
        ]],
        Unit: [this._unit,[
          Validators.required,
        ]],
        Value: [this._value, [
          Validators.required,
          Validators.min(0)
        ]],
        Date: [this._date, [
          Validators.required,
        ]],
        Description: [this._description]
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

    this.units = [
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

  hitSport(val: String) {
    this.sport = val;
    console.log("Sport: " + val);
    // console.log(this.activityForm);
  }

  hitMeasurement(val: String) {
    this._measure = val;
    console.log('Units: ' + val);
  }

  hitUnit(val: string) {
    this._unit= val;
    console.log('Units: ' + val);
  }

  descriptionChange() {
    console.log(this.activityForm
      .get("Description").value)
  }

}
