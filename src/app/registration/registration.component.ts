/*****************************
 * Description: This is the registration component file.
 * This file contains all the methods related
 * to signing-up a user to the application.
*****************************/

import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { Router} from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';


@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  constructor (
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  registrationForm: FormGroup;
  user: User = new User;
  shouldLogIn: boolean = false;
  submitted: boolean = false;
  error: boolean = false;

  ngOnInit() {
    this.authService.loadRememberedUser();
    this.registrationForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ["",[
        Validators.required,
        Validators.minLength(6)
      ]],
      shouldLogIn: [true, [
        Validators.requiredTrue
      ]]
    });
  }

  //these getters make the html cleaner for error messages
  //under <mat-error> tag
  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  //submits signup form 
  manualRegistration() {
    this.submitted = true; //disabled signup btn's
    this.authService.setRememberMe(true); //??will remember user
    
    //fill user object based on form controls and remember me
    this.user.username = this.registrationForm.value.email;
    this.user.password = this.registrationForm.value.password;
    this.shouldLogIn =  this.registrationForm.value.shouldLogIn;
    
    this.authService.signup(this.user)
    .subscribe(
      data => {
        console.log('Signup success', data.user._id);
        // this.error = false;
        if(this.shouldLogIn)
          this.authService.login(this.user); 
        this.router.navigate(['/login']);
      }, 

      //TODO: show errors on screen instead of console
      error => { 
        console.log('Error on signup!', error)
        this.error = true;
        this.submitted = false;
      }
    );
  };

  //TODO: sign up with google 
  googleRegistration() {}
}
