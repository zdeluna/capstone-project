import { Component, OnInit, Input } from '@angular/core';
import { Challenge } from 'src/app/models/challenge.model';
import { FormGroup, FormControl } from '@angular/forms';

export interface Post {
  id: string;
  parent?: string;
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
  @Input() posts: Post[] = []

  form = new FormGroup({
    message: new FormControl('')
  })
  formReply = new FormGroup({
    message: new FormControl('')
  })

  ngOnInit() {
  }

  submitNewPost() {
    this.posts.push({
      id: (new Date()).getTime().toString(),
      message: this.form.value.message,
      date: new Date(),
      replies: []
    })
    this.form.reset()
  }

  submitReply(post: Post) {
    post.replies.push({
      id: (new Date()).getTime().toString(),
      parent: post.id,
      message: this.formReply.value.message,
      date: new Date(),
      replies: []
    })
    this.formReply.reset()
  }
}
