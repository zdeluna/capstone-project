import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor (
    private loginService: LoginService
  ) { }

  user: User = new User;
  submitted: boolean = false;
  rememberUser: boolean = false;

  ngOnInit() {
    this.loginService.checkUserSession();
  }

  onSubmit() {
    this.submitted = true;
    this.loginService.setRememberMe(this.rememberUser);
    this.loginService.login(this.user); 
  };

}
