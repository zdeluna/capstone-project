/*****************************
 * Description: This is the home component file.
 * This file contains all the logic controlling
 * the /home view.
*****************************/

import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { UserService } from '../services/user.service';
// import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor( 
    private userService: UserService,
    // private authService: AuthService
    ) {}

  categories: Object = []
  user: User = new User
  date = new Date();
  
  ngOnInit() {
    //if logged in then load the user details 
    //from the user service
    this.user = this.userService.user;
    console.log(this.user.username);
    
    // if(!this.user.username)
    
      // this.authService.loadRememberedUser();

    //routes that icons link to in home page 
    //below greeting and date
    this.categories = [
    {
      value: 'profile', 
      location: "assets/flat-icons/user.svg", 
      view: 'Profile'
    },
    {
      value: "search",  
      location: "assets/flat-icons/magnifier.svg", 
      view: 'Search'
    },
    {
      value: "challenges", 
      location: "assets/flat-icons/podium.svg", 
      view: 'Challenges'
    },
    {
      value: "activity-minutes", 
      location: "assets/flat-icons/check-list.svg", 
      view: 'Enter Activity Minutes'
    }
    ];
  }
}
