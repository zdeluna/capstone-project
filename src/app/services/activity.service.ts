import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Activity } from '../models/activity.model';
import { DatabaseService } from '../services/database.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private _http : HttpClient,
    private _db : DatabaseService,
    private _user : UserService
  ) { }

  _url = 'https://capstone-wazn.appspot.com/api/activities/';
  token = this._db.token; //token set here
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Bearer ' + this.token
    })
  }

  activity: Activity = new Activity();
 

  //creates new activity
  sendActivity() { 
    console.log('token used to create new activity' + this.token);
    console.log('local activity object about to be sent' + this.activity);
    return this._http.post<any>(this._url, this.activity, this.httpOptions);
  }

  //replace gets activities
  getUserActivities() {

    //create query for url
    let type = 'Rowing';
    let userID: String = this._user.getCurrentUserId();
    console.log('user id to get activity: ' + userID);
    
    //change to date picker later, hardcoded for now
    let startDate = '2019/3/3';
    let endDate = '2019/31/3';

    //build url
    this._url = 
      this._url + `?user_id=${userID}&type=${type}&start_date=${startDate}&end_date=${endDate}`;

    this.token = this._db.token; //shouldn't need this put using for now

    console.log('full url used to get activities: ' + this._url);
    console.log('token used to get activities: ' + this.token);
    
    //this is the Get request to get activities
    return this._http.get(this._url, this.httpOptions);
  }

  //fills the local object from the add activity form
  fillActivity(activity: Activity) {
    this.activity = activity;
    console.log('Service activity object: ' + JSON.stringify(this.activity));
    console.log('Activity argument object passed in: ' + JSON.stringify(activity));
  }

}
