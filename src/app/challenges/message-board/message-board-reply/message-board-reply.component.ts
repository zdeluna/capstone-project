import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/database.service';
import { Challenge } from 'src/app/models/challenge.model';
import { ActiveChallengeComponent } from '../../active-challenge/active-challenge.component';

@Component({
  selector: 'app-message-board-reply',
  templateUrl: './message-board-reply.component.html',
  styleUrls: ['./message-board-reply.component.css']
})
export class MessageBoardReplyComponent implements OnInit {

  constructor(private dbService: DatabaseService, private parentComp: ActiveChallengeComponent) { }

  @Input() parent: Post
  @Input() challengeIsOver: Boolean
  @Input() user: User
  @Input() challenge: Challenge
  @Input() post: Post[] = []
  @Input() shouldBeGray: Boolean

  formReply = new FormGroup({
    message: new FormControl('')
  })

  ngOnInit() {
  }

  submitNestedReply(post: Post) {
    let r = {
      content: this.formReply.value.message,
      reply: post.id
    }
    this.dbService.submitMessage(this.challenge.id, r).subscribe(() => {
      this.formReply.reset()
      this.parentComp.ngOnInit()
    })
  }

  deleteMessage(post: Post) {
    this.dbService.deleteMessage(this.challenge.id, post).subscribe(() => {
      this.parentComp.ngOnInit()
    })
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

  thisUserPosted(post: Post) {
    // return post.user == this.user.username
    return true
  }
}
