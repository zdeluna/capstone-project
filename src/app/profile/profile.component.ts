import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  constructor() { }

  user: User = new User;
 
  ngOnInit() {
  }

}
