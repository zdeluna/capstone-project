import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../message-board.component';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-message-board-reply',
  templateUrl: './message-board-reply.component.html',
  styleUrls: ['./message-board-reply.component.css']
})
export class MessageBoardReplyComponent implements OnInit {

  constructor() { }

  @Input() parent: Post
  @Input() user: User
  @Input() post: Post[] = []

  formReply = new FormGroup({
    message: new FormControl('')
  })

  ngOnInit() {
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
