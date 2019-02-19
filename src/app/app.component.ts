import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(
    private loginService: LoginService,
    private Router: Router
    ) {}

  loggedIn: boolean = false;
  title = 'capstone-project';

  logout() {
    console.log('logging out!');
    this.loginService.setLoggedIn(false);
    localStorage.clear();
  }

  isLoggedIn() {
    return this.loginService.isLoggedIn();
  } 
  
  isLoginRoute() {
    if(this.Router.url.includes('login')) {
      return true;
    }
  }

}
