import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Challenge } from 'src/app/models/challenge.model';
import { DatabaseService } from 'src/app/services/database.service';

@Component({
  selector: 'app-challenges-page',
  templateUrl: './challenges-page.component.html',
  styleUrls: ['./challenges-page.component.css']
})
export class ChallengesPageComponent implements OnInit {

  constructor(private location: Location, private dbService: DatabaseService) { }

  challengeId: Challenge
  options = [
    {value: `${this.challengeId}`, location: "assets/flat-icons/magnifier.svg", view: "View Challenge"},
    {value: "create", location: "assets/flat-icons/add.svg", view: "Create Challenge"}
  ]

  ngOnInit() {
    this.dbService.getExampleChallenge().subscribe(res => {
      this.challengeId = res['_id']
      this.options[0] = {value: `${this.challengeId}`, location: "assets/flat-icons/magnifier.svg", view: "View Challenge"}
    })
  }

  goBack(): void {
    this.location.back()
  }
}
