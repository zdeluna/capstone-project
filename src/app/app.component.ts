import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private authService: AuthService,
    private Router: Router
    ) {}

  loggedIn: boolean = false;
  title = 'capstone-project';

  logout() {
    this.authService.logout();
  }

  isLoggedIn() {
    return this.authService.isLoggedIn();
  } 
  
  isLoginRoute() {
    if(this.Router.url.includes('login')) {
      return true;
    }
  }

}
