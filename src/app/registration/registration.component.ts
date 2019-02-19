import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { SignupService } from '../services/signup.service';
import { LoginService } from '../services/login.service';
import { Router} from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  constructor (
    private _SignupService: SignupService,
    private loginService: LoginService,
    private router: Router
  ) { }

  user: User = new User;
  shouldLogIn: boolean = false;
  submitted = false;

  ngOnInit() {
    this.loginService.checkUserSession();
  }

  onSubmit() {
    this.submitted = true;
    this.loginService.rememberMe = this.shouldLogIn;
    this._SignupService.signup(this.user)
    .subscribe(
      data => {
        console.log('Signup success', data.user._id);
        if(this.shouldLogIn)
        {  this.loginService.login(this.user); }
        this.router.navigate(['/login']);
      },
      error => console.log('Error on signup!', error)
    );
  };
}
