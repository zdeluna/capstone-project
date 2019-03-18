import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Activity } from '../models/activity.model';
import { UserService } from './user.service';
import { forkJoin} from 'rxjs';

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
  getUserActivities(start_date: Date, end_date: Date) {

    //create query for url
    let userID = this._user.getCurrentUserId();
    
    // console.log('start date: ' + start_date);
    // console.log('end date: ' + end_date)

    //set token for auth
    let headers = this.getHeaders(this._user.getToken())

    console.log('user id to get activity: ' + userID);
    // console.log('full url used to get activities: ' + url);

    let join = []
    for(let activity of this._user.user.activity_types) {
      let url = this._url + `?user_id=${userID}&type=${activity.name}&start_date=${start_date}&end_date=${end_date}`;
      let req = this._http.get(url, headers);
      join.push(req)
    }
  
    // console.log(join);
  
    //this is the Get request to get activities
    //help from https://coryrylan.com/blog/angular-multiple-http-requests-with-rxjs
    return forkJoin(join);
  }

  //fills the local object from the add activity form
  fillActivity(activity: Activity) {
    this.activity = activity;
    console.log('Service activity object: ' + JSON.stringify(this.activity));
    console.log('Activity argument object passed in: ' + JSON.stringify(activity));
  }

}
