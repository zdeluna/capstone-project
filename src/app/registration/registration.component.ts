/*****************************
 * Description: This is the registration component file.
 * This file contains all the methods related
 * to signing-up a user to the application.
*****************************/

import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { AuthService } from '../services/auth.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})

export class RegistrationComponent implements OnInit {

  constructor (
    private authService: AuthService,
    private router: Router
  ) { }

  user: User = new User;
  shouldLogIn: boolean = false;
  submitted: boolean = false;

  ngOnInit() {
    this.authService.loadRememberedUser();
  }

  //submits signup form 
  manualRegistration() {
    this.submitted = true;
    this.authService.setRememberMe(true); //will remember user
    this.authService.signup(this.user)
    .subscribe(
      data => {
        console.log('Signup success', data.user._id);
        if(this.shouldLogIn)
          this.authService.login(this.user); 
        this.router.navigate(['/login']);
      },
      error => console.log('Error on signup!', error)
    );
  };

  //sign up with google //todo
  googleRegistration() {}
}
