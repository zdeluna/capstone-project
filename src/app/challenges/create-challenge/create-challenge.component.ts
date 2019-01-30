import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

export interface Measurement {
  view: string;
  activities: string[];
}

@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.css']
})
export class CreateChallengeComponent implements OnInit {

  constructor(private location: Location) { }

  measurements: Measurement[] = [
    {view: 'Steps', activities: ['walking']},
    {view: 'Time', activities: ['walking', 'running', 'biking', 'swimming']},
    {view: 'Miles', activities: ['walking', 'running', 'biking']},
    {view: 'Weight', activities: ['weight']}
  ]

  form = new FormGroup({
    activity: new FormControl(''),
    measurement: new FormControl({value: '', disabled: true}),
    duration: new FormControl(''),
    invitees: new FormControl('')
  })

  ngOnInit() {
  }

  formIsValid(): void {
    /* TODO:
      * verify activity is selected and valid
      * verify measurement is selected and valid
      * verify duration is selected and valid
      * 
      * If false, 'Create' button on form will be disabled
    */
  }

  submitForm(): void {
    /* TODO:
      * call formIsValid() (security for presentation-level attack)
      ** if valid, call addChallenge from dbService
      *** redirect to challenge page
      ** if not valid, do nothing (should only happen under attack)
    */
  }

  validMeasurementForActivity(activity: String, measurement: []): Boolean {
    let valid = false
    if(activity) {
      measurement.forEach(measurement => {
        if(measurement === activity) {valid = true}
      })
    }
    return valid
  }

  checkForActivity(): void {
    if(this.form.value.activity.length > 0) {
      this.form.controls.measurement.enable()
    }
  }

  formIsEmpty(): Boolean {
    if(this.form.value.activity || this.form.value.measurement || this.form.value.duration || this.form.value.invitees) {
      return this.form.value.activity.length < 1 && this.form.value.measurement.length < 1 && this.form.value.duration.length < 1 && this.form.value.invitees.length < 1
    } else {
      return true
    }
  }

  clear(): void {
    this.form.reset()
    this.form.controls.measurement.disable()
  }

  goBack(): void {
    this.location.back()
  }
}
