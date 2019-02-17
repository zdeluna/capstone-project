import { Component, OnInit, Input } from '@angular/core';
import { Challenge } from 'src/app/models/challenge.model';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user.model';

export interface Post {
  id: string;
  parent?: string;
  message: string;
  date: Date;
  replies: Post[];
  user;
}

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.css']
})
export class MessageBoardComponent implements OnInit {

  constructor() { }

  @Input() challenge: Challenge
  @Input() user: User
  @Input() posts: Post[] = []

  shouldBeGray: Boolean = false

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
      replies: [],
      user: this.user.username
    })
    this.form.reset()
  }

  submitReply(post: Post) {
    post.replies.push({
      id: (new Date()).getTime().toString(),
      parent: post.id,
      message: this.formReply.value.message,
      date: new Date(),
      replies: [],
      user: this.user.username
    })
    this.formReply.reset()
  }

  getPlaceholder(message: string): string {
    if(message.length > 20) {
      return `Reply to "${message.substring(0, 20)}..."`
    } else {
      return `Reply to "${message.substring(0, 20)}"`
    }
  }

  formatDate(date: Date): string {
    let mins: string
    let amPm: string
    let hours: string

    if(date.getHours() > 12) {
      hours = (date.getHours() - 12).toString()
      amPm = 'PM'
    } else if(date.getHours() == 0) {
      hours = '12'
      amPm = 'AM'
    } else {
      hours = date.getHours().toString()
      amPm = 'AM'
    }

    if(date.getMinutes() < 10) {
      mins = `0${date.getMinutes()}`
    } else {
      mins = date.getMinutes().toString()
    }

    return `${date.getMonth() + 1}/${date.getDate()} at ${hours}:${mins} ${amPm}`
  }
}
