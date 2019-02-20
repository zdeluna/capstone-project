/*****************************
 * Description: This is the home component file.
 * This file contains all the logic controlling
 * the /home view.
*****************************/

import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Router } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ProfileComponent } from '../profile/profile.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  constructor(
    private router: Router, 
    private dbService: DatabaseService,
    private userService: UserService,
    private authService: AuthService
    ) {}

  categories: Object = []
  user: User = new User
  date = new Date();
  
  ngOnInit() {

    //if logged in then load the user details from the user service
    if(this.authService.isLoggedIn()) {
      this.dbService.getUser(this.userService.getCurrentUser())
      .subscribe(
        res => {
          this.user.username = res['username']; //fill user details here
        }
      );

      //routes icons link to in home page below greeting and date
      this.categories = [
        {value: "profile", location: "assets/flat-icons/user.svg", component: ProfileComponent, view: 'Profile'},
        {value: "search",  location: "assets/flat-icons/magnifier.svg", view: 'Search'},
        {value: "challenges", location: "assets/flat-icons/podium.svg", view: 'Challenges'},
        {value: "activity-minutes", location: "assets/flat-icons/check-list.svg", view: 'Enter Activity Minutes'}
      ];
    }

    //if user somehow here but not logged in,
    //call logout which sets flags and clears local storage,
    //then link back to login page
    else { 
      this.authService.logout();
      this.router.navigate(['/login']);
    }
  }

}
