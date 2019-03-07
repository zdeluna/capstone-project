import { Component, OnInit, QueryList, ViewChildren, ViewChild } from '@angular/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Activity } from '../../models/activity.model';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';
import { DatePipe, Location } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-activity',
  templateUrl: './add-activity.component.html',
  styleUrls: ['./add-activity.component.css'],
  providers: [ DatePipe ]
})

export class AddActivityComponent implements OnInit {

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
    private DatePipe : DatePipe,
    private location: Location,
    private router: Router,
    private userService: UserService
  ) { }

  activity: Activity = new Activity
  activityForm: FormGroup;
  submitted: boolean = false;
  error: boolean = false;
  _units: Array<String> = [];
  units_placeholder: String = 'Pick Measurement';
  measurments: Array<String> = ["Distance", "Time"];
  options: Array<String> = ["Yes"];

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
    
    this.sports = this.userService.user.activity_types;
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

    //disable submit btn
    this.submitted = true;
    console.log('submitted');

    //changes date into wanted format
    //got help here https://stackoverflow.com/questions/54576074/angular-7-reactive-forms-how-to-format-date-as-yyyy-mm-dd
    this.activityForm.value.date = this.DatePipe.transform(
      this.activityForm.value.date,
      'MM-dd-yyyy' //still not perfect
    );
    console.log(this.activityForm.value);

    //changes form object to activity objecy and fills
    //activity in activity service
    this.activity = new Activity(this.activityForm.value);
    this.activityService.fillActivity(this.activity);

    //sends activity to server
    this.activityService
    .sendActivity()
      .subscribe(
      data => {
        console.log(data);
        
      },
      error => {
        this.error = true;
        console.log(error);
      }
    );
  }

  fillMeasurement(val: String) {
    //help from https://stackoverflow.com/questions/40974191/how-to-display-the-dropdown-values-based-on-other-dropdown-value-using-typescrip
    if(val == 'Distance') {
      this._units = ['Miles', 'Kilometers', 'Steps'];
      this.units_placeholder = 'KM/Miles/Steps'
    }
    else if (val == 'Time') {
      this._units = ['Minutes', "Hours"];
      this.units_placeholder = "Minutes/Hours"
    }
  }

  goAgain(val: String) {
    if(val == this.options[0]) {
      this.clearForm();
    }
   else {
     this.backButton();
    }
  }

  backButton() {
    this.location.back();
  }

  clearForm() {
    this.submitted = false; 
    this.error = false;
    this._units = [];
    this.units_placeholder = "Pick measurement"
    this.activityForm.reset();
  }

}
