import { Component, OnInit, Input } from '@angular/core';
import { Leaderboard } from '../active-challenge/active-challenge.component';

@Component({
  selector: 'app-completed-challenge',
  templateUrl: './completed-challenge.component.html',
  styleUrls: ['./completed-challenge.component.css']
})
export class CompletedChallengeComponent implements OnInit {

  constructor() { }

  @Input() sortedParticipants: Leaderboard[]

  ngOnInit() {
  }

}
