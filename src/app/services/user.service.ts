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

  setLocation(location: string) {
    this.user.location = location;
  }
  setFirstName(first: string) {
    this.user.firstName = first;
  }
  setLastName(last: string) {
    this.user.lastName = last;
  }
  setDOB(dob:Date) {
    this.user.dateOfBirth = dob;
  }

  setUserDataFromDb(data: any) {
    this.setUsername(data['username']); 
    this.setLocation(data['location']); 
    this.setFirstName(data['firstName']);
    if(!this.user.firstName) 
      this.setFirstName(data['first_name'])
    this.setLastName(data['lastName']);
    if(!this.user.lastName)  
      this.setLastName(data['last_name']);
    this.setCurrentUserId(data['_id']);
    this.setDOB(data['dateOfBirth']);
    if(!this.user.dateOfBirth)
      this.setDOB(data['date_of_birth']);
  }
}
