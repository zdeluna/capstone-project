import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-create-challenge',
  templateUrl: './create-challenge.component.html',
  styleUrls: ['./create-challenge.component.css']
})
export class CreateChallengeComponent implements OnInit {

  constructor(private location: Location) { }

  measurements = ['Steps', 'Time', 'Miles', 'Total Weight']

  form = new FormGroup({
    activity: new FormControl(''),
    measurement: new FormControl(''),
    duration: new FormControl(''),
    invitees: new FormControl('')
  })

  ngOnInit() {
  }

  formIsEmpty() {
    if(this.form.value.activity || this.form.value.measurement || this.form.value.duration || this.form.value.invitees) {
      return this.form.value.activity.length < 1 || this.form.value.measurement.length < 1 || this.form.value.duration.length < 1 || this.form.value.invitees.length < 1
    } else {
      return true
    }
  }

  clear() {
    this.form.reset()
  }

  goBack() {
    this.location.back()
  }
}
