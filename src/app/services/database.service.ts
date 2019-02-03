import { Injectable } from '@angular/core';
import { Challenge } from '../models/challenge.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  addChallenge(challenge: Challenge) { 
    console.log(challenge)
  }

  getUser(id: string): User {
    let user = new User
    let users: User[] = [{
      id: "123456",
      username: "testUser1",
      firstName: "Test",
      lastName: "User"
    },
    {
      id: "654321",
      username: "cpie19",
      firstName: "Chris",
      lastName: "Piemonte"
    }]

    users.forEach(u => {
      if(u.id === id) {
        user = u
      }
    })

    return user
  }
}
