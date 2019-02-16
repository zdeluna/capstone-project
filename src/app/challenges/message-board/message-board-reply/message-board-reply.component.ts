import { Component, OnInit, Input } from '@angular/core';
import { Post } from '../message-board.component';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-message-board-reply',
  templateUrl: './message-board-reply.component.html',
  styleUrls: ['./message-board-reply.component.css']
})
export class MessageBoardReplyComponent implements OnInit {

  constructor() { }

  @Input() parent: Post
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
      replies: []
    })
    this.formReply.reset()
  }
}
