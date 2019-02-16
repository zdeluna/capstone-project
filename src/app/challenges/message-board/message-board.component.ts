import { Component, OnInit, Input } from '@angular/core';
import { Challenge } from 'src/app/models/challenge.model';
import { FormGroup, FormControl } from '@angular/forms';

export interface Post {
  message: string;
  date: Date;
  replies: Post[];
}

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.css']
})
export class MessageBoardComponent implements OnInit {

  constructor() { }

  @Input() challenge: Challenge

  posts: Post[] = []

  form = new FormGroup({
    message: new FormControl('')
  })

  ngOnInit() {
  }

  submitNewPost() {

  }

  submitReply() {
    
  }
}
