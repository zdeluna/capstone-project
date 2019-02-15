import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  _url = 'https://capstone-wazn.appspot.com/api/signup';
  constructor(private _http: HttpClient) { }

  signup(user: User) {
    // console.log(user);
    // console.log(JSON.stringify(user));
    // console.log('In signup function!');
    return this._http.post<any>(this._url, user);
  }
}
