import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatFormFieldModule, MatInputModule, MatOptionModule, MatSelectModule, MatListModule, MatRadioModule, MatSliderModule, MatCardModule, MatDatepickerModule, MatNativeDateModule, MatProgressBarModule, MatProgressSpinnerModule, MatSortModule } from '@angular/material';
import { ScrollDispatchModule } from '@angular/cdk/scrolling';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTableModule } from '@angular/material/table';
import { MatGridListModule } from '@angular/material/grid-list';
import { HttpClientModule } from '@angular/common/http';
import { AngularFireModule } from '@angular/fire';  
import { environment } from '../environments/environment'; 
import { RegistrationComponent } from './registration/registration.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { CreateChallengeComponent } from './challenges/create-challenge/create-challenge.component';
import { ActiveChallengeComponent } from './challenges/active-challenge/active-challenge.component';
import { ProfileComponent } from './profile/profile.component';
import { ChallengesPageComponent } from './challenges/challenges-page/challenges-page.component';
import { MessageBoardComponent } from './challenges/message-board/message-board.component';
import { MessageBoardReplyComponent } from './challenges/message-board/message-board-reply/message-board-reply.component';
import { CompletedChallengeComponent } from './challenges/completed-challenge/completed-challenge.component';
import { AuthGuard } from './auth.guard';
import { ActivityComponent } from './activity/activity.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AddActivityComponent } from './activity/add-activity/add-activity.component';
import { ViewActivityComponent } from './activity/view-activity/view-activity.component';
import { ResolveGuard } from './resolve.guard';
import { AuthService } from './services/auth.service';
import { ServiceWorkerModule } from '@angular/service-worker';
import { CdkColumnDef } from '@angular/cdk/table';
import { EditProfileComponent } from './edit-profile/edit-profile.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CreateChallengeComponent,
    ActiveChallengeComponent,
    RegistrationComponent,
    LoginComponent,
    ProfileComponent,
    ChallengesPageComponent,
    MessageBoardComponent,
    MessageBoardReplyComponent,
    ActivityComponent,
    CompletedChallengeComponent,
    AddActivityComponent,
    ViewActivityComponent,
    EditProfileComponent,
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
    MatProgressSpinnerModule,
    MatButtonToggleModule,
    MatGridListModule,
    MatCheckboxModule,
    MatTableModule,
    MatSortModule,
    HttpClientModule,
    ScrollDispatchModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: true })
  ],
  providers: [AuthGuard, ResolveGuard, AuthService, CdkColumnDef],
  bootstrap: [AppComponent]
})
export class AppModule { }
