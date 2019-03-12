import { Component, HostListener } from '@angular/core';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  //https://stackoverflow.com/questions/37642589/how-can-we-detect-when-user-closes-browser/37642657
  @HostListener('window:unload', [ '$event' ])
  unloadHandler(event) {
    // if(!this.authService.rememberMe) {
      
    //   this.authService.logout();
    // }
    // else {
    //   console.log('keeping you looged in!!');
      
    // }
  }

  @HostListener('window:beforeunload', [ '$event' ])
  beforeUnloadHander(event) {
    
    
  }

  constructor(
    private authService: AuthService,
    private Router: Router
    ) {}

  loggedIn: boolean = false;
  title = 'capstone-project';


  ngOnInit() {
    this.authService.loadRememberedUser();
  }

  //if user hits logout in navbar when logged in
  logout() {
    this.authService.logout();
  }

  //to hide navbar items that are not meant to
  //be seen until user logs in
  isLoggedIn() {
    return this.authService.isLoggedIn();
  } 
  
  //returns true if the user visited the /login route
  //used to toggle login/register in nav
  isLoginRoute() {
    if(this.Router.url.includes('login')) {
      return true;
    }
  }

}
