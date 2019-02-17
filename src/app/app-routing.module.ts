import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateChallengeComponent } from './challenges/create-challenge/create-challenge.component';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { ActiveChallengeComponent } from './challenges/active-challenge/active-challenge.component';
import { ChallengesPageComponent } from './challenges/challenges-page/challenges-page.component';
import { RegistrationComponent } from './registration/registration.component';

const routes: Routes = [
  {path: '', component: RegistrationComponent},
  {path: 'login', component: LoginComponent},
  // {path: 'logout', component: LogoutComponent},
  {path: 'home', component: HomeComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'challenges', component: ChallengesPageComponent},
  {path: 'challenges/create', component: CreateChallengeComponent},
  {path: 'challenges/:id', component: ActiveChallengeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
