import { Component } from '@angular/core';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private _LoginService: LoginService,
              private Router: Router) {}
  loggedIn: boolean = false;
  // login_toggled: boolean = false;
  title = 'capstone-project';

  logout() {
    console.log('logging out!');
    
    this._LoginService.setLoggedOut();
  }

  isLoggedIn() {
    return this._LoginService.isLoggedIn();
  } 
  
  isLoginRoute() {
    if(this.Router.url.includes('login')) {
     
      return true;
    }
    return false;
  }

}
