import { Injectable } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';

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

  //ids: 5c6602291ac2320005d2f15a, 5c65fffc1ac2320005d2f158
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
    return this.getUser(this.userService.getCurrentUser())
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