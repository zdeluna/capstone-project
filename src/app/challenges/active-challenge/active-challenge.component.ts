import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Challenge } from '../../models/challenge.model';
import { DatabaseService } from '../../services/database.service';
import { DurationService } from 'src/app/services/duration.service';
import { User } from 'src/app/models/user.model';
import { SortService } from 'src/app/services/sort.service';
import { UserService } from 'src/app/services/user.service';
import { Post } from 'src/app/models/post.model';
import { CdkColumnDef } from '@angular/cdk/table';

export interface Leaderboard {
  user: User;
  activityTotal: number;
}

@Component({
  selector: 'app-active-challenge',
  templateUrl: './active-challenge.component.html',
  styleUrls: ['./active-challenge.component.css'],
  providers: [CdkColumnDef]
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
  pendingParticipants: Leaderboard[] = []
  sortedParticipants: Leaderboard[] = []
  endDate: Date = new Date()
  replies = []

  ngOnInit() {
    this.participants = []
    this.pendingParticipants = []
    this.sortedParticipants = []
    this.replies = []

    this.route.paramMap.subscribe(params => {
      this.dbService.getChallenge(params.get('id')).subscribe(res => {
        this.challenge.id = res['_id']
        this.challenge.name = res['name']
        this.challenge.activity = res['activity']
        this.challenge.duration = res['duration']
        this.challenge.measurement = res['measurement']
        this.challenge.participants = res['participants']
        this.challenge.pendingParticipants = res['pending_participants']
        this.challenge.invitees = res['pending_participants']
        this.challenge.startDate = new Date(res['start_date'])
        this.challenge.messages = []
        
        this.setMessages(res['messages'])
        this.getParticipants(this.challenge.participants)
        this.getPendingParticipants(this.challenge.pendingParticipants)
        this.currentDays = this.durationService.getCurrentDays(this.challenge.startDate)
        this.totalDays = this.durationService.getTotalDays(this.challenge.startDate, this.challenge.duration)
        this.progress = this.getProgress(this.currentDays, this.totalDays)
        this.endDate = this.durationService.getEndDate(this.challenge.startDate, this.challenge.duration)
        this.challengeIsOver = this.checkIfChallengeIsOver()
      })
    })
    this.dbService.getCurrentUser().subscribe(res => {
      this.user.id = this.userService.getCurrentUserId()
      this.user.username = res['username']
      this.user.firstName = res['first_name']
      this.user.lastName = res['last_name']
      this.user.password = res['password']
      this.user.friends = res['friends']
    })
  }

  getParticipants(participants: string[]) {
    participants.forEach(participant => {
      this.dbService.getUser(participant).subscribe(res => {
        let user: User = {
          id: res['_id'],
          username: res['username'],
          password: res['password'],
          firstName: "first",
          lastName: "last"
        }

        this.dbService.getExerciseByUserDateAndActivity(user.id, this.challenge.startDate, this.challenge.activity)
          .subscribe(res => {
            console.log(res)
            //add all activities

            let p: Leaderboard = {
              user: user,
              activityTotal: Math.ceil(Math.random() * (150 - 0))
            }

            this.participants.push(p)
            this.sortedParticipants = this.sortService.sortByActivityTotal(this.participants)
          })
      })
    })
  }

  getPendingParticipants(participants: string[]) {
    participants.forEach(participant => {
      this.dbService.getUser(participant['user']).subscribe(res => {
        let user: User = {
          id: res['_id'],
          username: res['username'],
          password: res['password'],
          firstName: "first",
          lastName: "last"
        }

        let p: Leaderboard = {
          user: user,
          activityTotal: Math.ceil(Math.random() * (150 - 0))
        }
        this.pendingParticipants.push(p)
      })
    })
  }

  setMessages(messages) {
    if(messages.length > 0) {
      messages.forEach(m => {
        this.dbService.getUser(m['sender']).subscribe(res => {
          let p: Post = {
            id: m['_id'],
            parent: m['reply_to'],
            message: m['content'],
            date: new Date(m['createdAt']),
            user: res['username'],
            replies: []
          }
          this.setReplies(p)
          
          if(!p.parent) {
            this.challenge.messages.push(p)
          } else {
            this.replies.push(p)
          }
        })
      })
    }
  }

  setReplies(m: Post) {
    let id = m.parent
    this.challenge.messages.forEach(message => {
      if(message.id == id) {
        message.replies.push(m)
      }
    })
    this.replies.forEach(r => {
      if(r.id == id) {
        r.replies.push(m)
      }
    })
  }

  getProgress(currentDays: number, totalDays: number) {
    return Math.ceil((currentDays / totalDays) * 100)
  }

  goBack(): void {
    this.location.back()
  }

  checkIfChallengeIsOver() {
    // return new Date() > this.endDate
    return false
  }
}