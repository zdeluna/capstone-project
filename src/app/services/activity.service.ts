import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Activity } from '../models/activity.model';
import { DatabaseService } from '../services/database.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  _url = 'https://capstone-wazn.appspot.com/api/activities/';

  constructor(
    private _http : HttpClient,
    private _db : DatabaseService,
    private _user : UserService
  ) { }

  token = this._db.token;
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.token
    })
  }

  activity: Activity = new Activity();

  sendActivity() {
    console.log(this.token);
    console.log(this.activity);
    
    return this._http.post<any>(this._url, this.activity, this.httpOptions);
  }

  getUserActivities() {
    console.log(this._url + this._user.user.id);
    
    return this._http.get(
      this._url + this._user.getCurrentUserId(),
      this.httpOptions
      );
  }

  fillActivity(activity: Activity) {
    this.activity = activity;
    console.log('Service activity: ' + JSON.stringify(this.activity));
    console.log('activity passed in: ' + JSON.stringify(activity));
  }

}
