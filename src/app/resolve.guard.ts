import { of, Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { DatabaseService } from './services/database.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { Observer } from 'firebase';

@Injectable()
export class ResolveGuard implements CanActivate {
constructor(
    private dbService: DatabaseService,
    private authService: AuthService,
    private userService: UserService
){}

//https://shermandigital.com/blog/wait-for-data-before-rendering-views-in-angular-2/
//https://stackoverflow.com/questions/37897273/authguard-doesnt-wait-for-authentication-to-finish-before-checking-user
//https://stackoverflow.com/questions/50203241/angular-5-to-6-upgrade-property-map-does-not-exist-on-type-observable
//
canActivate(): Observable<boolean> {
    let remembered: string = localStorage.getItem('loggedIn');
    if(this.authService.isLoggedIn()) { 
      return this.dbService.getUser(JSON.parse(remembered).id)
      .pipe(map(
          data => {
              this.userService.setUserDataFromDb(data);
              this.userService.user.password = data['password'];
              this.userService.setToken(JSON.parse(remembered).token);
              return true;
          }
      ))
}}}