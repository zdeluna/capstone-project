import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  _url = 'https://capstone-wazn.appspot.com/api/login';
  
  constructor(
    private _http: HttpClient,
    private userService: UserService,
    private router: Router,
    private dbService: DatabaseService
    ) { }

  loggedIn: boolean 
  = JSON.parse(localStorage.getItem('loggedIn') || 'false');

  rememberMe: boolean = false;

  login(user: User) {
    return this._http.post<any>(this._url, user)
    .subscribe (
      data => {
        console.log('Login success', data);
        this.dbService.setToken(data['token']);
        this.userService.setCurrentUser(data['user_id']);
        this.setLoggedIn(true); 
        if(this.rememberMe) {
          localStorage.setItem('loggedIn', 
            JSON.stringify({ val: 'true', id: data['user_id'] 
          }));
        }
        this.router.navigate(['/home']);
      },
      error => console.log('Error on login!', error)
      );
  }

  setLoggedIn(val: boolean) {
    this.loggedIn = val;
    
  }

  isLoggedIn():boolean {
    try {
      let x = JSON.parse(localStorage.getItem('loggedIn')).val;
      return  x;
    }
    catch {
      return this.loggedIn;
    }
  }

  checkUserSession():void {
    let sessionStatus = localStorage.getItem('loggedIn');
    if(this.isLoggedIn() && sessionStatus) { //logged in and data in local
      console.log(JSON.parse(sessionStatus).id);
      this.userService.setCurrentUser(
        JSON.parse(sessionStatus).id
      );
      this.router.navigate(['/home']);
    }
  }

  setRememberMe( val : boolean ) {
    this.rememberMe = val;
  }

}
