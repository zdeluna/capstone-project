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
    private loginService: LoginService,
    private router: Router,
    private dbService : DatabaseService,
    private userService: UserService
  ) { }

  user: User = new User;
  submitted = false;
  rememberUser = false;

  ngOnInit() {
    this.loginService.checkUserSession();
  }

  onSubmit() {
    this.submitted = true;
    this.loginService.setRememberMe(this.rememberUser);
    this.loginService.login(this.user); 
  };

}
