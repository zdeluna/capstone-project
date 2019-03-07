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
    ) { }

    //not sure these are needed
    //I think setting to false is what to do
  localStatus: string = localStorage.getItem('loggedIn');
  loggedIn: boolean = JSON.parse(this.localStatus || 'false');
  rememberMe: boolean = false;

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
  loadRememberedUser(): void {
    console.log('Checking to see if user was remembered!!');
    
    let remembered: string = localStorage.getItem('loggedIn');
    if(this.isLoggedIn() && remembered) { 
      this.dbService.getUser(JSON.parse(remembered).id)
      .subscribe(
        data => {
          //here you would fill the user with more details
          console.log(data);
          
          console.log('remembered token ' + data['token']);
          this.dbService.setToken(data['token']);
          this.userService.user.username = data['username'];
          this.userService.user.id = data['_id'];
        },
        error => {
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
  userLoggedIn(data: any) {
    console.log('Login success', data);

    console.log('loggin in token ' + data['token']);
    
    this.dbService.setToken(data['token']);
    this.userService.setCurrentUserId(data['user_id']);
    this.setLoggedIn(true); 

    if(this.rememberMe) {
      localStorage.setItem('loggedIn', 
      JSON.stringify({ val: 'true', id: data['user_id']}));
    }

    this.router.navigate(['/home']);
  }
}
