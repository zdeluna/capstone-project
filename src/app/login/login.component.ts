/*****************************
 * Description: This is the login component file.
 * This file contains all the logic controlling the
 * /login route view. 
*****************************/

import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//import { MatProgressSpinnerModule} from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  constructor (
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  loginForm: FormGroup;
  user: User = new User;
  submitted: boolean = false;
  rememberUser: boolean = false;
  error: boolean = false;


  //runs when component loads
  ngOnInit() {

    // this.authService.loadRememberedUser();
    if(this.authService.isLoggedIn()) {
      this.router.navigate(['/home'])
    }

    //form group controls form fields
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ["",[
        Validators.required,
        Validators.minLength(6)
      ]],
      rememberUser: [true, [
        Validators.requiredTrue
      ]]
    });
  }

  //these getters make the html cleaner for error messages
  //under <mat-error> tag
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  //logs in user in with email and password
  login() {

    //hides submit and buttons so user can't
    //hit log in btn more than once
    this.submitted = true;

    //fill user object based on form values and remember me
    this.userService.setUserDetails(this.loginForm);
    this.rememberUser =  this.loginForm.value.rememberUser;

    //sets remember me in auth service
    this.authService.setRememberMe(this.rememberUser);

    //logs user in
    //calls /login api
    this.authService.login()
    .subscribe (
      data => {
        this.authService.userLoggedIn(data);
      },
       //user typed in incorrect email or password
      error => {
        console.log('Error on login!', error);
        this.error=true;
        this.submitted =false;
      }
    );
  
  };

  
  //google login?

}
