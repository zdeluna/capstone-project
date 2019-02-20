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

export class AuthService {

  login_url = 'https://capstone-wazn.appspot.com/api/login';
  signup_url = 'https://capstone-wazn.appspot.com/api/signup';
  
  constructor(
    private _http: HttpClient,
    private userService: UserService,
    private router: Router,
    private dbService: DatabaseService
    ) { }

  localStatus: string = localStorage.getItem('loggedIn');
  loggedIn: boolean = JSON.parse(this.localStatus || 'false');
  rememberMe: boolean = false;

  //signs user up if no user account by posting 
  //to api/signup. Subscriber logic in registration component.
  signup(user: User) {
    return this._http.post<any>(this.signup_url, user);
  }

  //logs user into application by posting to /api/login.
  //when data returns, route to home or log error. If
  //user hits remember me checkbox then data will be stored 
  //to browser local storage
  login(user: User) {
    return this._http.post<any>(this.login_url, user)
    .subscribe (
      data => {
        //this logic is here and not in login.component
        //because logging in directly did not work
        //from registration that way, does with it here
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
       //TODO: show errors on screen instead of console
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

  //logs out of the application
  logout(): void {
    console.log('logging out!');
    this.setLoggedIn(false);
    localStorage.clear();
  }
}
