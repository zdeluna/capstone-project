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

  challenge: Challenge
  options = [
    {value: "", location: "assets/flat-icons/magnifier.svg", view: "View Challenge"},
    {value: "create", location: "assets/flat-icons/add.svg", view: "Create Challenge"}
  ]

  ngOnInit() {
  }

  goBack(): void {
    this.location.back()
  }
}
