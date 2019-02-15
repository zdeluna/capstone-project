import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { SignupService } from '../services/signup.service';
import { LoginService } from '../services/login.service';
import { Router} from '@angular/router';
import { DatabaseService } from '../services/database.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor (
    private _SignupService: SignupService,
    private _LoginService: LoginService,
    private router: Router,
    private dbService : DatabaseService
  ) { }

  user: User = new User;
  submitted = false;

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    this.signup();
  };

  signup() {
    this._SignupService.signup(this.user)
    .subscribe(
      data => {
        console.log('Signup success', data.user._id);
        this.dbService.setID(data.user._id);
        this.login();
      },
      error => console.log('Error on signup!', error)
    );
  }

  login() {
    this._LoginService.login(this.user)
    .subscribe(
      data => {
        console.log('Login success', data);
        this.dbService.setToken(data['token'])
        this.router.navigate(['/home']);
      },
      error => console.log('Error on login!', error)
    );
  }
}
