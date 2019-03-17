import { Component, OnInit } from '@angular/core';
import {User} from '../models/user.model';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})

export class ProfileComponent implements OnInit {
  
  constructor(
    private location: Location
  ) { }

  user: User = new User;
  isActive1 = 'active';
  isActive2 = ''
  active1 = true
  active2 = false
 
  ngOnInit() {
  }

  changeToTotals() {
    let temp = this.isActive1;
    this.isActive1 = this.isActive2;
    this.isActive2 = temp;

    this.active2 = false;
    this.active1 = true;
  }

  changeToRecords() {
    let temp = this.isActive1;
    this.isActive1 = this.isActive2;
    this.isActive2 = temp;

    this.active2 = true;
    this.active1 = false;
  }

  back() {
    this.location.back();
  }


  btnOptions: Array<String> = [
    'Totals',
    'Records'
  ]

}
