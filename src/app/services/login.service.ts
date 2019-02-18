import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  _url = 'https://capstone-wazn.appspot.com/api/login';
  constructor(private _http: HttpClient) { }

  loggedIn: boolean = false;

  login(user: User) {
    // console.log(user);
    // console.log(JSON.stringify(user));
    // console.log('In login function!');
    return this._http.post<any>(this._url, user);
  }

  setLoggedIn() {
    this.loggedIn = true;
  }

  setLoggedOut() {
    this.loggedIn = false;
  }

  isLoggedIn() {
    return this.loggedIn;
  }


}
