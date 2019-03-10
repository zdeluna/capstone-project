import { Injectable } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { pipeFromArray } from 'rxjs/internal/util/pipe';
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

  token:string = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVjNjg2NzYyNTdlNzVmMDAwNWFkYjcxNyJ9LCJpYXQiOjE1NTAzNDYwOTV9.WRGZo4LB21jxoJr98X6zwtxgEia8ASk69TYhn5aVGeg"
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.token
    })
  };

  addChallenge(challenge: Challenge) {
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
      let url = `${this.uri}/challenges/${id}/participants/${participants.pop()}`
      this.http.post(url, status, this.httpOptions).subscribe(() => {
        this.inviteParticipants(id, participants)
      })
    } else {
      let url = `${this.uri}/challenges/${id}/participants/${participants.pop()}`
      this.http.post(url, status, this.httpOptions)
    }
  }

  submitMessage(id: string, m: Object) {
    return this.http.post(`${this.uri}/challenges/${id}/messages`, m, this.httpOptions)
  }

  deleteMessage(cId: string, message: Post) {
    if(message.replies.length > 0) {
      let replyToDelete = message.replies.pop()
      let url = `${this.uri}/challenges/${cId}/messages/${replyToDelete.id}`
      this.http.delete(url, this.httpOptions).subscribe(() => {
        this.deleteMessage(cId, message)
      })
    } else {
      let url = `${this.uri}/challenges/${cId}/messages/${message.id}`
      return this.http.delete(url, this.httpOptions)
    }
  }

  getChallenge(id: string) {
    return this.http.get(`${this.uri}/challenges/${id}`, this.httpOptions)
  }

  getExampleChallenge() {
    return this.http.get(`${this.uri}/challenges/5c686d1315a6850006405ab1`, this.httpOptions)
  }

  getExerciseByUserDateAndActivity(userId: string, startDate: Date, activity: string) {
    //search db where user = userId startDate date >= startDate activity = activity
  }

  getUser(id: string) {
    return this.http.get(`${this.uri}/users/${id}`, this.httpOptions)
  }

  getCurrentUser() {
    return this.getUser(this.userService.getCurrentUserId())
  }

  setToken(token: string) {
    this.token = token
  }

  getUserHardCoded(id: string): User {
    let user = new User
    let users: User[] = [{
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
    },
    {
      id: "987654",
      username: "thehawk",
      firstName: "Steve",
      lastName: "Hawking",
      password: 'pw'
    }]

    users.forEach(u => {
      if(u.id === id) {
        user = u
      }
    })
    
    return user
  }
}