import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';
// import { ActivityService } from 'src/app/services/activity.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {

  constructor(
    private _userService: UserService,
    // private _activityService: ActivityService,
    private _dbService: DatabaseService
  ) { }

  new_profile: User;
  age : number | string;
  edit_btn_disabled: boolean = true;
  edit: boolean = false;
  user: User = new User;

  ngOnInit() {

    this.user = this._userService.user;

    //deep copy object so edit input doesn't bind to both objects
    this.new_profile = {...this.user}; 
      //if values are null 
      if(!this._userService.user.location)
      this.user.location = 'No location'
    if(!this._userService.user.firstName)
      this.user.firstName = 'No First Name'
    if(!this._userService.user.lastName)
      this.user.lastName = 'No Last Name'
    if(!this._userService.user.dateOfBirth)
      this.age = 'No Date Of Birth'
  }

  editProfile() {
    this.edit = true;
    this.edit_btn_disabled = false;
  }

  saveProfile() {
    this.edit = false;
    this.edit_btn_disabled = true;
    if(JSON.stringify(this.new_profile) != JSON.stringify(this.user)) {
      console.log('Editing Profile: ');
      this._dbService.setToken(this.user.token)
      this._dbService.editUser(this.new_profile, this.user.id)
      .subscribe(
        editData => {
          console.log('new user' + JSON.stringify(editData));
          this._dbService.getUser(this.user.id)
          .subscribe(
            getUserData => {
              this._userService.setUserDataFromDb(getUserData);
              console.log(this._userService.user);
              this.user = {...this._userService.user} 
              var today = new Date();
              var birthDate = new Date(this.user.dateOfBirth);
              this.age = today.getFullYear() - birthDate.getFullYear();
              var m = today.getMonth() - birthDate.getMonth();
              if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                  this.age--;
              }
              console.log('User age is: ' + this.age);
              
            },
            getUserError => {
              console.log(getUserError);
            }
          )
        },
        editError => console.log(editError)
      );
    }
  }

}