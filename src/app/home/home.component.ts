import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  categories: Object = []
  user: User = new User
  
  date = new Date();
  
  ngOnInit() {
    this.user.firstName = "Robert";
    this.categories = [
    {value: "profile", location: "assets/flat-icons/user.svg", view: 'Profile'},
    {value: "search",  location: "assets/flat-icons/magnifier.svg", view: 'Search'},
    {value: "challenges/create", location: "assets/flat-icons/podium.svg", view: 'Challenges'},
    {value: "activity-minutes", location: "assets/flat-icons/check-list.svg", view: 'Enter Activity Minutes'}
    ];
    
  }
  

}
