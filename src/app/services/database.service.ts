import { Injectable } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { User } from '../models/user.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserService } from './user.service';
import { map, catchError } from 'rxjs/operators';

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

  // token:string;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.userService.getToken()
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
    //got help from https://stackoverflow.com/questions/50203241/angular-5-to-6-upgrade-property-map-does-not-exist-on-type-observable
    return this.http.get<any>(`${this.uri}/users/${id}`, this.httpOptions)
    .pipe(map((res) => res));
  }

  getCurrentUser() {
    return this.getUser(this.userService.getCurrentUserId())
  }

  // setToken(token: string) {
  //   console.log('dbService token: ' + token);
  //   this.token = token;
  // }

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