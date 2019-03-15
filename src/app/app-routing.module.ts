import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateChallengeComponent } from './challenges/create-challenge/create-challenge.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ActiveChallengeComponent } from './challenges/active-challenge/active-challenge.component';
import { ChallengesPageComponent } from './challenges/challenges-page/challenges-page.component';
import { RegistrationComponent } from './registration/registration.component';
import {  AddActivityComponent } from './activity/add-activity/add-activity.component'
import { ActivityComponent } from './activity/activity.component';
import { AuthGuard } from './auth.guard';
import { ResolveGuard } from './resolve.guard';
import { ViewActivityComponent } from './activity/view-activity/view-activity.component';

const routes: Routes = [
  {
    path: '', 
    component: RegistrationComponent,
  },
  {
    path: 'login', 
    component: LoginComponent
  },
  {
    path: 'home', 
    component: HomeComponent,
    canActivate: [AuthGuard, ResolveGuard]
  },
  {
    path: 'profile', 
    component: ProfileComponent,
    canActivate: [AuthGuard, ResolveGuard]
  },
  {
    path: 'challenges', 
    component: ChallengesPageComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'challenges/create', 
    component: CreateChallengeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'challenges/:id', 
    component: ActiveChallengeComponent,
    canActivate: [AuthGuard, ResolveGuard]
  },
  {
    path: 'activity', 
    component: ActivityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'activity/add',
    component: AddActivityComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'activity/view',
    component: ViewActivityComponent,
    canActivate: [AuthGuard, ResolveGuard]
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
