import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl } from '@angular/forms';
import { Challenge } from 'src/app/models/challenge.model';
import { DatabaseService } from 'src/app/services/database.service';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

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

  constructor(private location: Location,
    private dbService: DatabaseService,
    private router: Router,
    private userService: UserService) { }

  user: User = new User
  friends: User[] = []
  durationMessage: string = ''
  endDateMessage: string = ''
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
    this.dbService.getCurrentUser().subscribe(res => {
      this.user.id = this.userService.getCurrentUserId()
      this.user.username = res['username']
      this.user.firstName = res['first_name']
      this.user.lastName = res['last_name']
      this.user.password = res['password']
      this.user.friends = res['friends']

      this.setFriends()
    })
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
    this.dbService.addChallenge(challenge).subscribe(challenge => {
      if(this.form.value.invitees.length > 0) {
        this.dbService.inviteParticipants(challenge['_id'], this.form.value.invitees)
        setTimeout(() => this.router.navigate([`/challenges/${challenge['_id']}`]), 2000) //have to do this bc no response is sent
      } else {
        this.router.navigate([`/challenges/${challenge['_id']}`])
      }
    })
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
      let d = this.form.value.duration
      switch(d) {
        case('weekend'):
          this.durationMessage = 'Must begin on a Saturday'
          break
        case ('work-week'):
          this.durationMessage = 'Must begin on a Monday'
          break
        case('full-week'):
          this.durationMessage = 'Must begin on a Monday'
          break
        case('month'):
          this.durationMessage = 'Must begin on the first of the month'
          break
        case('year'):
          this.durationMessage = 'Must begin on the first of any month'
          break
        default:
        this.durationMessage = ''
      }

      this.form.controls.startDate.enable()
    }
  }

  displayEndDate() {
    if(this.form.value.startDate) {
      let d = new Date(this.form.value.startDate)
      let endDate: Date
      switch(this.form.value.duration) {
        case('weekend'):
          endDate = new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 2}`)
          break
        case('work-week'):
          endDate = new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 5}`)
          break
        case('full-week'):
          endDate = new Date(`${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate() + 7}`)
          break
        case('month'):
          endDate = new Date(`${d.getFullYear()}-${d.getMonth() + 2}-${d.getDate()}`)
          break
        case('year'):
          endDate = new Date(`${d.getFullYear() + 1}-${d.getMonth() + 1}-${d.getDate()}`)
          break
        default:
          endDate = new Date()
      }
      this.endDateMessage = `Ends on ${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`
    }
  }

  formIsEmpty(): Boolean {
    if(this.form.value.activity || this.form.value.measurement || this.form.value.duration || this.form.value.invitees || this.form.value.startDate) {
      return this.form.value.activity == undefined && this.form.value.measurement == undefined && this.form.value.duration == undefined && this.form.value.invitees == undefined && this.form.value.startDate == undefined
    } else {
      return true
    }
  }

  setFriends() {
    this.user.friends.forEach(f => {
      this.dbService.getUser(f).subscribe(res => {
        let u: User = new User
        u.id = res['_id']
        u.username = res['username']
        u.firstName = res['first_name']
        u.lastName = res['last_name']
        u.password = res['password']

        this.friends.push(u)
      })
    })
  }

  submitSearch() {
    this.noMatch = false
    this.searchMatches = []
    this.friends.forEach(friend => {
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

  inviteFriend(friend: User) {
    this.invitedFriends.push(friend)
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
    const date = d.getDate();
    
    switch(this.form.value.duration) {
      case('weekend'):
        return day === 6
      case('work-week'):
      case('full-week'):
        return day === 1
      case('month'):
      case('year'):
        return date === 1
      default:
        return true
    }
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
