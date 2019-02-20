/*****************************
 * Description: This is the user service file.
 * This file contains the get and set current user 
 * methods that help pass the current usr object 
 * to different components in the app
*****************************/

import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService { //token?

  constructor() { }

  user: User = new User()

  getCurrentUser() {
    return this.user.id;
  }

  setCurrentUser(_id : string) {
    this.user.id = _id;
  }
}
