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

  getChallenge(id: string): Challenge {
    let c: Challenge = {
      id: id,
      name: "Bike Mile Challenge",
      participants: ["123456", "654321", "987654"],
      startDate: new Date(2019, 1, 1), //Feb 1 - 0 indexed
      activity: "bike",
      measurement: "miles",
      duration: "month",
      invitees: ["123456", "654321", "987654"]
    }
    return c
  }

  getExerciseByUserDateAndActivity(userId: string, startDate: Date, activity: string) {
    //search db where user = userId startDate date >= startDate activity = activity
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
    },
    {
      id: "987654",
      username: "thehawk",
      firstName: "Steve",
      lastName: "Hawking"
    }]

    users.forEach(u => {
      if(u.id === id) {
        user = u
      }
    })

    return user
  }
}
