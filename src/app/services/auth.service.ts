/*****************************
 * Description: This is the login service file.
 * This file contains all the methods related
 * to logging in a user to the application.
*****************************/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserService } from './user.service';
import { Router } from '@angular/router';
import { DatabaseService } from './database.service';
import { ActivityService } from './activity.service';

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
    private dbService: DatabaseService,
    private activityService: ActivityService,
    ) { }

    //not sure these are needed
    //I think setting to false is what to do
  localStatus: string = localStorage.getItem('loggedIn');
  loggedIn: boolean = JSON.parse(this.localStatus || 'false');
  rememberMe: boolean = false;
  token: string;

  //signs user up if no account by posting to api/signup
  //subscriber logic in registration component
  signup() {
    return this._http.post<any>(
      this.signup_url, 
      this.userService.user
      );
  }

  //logs user into application by posting to /api/login
  //subscriber logic in registration and login component
  login() {
    console.log('loggin in!');
    return this._http.post<any>(
      this.login_url, this.userService.user
      );
  }

  //sets user logged in status
  setLoggedIn(val: boolean) {
    this.loggedIn = val;
  }

  //returns if user is logged in
  //cuurently checking in local storage 
  //if nothing there then return local variable
  isLoggedIn(): boolean {
    let localStatus: string = JSON.parse(
      localStorage.getItem('loggedIn')
    );
    let userStatus: boolean;
    try { 
      userStatus = JSON.parse(localStatus).val;
    } //if localstatus null
    catch {
      userStatus = this.loggedIn;
    }
    return  userStatus;
  }

  //if user hit remember me, sets current user
  //and goes to home page skipping login
  //cant put in function with stuff from 
  //log user in because this may happen when 
  //not logging in like reload, also return
  //fields not exactly the same
  loadRememberedUser(): void {
    console.log('Checking to see if user was remembered!!');
    
    //either somethings in local storage or not and null
    let remembered: string = localStorage.getItem('loggedIn');

    if(this.isLoggedIn() && remembered) { 
      this.dbService.getUser(JSON.parse(remembered).id)
      .subscribe(
        data => { 
          //should block until this is done or make some things child components
          console.log('user was remembered');

          this.userService.setUsername(data['username']); 
          this.userService.setCurrentUserId(data['_id']);
          
          //here set token for session
          this.token = JSON.parse(remembered).token
          this.userService.setToken(this.token);

          console.log('loaded: ' + JSON.stringify(this.userService.user));
        },
        error => {
          console.log('tried to load remembered user but loggedIn false/null!');
          console.log(error);
          this.logout();
          this.router.navigate(['/login']);
        }
      )
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

  //gets app ready after user logs in
  logUserIn(data: any) {

    console.log('Login success', data);
    console.log('loggin in token ' + data['token']);
    
    //these always get set when logging in
    // this.dbService.setToken(data['token']); //neeed data token in case user logs in manually
    this.fillUserObjectFromDb(data);
    this.setLoggedIn(true); 

    //puts id and token in local storage if user wants remembered
    //so that the user can be re-loaded after exit
    if(this.rememberMe) {
      localStorage.setItem(
        'loggedIn', 
        JSON.stringify({ 
          val: 'true', 
          id: data['user_id'],
          token: data['token']
        })
      );
    }

    console.log('user loggedIn: ' + 
    JSON.stringify(this.userService.user));
    

    this.router.navigate(['/home']);
  }

  fillUserObjectFromDb(data: any) {
    console.log('filling user object');
    this.userService.setToken(data['token']);
    this.userService.setCurrentUserId(data['user_id']);
  }
}
