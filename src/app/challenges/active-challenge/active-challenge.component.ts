import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Challenge } from '../../models/challenge.model';
import { DatabaseService } from '../../services/database.service';
import { DurationService } from 'src/app/services/duration.service';
import { User } from 'src/app/models/user.model';
import { SortService } from 'src/app/services/sort.service';

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

  constructor(private location: Location, private route: ActivatedRoute, private dbService: DatabaseService, private durationService: DurationService, private sortService: SortService) { }

  challenge = new Challenge
  currentDays: number
  totalDays: number
  progress: number
  participants: Leaderboard[] = []
  sortedParticipants: Leaderboard[] = []
  endDate: Date = new Date()

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this. challenge = this.dbService.getChallenge(params.get('id'))
      //All of these must come after subscription
      this.getParticipants(this.challenge.participants)
      this.currentDays = this.durationService.getCurrentDays(this.challenge.startDate)
      this.totalDays = this.durationService.getTotalDays(this.challenge.startDate, this.challenge.duration)
      this.progress = this.getProgress(this.currentDays, this.totalDays)
      this.endDate = this.durationService.getEndDate(this.challenge.startDate, this.challenge.duration)
      // -----------------------------------------
    })
  }

  getParticipants(ids: string[]) {
    ids.forEach(id => {
      let p: Leaderboard = {
        user: this.dbService.getUser(id),
        activityTotal: Math.ceil(Math.random() * (150 - 0))
      }
      this.participants.push(p)
      this.sortedParticipants = this.sortService.sortByActivityTotal(this.participants)
    })
  }

  getProgress(currentDays: number, totalDays: number) {
    return Math.ceil((currentDays / totalDays) * 100)
  }

  goBack(): void {
    this.location.back()
  }
}
