import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { ProfileComponent } from '../profile/profile.component';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';

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
    private loginService: LoginService
    ) {}

  categories: Object = []
  user: User = new User
  date = new Date();
  
  ngOnInit() {
    if(this.loginService.isLoggedIn()) {
      this.dbService.getUser(this.userService.getCurrentUser())
      .subscribe(
        res => {
          this.user.username = res['username']; //fill user details here
        }
      );

      this.categories = [
      {value: "profile", location: "assets/flat-icons/user.svg", component: ProfileComponent, view: 'Profile'},
      {value: "search",  location: "assets/flat-icons/magnifier.svg", view: 'Search'},
      {value: "challenges", location: "assets/flat-icons/podium.svg", view: 'Challenges'},
      {value: "activity-minutes", location: "assets/flat-icons/check-list.svg", view: 'Enter Activity Minutes'}
      ];
    }

    else {
      this.router.navigate(['/login']);
    }
  }

}
