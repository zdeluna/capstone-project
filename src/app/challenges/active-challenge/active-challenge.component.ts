import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Challenge } from '../../models/challenge.model';
import { DatabaseService } from '../../services/database.service';
import { DurationService } from 'src/app/services/duration.service';
import { User } from 'src/app/models/user.model';
import { SortService } from 'src/app/services/sort.service';
import { UserService } from 'src/app/services/user.service';

export interface Leaderboard {
  user: User;
  activityTotal: number;
}

@Component({
  selector: 'app-active-challenge',
  templateUrl: './active-challenge.component.html',
  styleUrls: ['./active-challenge.component.css']
})
export class ActiveChallengeComponent implements OnInit {

  constructor(
    private location: Location, 
    private route: ActivatedRoute, 
    private dbService: DatabaseService, 
    private durationService: DurationService, 
    private sortService: SortService,
    private userService: UserService
    ) { }

  challengeIsOver = false
  user: User = new User
  challenge = new Challenge
  currentDays: number
  totalDays: number
  progress: number
  participants: Leaderboard[] = []
  sortedParticipants: Leaderboard[] = []
  endDate: Date = new Date()

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.dbService.getChallenge(params.get('id')).subscribe(res => {
        this.challenge.name = res['name']
        this.challenge.activity = res['activity']
        this.challenge.duration = res['duration']
        this.challenge.measurement = res['measurement']
        this.challenge.participants = res['participants']
        this.challenge.invitees = res['pending_participants']
        this.challenge.startDate = new Date(res['start_date'])
        
        this.getParticipants(this.challenge.participants)
        this.currentDays = this.durationService.getCurrentDays(this.challenge.startDate)
        this.totalDays = this.durationService.getTotalDays(this.challenge.startDate, this.challenge.duration)
        this.progress = this.getProgress(this.currentDays, this.totalDays)
        this.endDate = this.durationService.getEndDate(this.challenge.startDate, this.challenge.duration)
        this.challengeIsOver = this.checkIfChallengeIsOver()
      })
    })
    this.dbService.getCurrentUser().subscribe(res => {
      this.user.id = this.userService.getCurrentUser()
      this.user.username = res['username']
      this.user.firstName = res['first_name']
      this.user.lastName = res['last_name']
      this.user.password = res['password']
    })
  }

  getParticipants(participants: Object[]) {
    participants.forEach(participant => {
      this.dbService.getUser(participant['user_id']).subscribe(res => {
        let user1: User = {
          id: res['_id'],
          username: 'piemo',
          firstName: 'Chris',
          lastName: 'Piemonte',
          password: 'pw'
        }
        let user2: User = {
          id: res['_id'],
          username: 'the_hawk',
          firstName: 'Steve',
          lastName: 'Hawking',
          password: 'pw'
        }
        let user3: User = {
          id: res['_id'],
          username: 'sparky',
          firstName: 'Matei',
          lastName: 'Zaharia',
          password: 'pw'
        }
        let user4: User = {
          id: res['_id'],
          username: 'mask_man',
          firstName: 'Paulo',
          lastName: 'Dybala',
          password: 'pw'
        }
        let user5: User = {
          id: res['_id'],
          username: 'LookItUp',
          firstName: 'Larry',
          lastName: 'Paige',
          password: 'pw'
        }
        let user6: User = {
          id: res['_id'],
          username: 'brinsanity',
          firstName: 'Sergey',
          lastName: 'Brin',
          password: 'pw'
        }
        let user7: User = {
          id: res['_id'],
          username: 'deerhunter',
          firstName: 'Jon',
          lastName: 'Doe',
          password: 'pw'
        }
        let user8: User = {
          id: res['_id'],
          username: 'deerhuntress',
          firstName: 'Jane',
          lastName: 'Doe',
          password: 'pw'
        }
        let user9: User = {
          id: res['_id'],
          username: 'blazin',
          firstName: 'Blaise',
          lastName: 'Matuidi',
          password: 'pw'
        }
        let user10: User = {
          id: res['_id'],
          username: 'crimson',
          firstName: 'David',
          lastName: 'Malan',
          password: 'pw'
        }
        let user11: User = {
          id: res['_id'],
          username: 'italian_tower',
          firstName: 'Giorgio',
          lastName: 'Chiellini',
          password: 'pw'
        }
        let user12: User = {
          id: res['_id'],
          username: 'cr7',
          firstName: 'Cristiano',
          lastName: 'Ronaldo',
          password: 'pw'
        }

        let p1: Leaderboard = {
          user: user1,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p2: Leaderboard = {
          user: user2,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p3: Leaderboard = {
          user: user3,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p4: Leaderboard = {
          user: user4,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p5: Leaderboard = {
          user: user5,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p6: Leaderboard = {
          user: user6,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p7: Leaderboard = {
          user: user7,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p8: Leaderboard = {
          user: user8,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p9: Leaderboard = {
          user: user9,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p10: Leaderboard = {
          user: user10,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p11: Leaderboard = {
          user: user11,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        let p12: Leaderboard = {
          user: user12,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        this.participants.push(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12)
        this.sortedParticipants = this.sortService.sortByActivityTotal(this.participants)
      })
    })
  }

  getProgress(currentDays: number, totalDays: number) {
    return Math.ceil((currentDays / totalDays) * 100)
  }

  goBack(): void {
    this.location.back()
  }

  checkIfChallengeIsOver() {
    //return new Date() > this.endDate
    return false
  }
}