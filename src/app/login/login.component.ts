/*****************************
 * Description: This is the login component file.
 * This file contains all the logic controlling the
 * /login route view. 
*****************************/

import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatInputModule, MatProgressBarModule } from '@angular/material';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor (
    private authService: AuthService,
    private dbService: DatabaseService,
    private userService: UserService,
    private router: Router,
    private browserAnimationModule: BrowserAnimationsModule,
    private matbuttonModule: MatButtonModule,
    private matInputModule: MatInputModule,
    private reactiveFormsModule: ReactiveFormsModule,
    private matProgressBarModule: MatProgressBarModule,
    private fb: FormBuilder,
    // private validators: Validators
    // private fg: FormGroup
  ) { }

  user: User = new User;
  submitted: boolean = false;
  rememberUser: boolean = false;

  //runs when component loads
  ngOnInit() {
    //if user hit remember me on last session at login,
    //loads user and navigates to home page skipping login
    this.authService.loadRememberedUser();

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
      rememberUser: [false, [
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
    this.user.username = this.loginForm.value.email;
    this.user.password = this.loginForm.value.password;
    this.rememberUser =  this.loginForm.value.rememberUser;
    // console.log(this.user);

    //sets remember me in auth service
    this.authService.setRememberMe(this.rememberUser);

    //logs user in
    this.authService.login(this.user);
  };

  //google login?

}
