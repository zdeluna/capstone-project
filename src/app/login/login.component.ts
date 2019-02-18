import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { LoginService } from '../services/login.service';
import { Router} from '@angular/router';
import { DatabaseService } from '../services/database.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor (
    private _LoginService: LoginService,
    private router: Router,
    private dbService : DatabaseService,
    private userService: UserService
  ) { }

  user: User = new User;
  submitted = false;

  ngOnInit() {
  }

  onSubmit() {
    this.submitted = true;
    this.login();
  };

  login() {
    this._LoginService.login(this.user)
    .subscribe(
      data => {
        console.log('Login success', data);
        this.dbService.setToken(data['token']);
        this.userService.setCurrentUser(data['user_id']);
        this._LoginService.setLoggedIn();
        this.router.navigate(['/home']);
      },
      error => console.log('Error on login!', error)
    );
  }
}
