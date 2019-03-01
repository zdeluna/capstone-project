import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { Challenge } from 'src/app/models/challenge.model';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';

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

  constructor(private location: Location, private dbService: DatabaseService, private router: Router) { }

  tempFriends: User[] = [{
      id: "123456",
      username: "testUser1",
      firstName: "Test",
      lastName: "User",
      password: 'pw'
    },
    {
      id: "654321",
      username: "cpie19",
      firstName: "Chris",
      lastName: "Piemonte",
      password: 'pw'
    }
  ]

  search = ''
  noMatch = false
  searchMatches: User[] = []
  invitedFriends: User[] = []
  minDate = new Date();
  measurements: Measurement[] = [
    {view: 'Steps', activities: ['Walking']},
    {view: 'Time', activities: ['Walking', 'Running', 'Biking', 'Swimming']},
    {view: 'Miles', activities: ['Walking', 'Running', 'Biking']},
    {view: 'Lifting', activities: ['Weight']}
  ]

  form = new FormGroup({
    activity: new FormControl(''),
    measurement: new FormControl({value: '', disabled: true}),
    duration: new FormControl({value: '', disabled: true}),
    startDate: new FormControl({value: '', disabled: true}),
    invitees: new FormControl('')
  })

  friendSearch = new FormGroup({
    name: new FormControl('')
  })

  ngOnInit() {
  }

  logIt() {}

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
    let challenge = new Challenge()
    challenge.name = `${this.form.value.activity} ${this.form.value.measurement} Challenge`
    challenge.activity = this.form.value.activity
    challenge.measurement = this.form.value.measurement
    challenge.duration = this.form.value.duration
    challenge.startDate = this.form.value.startDate
    challenge.invitees = this.form.value.invitees
    this.dbService.addChallenge(challenge).subscribe(res => {
      console.log(res)
      this.router.navigate([`/challenges/${res['_id']}`])
    })
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

  checkForMeasurement(): void {
    if(this.form.value.measurement.length > 0) {
      this.form.controls.duration.enable()
    }
  }

  checkForDuration(): void {
    if(this.form.value.duration.length > 0) {
      this.form.controls.startDate.enable()
    }
  }

  formIsEmpty(): Boolean {
    if(this.form.value.activity || this.form.value.measurement || this.form.value.duration || this.form.value.invitees || this.form.value.startDate) {
      return this.form.value.activity == undefined && this.form.value.measurement == undefined && this.form.value.duration == undefined && this.form.value.invitees == undefined && this.form.value.startDate == undefined
    } else {
      return true
    }
  }

  submitSearch() {
    this.noMatch = false
    this.searchMatches = []
    this.tempFriends.forEach(friend => {
      if(friend.firstName === this.friendSearch.value.name) {
        this.searchMatches.push(friend)
      }
    })
    if(this.searchMatches.length === 0) {
      this.noMatch = true
    }
  }

  clearSearch() {
    this.friendSearch.controls.name.setValue('')
    this.searchMatches = []
    this.noMatch = false
  }

  inviteFriend(id: string) {
    this.invitedFriends.push(this.dbService.getUserHardCoded(id))
    this.form.controls.invitees.setValue(this.invitedFriends)
  }

  removeFriend(id: string) {
    this.invitedFriends.forEach(friend => {
      if(friend.id == id) {
        this.invitedFriends.splice(this.invitedFriends.indexOf(friend), 1)
      }
    })
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }

  clear(): void {
    this.form.reset()
    this.invitedFriends = []
    this.searchMatches = []
    this.friendSearch.controls.name.setValue('')
    this.form.controls.measurement.disable()
    this.form.controls.duration.disable()
    this.form.controls.startDate.disable()
  }

  goBack(): void {
    this.location.back()
  }
}
