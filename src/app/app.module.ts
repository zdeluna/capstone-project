import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatListModule, MatRadioModule, MatSliderModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressBarModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';  
import { environment } from '../environments/environment'; 

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CreateChallengeComponent } from './challenges/create-challenge/create-challenge.component';
import { ActiveChallengeComponent } from './challenges/active-challenge/active-challenge.component';
import { ProfileComponent } from './profile/profile.component';
import { ChallengesPageComponent } from './challenges/challenges-page/challenges-page.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateChallengeComponent,
    ActiveChallengeComponent,
    LoginComponent,
    ProfileComponent,
    ChallengesPageComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatOptionModule,
    MatSelectModule,
    MatListModule,
    MatRadioModule,
    MatSliderModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
