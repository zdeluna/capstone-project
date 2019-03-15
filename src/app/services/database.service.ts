import { Injectable } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { map } from 'rxjs/operators';
import { Post } from '../models/post.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor (
    private http: HttpClient, 
    private userService: UserService
    ) { }

  uri = 'https://capstone-wazn.appspot.com/api'
  user: User = new User()

  token:string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.userService.getToken()
    })
  }

  addChallenge(challenge: Challenge) {
    console.log(this.httpOptions)
    let c = {
      name: challenge.name,
      activity: challenge.activity,
      duration: challenge.duration,
      measurement: challenge.measurement,
      start_date: `0${(challenge.startDate.getMonth() + 1)}-${challenge.startDate.getDate()}-${challenge.startDate.getFullYear()}`
    }
    return this.http.post(`${this.uri}/challenges`, c, this.httpOptions)
  }

  inviteParticipants(id: string, participants: any[]) {
    let status = {status: "0"}

    if(participants.length > 1) {
      let url = `${this.uri}/challenges/${id}/participants/${participants.pop().id}`
      this.http.post(url, status, this.httpOptions).subscribe(() => {
        this.inviteParticipants(id, participants)
      })
    } else {
      let url = `${this.uri}/challenges/${id}/participants/${participants.pop().id}`
      this.http.post(url, status, this.httpOptions)
    }
  }

  submitMessage(id: string, m: Object) {
    return this.http.post(`${this.uri}/challenges/${id}/messages`, m, this.httpOptions)
  }

  deleteMessage(cId: string, message: Post) {
    let url = `${this.uri}/challenges/${cId}/messages/${message.id}`
    return this.http.delete(url, this.httpOptions)
  }

  getChallenge(id: string) {
    return this.http.get(`${this.uri}/challenges/${id}`, this.httpOptions)
  }

  getExampleChallenge() {
    return this.http.get(`${this.uri}/challenges/5c82e1fdaeaa110005c6b28f`, this.httpOptions)
  }

  getExerciseByUserDateAndActivity(userId: string, startDate: Date, endDate: Date, activity: string) {
    let start = `0${(startDate.getMonth() + 1)}-${startDate.getDate()}-${startDate.getFullYear()}`
    let end = `0${(endDate.getMonth() + 1)}-${endDate.getDate()}-${endDate.getFullYear()}`

    return this.http.get<any[]>(`${this.uri}/activities/?user_id=${userId}&type=${activity}&start_date=${start}&end_date=${end}`, this.httpOptions)
  }

  getUser(id: string) {
    //got help from https://stackoverflow.com/questions/50203241/angular-5-to-6-upgrade-property-map-does-not-exist-on-type-observable
    return this.http.get<any>(`${this.uri}/users/${id}`, this.httpOptions)
    .pipe(map((res) => res));
  }

  getCurrentUser() {
    return this.getUser(this.userService.getCurrentUserId())
  }

  setToken(token: string) {
    this.token = token
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.token
      })
    }
  }
}