/*****************************
 * Description: This is the login service file.
 * This file contains all the methods related
 * to logging in a user to the application.
*****************************/

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

  localStatus: string = localStorage.getItem('loggedIn');
  loggedIn: boolean = JSON.parse(this.localStatus || 'false');
  rememberMe: boolean = false;

  //logs user into application by posting to /api/login
  //when data returns, route to home or log error. If
  //user hit remember me checkbox then data will be stored 
  //to local storage
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
            JSON.stringify({ val: 'true', id: data['user_id']}));
          }
          this.router.navigate(['/home']);
        },
        error => console.log('Error on login!', error)
      );
  }

  //sets user logged in status
  setLoggedIn(val: boolean) {
    this.loggedIn = val;
  }

  //returns if user is logged in
  isLoggedIn(): boolean {
    let localStatus: string = JSON.parse(
      localStorage.getItem('loggedIn')
    );
    let userStatus: boolean;
    try { //cannot get val of null
      userStatus = JSON.parse(localStatus).val;
    }
    catch {
      userStatus = this.loggedIn;
    }
    return  userStatus;
  }

  //if user hit remember me, sets current user
  //and goes to home page skipping login
  loadRememberedUser(): void {
    let remembered: string = localStorage.getItem('loggedIn');
    if(this.isLoggedIn() && remembered) { 
      this.userService.setCurrentUser(
        JSON.parse(remembered).id
      );
      this.router.navigate(['/home']);
    }
  }

  //sets remember me varaible that is used
  //in login function to determine if data 
  //should be saved to memory
  setRememberMe(val : boolean) {
    this.rememberMe = val;
  }
}
