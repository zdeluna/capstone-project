/*****************************
 * Description: This is the user service file.
 * This file contains the user methods that 
 * help pass the current usr object to different 
 * components in the app.
*****************************/

import { Injectable } from '@angular/core';
import { User } from '../models/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService { 

  constructor(
  ) { }

  user: User = new User()

  setUserDetailsFromForm(form: any) {
    this.user.username = form.value.email;
    console.log(this.user.username);
    
    this.user.password = form.value.password;
  }

  // setUserDetailsFromDb(arr : Array<string>) {

  // }

  getCurrentUserId() {
    return this.user.id;
  }

  setCurrentUserId(_id : string) {
    this.user.id = _id;
  }

  setToken(token:string) {
    this.user.token = token;
  }

  getToken() {
    return this.user.token;
  }

  setUsername(username: string){
    this.user.username = username;
  }

  getUsername() {
    return this.user.username;
  }
}
