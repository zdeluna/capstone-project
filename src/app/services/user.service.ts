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

  setUserDetails(form: any) {
    this.user.username = form.value.email;
    this.user.password = form.value.password;
  }

  getCurrentUserId() {
    return this.user.id;
  }

  setCurrentUserId(_id : string) {
    this.user.id = _id;
  }
}
