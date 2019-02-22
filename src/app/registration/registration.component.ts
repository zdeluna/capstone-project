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
import { UserService } from '../services/user.service';



@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  constructor (
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private fb: FormBuilder,
  ) { }

  registrationForm: FormGroup;
  user: User = new User;
  shouldLogIn: boolean = false;
  submitted: boolean = false;
  error: boolean = false;

  ngOnInit() {
    this.authService.loadRememberedUser(); //checks for prior session
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
    
    //fill user service object with what user 
    //typed into form
    this.userService.setUserDetails(this.registrationForm);
    this.shouldLogIn =  this.registrationForm.value.shouldLogIn;
    
    //calls api/signup
    this.authService.signup()
    .subscribe(
      data => {
        console.log('Signup success', data.user._id);

        //if user chose to log in directly after signup
        if(this.shouldLogIn) {
          this.authService.login().subscribe( //calls api/login
            data => {
              this.authService.setRememberMe(true); 
              this.authService.userLoggedIn(data); //routes to home
            },
            //error logging in automatically after signing up 
            //if this happens probably something 
            //wrong with server at  api/login
            //TODO: bring user to an error page
            error => {
              console.log('Error on login! Weird!!!', error);
              // this.error=true;
              // this.submitted =false;
            }
          );
         }

        //else user chose to login manually
        //so route to login page
        this.router.navigate(['/login']);
      }, 

      //error registring user, prob email alrady used
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
