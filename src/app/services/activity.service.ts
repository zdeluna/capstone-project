import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Activity } from '../models/activity.model';
import { DatabaseService } from '../services/database.service';
import { UserService } from './user.service';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(
    private _http : HttpClient,
    private _user : UserService
  ) { }

  _url: string = 'https://capstone-wazn.appspot.com/api/activities/';
  token: string;
  httpOptions = {}
  activity: Activity = new Activity();


  //sets token
  getHeaders(token: string) {
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + token
      })
    }
    return httpOptions;
  }
 

  //creates new activity
  sendActivity() { 
    let headers = this.getHeaders(this._user.getToken())
    console.log('headers about to be sent' + headers);
    console.log('local activity object about to be sent' + this.activity);
    return this._http.post<any>(this._url, this.activity, headers);
  }


  //replace gets activities
  getUserActivities() {

    //create query for url
    let userID = this._user.getCurrentUserId();
    
    //change to date picker later, hardcoded for now
    let startDate = '2019-3-1';
    let endDate = '2019-3-31';

    // build url
    let type = "Running"
    let url = 
      this._url + `?user_id=${userID}&type=${type}&start_date=${startDate}&end_date=${endDate}`;

    //set token for auth
    let headers = this.getHeaders(this._user.getToken())

    console.log('user id to get activity: ' + userID);
    // console.log('full url used to get activities: ' + url);

    let running = this._http.get(url, headers)
    type = "Biking"
    url = 
      this._url + `?user_id=${userID}&type=${type}&start_date=${startDate}&end_date=${endDate}`;
    let biking = this._http.get<Activity>(url, headers);

    // console.log(join);
    

    //this is the Get request to get activities
    return forkJoin([running, biking]);
  }


  //fills the local object from the add activity form
  fillActivity(activity: Activity) {
    this.activity = activity;
    console.log('Service activity object: ' + JSON.stringify(this.activity));
    console.log('Activity argument object passed in: ' + JSON.stringify(activity));
  }

}
