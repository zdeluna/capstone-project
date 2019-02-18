import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor() { }

  user: User = new User()

  getCurrentUser() {
    return this.user.id;
  }

  setCurrentUser(_id : string) {
    this.user.id = _id;
  }
}
