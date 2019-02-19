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
    private signupService: SignupService,
    private loginService: LoginService,
    private router: Router
  ) { }

  user: User = new User;
  shouldLogIn: boolean = false;
  submitted: boolean = false;

  ngOnInit() {
    this.loginService.checkUserSession();
  }

  onSubmit() {
    this.submitted = true;
    this.loginService.setRememberMe(true); //will remember user
    this.signupService.signup(this.user)
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
