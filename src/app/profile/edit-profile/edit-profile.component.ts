import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user.model';
import { DatabaseService } from 'src/app/services/database.service';
import { UserService } from 'src/app/services/user.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {

  constructor(
    private _userService: UserService,
    private _dbService: DatabaseService,
  ) { }

  new_profile: User;
  age : number | string;
  edit_btn_disabled: boolean = true;
  edit: boolean = false;
  user: User = new User;

  ngOnInit() {  
    this.user = this._userService.user;
    this.copyValues()
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
              this.copyValues();
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

  //got help from https://stackoverflow.com/questions/43252308/how-to-get-age-from-date-string-using-angular-2
  getDateFromDOB() {
    var date_today = new Date();
    var birth_date = new Date(this.user.dateOfBirth);
    this.age = date_today.getFullYear() - birth_date.getFullYear();
    var month = date_today.getMonth() - birth_date.getMonth();
    if (month < 0 || (month === 0 && date_today.getDate() < birth_date.getDate())) {
        this.age--;
    }
    console.log('User age is: ' + this.age);
    return this.age;
  }


  copyValues() {
    //deep copy object so edit input doesn't bind to both objects
    this.new_profile = {...this.user}; 

    //if values are null 
    if(!this._userService.user.location)
    this.user.location = 'Add Location'
    if(!this._userService.user.firstName)
      this.user.firstName = 'first name'
    if(!this._userService.user.lastName)
      this.user.lastName = 'Last Name'
    if(!this._userService.user.dateOfBirth)
      this.age = 'Add Age'
    else  this.age = this.getDateFromDOB();
  }
}
