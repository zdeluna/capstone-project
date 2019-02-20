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

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor (
    private authService: AuthService,
    private dbService: DatabaseService,
    private userService: UserService,
    private router: Router
  ) { }

  user: User = new User;
  submitted: boolean = false;
  rememberUser: boolean = false;

  //runs when component loads
  ngOnInit() {
    this.authService.loadRememberedUser();
  }

  //logs in user in with email and password
  login() {

    //user hit submit btn
    this.submitted = true;

    //sets remember me in auth service
    this.authService.setRememberMe(this.rememberUser);

    //logs user in
    this.authService.login(this.user);
  };

  //google login?

}
