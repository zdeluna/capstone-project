import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CreateChallengeComponent } from './challenges/create-challenge/create-challenge.component';
import { ActiveChallengeComponent } from './challenges/active-challenge/active-challenge.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'challenges/create', component: CreateChallengeComponent},
  {path: 'challenges/:id', component: ActiveChallengeComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
