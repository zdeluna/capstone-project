import { Component, OnInit, Input } from '@angular/core';
import { Challenge } from 'src/app/models/challenge.model';
import { FormGroup, FormControl } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { Post } from 'src/app/models/post.model';
import { DatabaseService } from 'src/app/services/database.service';
import { ActiveChallengeComponent } from '../active-challenge/active-challenge.component';

@Component({
  selector: 'app-message-board',
  templateUrl: './message-board.component.html',
  styleUrls: ['./message-board.component.css']
})
export class MessageBoardComponent implements OnInit {

  constructor(private dbService: DatabaseService, private parent: ActiveChallengeComponent) { }

  @Input() challenge: Challenge
  @Input() challengeIsOver: Boolean
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
    let m = {
      content: this.form.value.message
    }
    this.dbService.submitMessage(this.challenge.id, m).subscribe(() => {
      this.form.reset()
      this.parent.ngOnInit()
    })
  }

  submitReply(post: Post) {
    let r = {
      content: this.formReply.value.message,
      reply: post.id
    }
    this.dbService.submitMessage(this.challenge.id, r).subscribe(() => {
      this.formReply.reset()
      this.parent.ngOnInit()
    })
  }

  deleteMessage(post: Post) {
    this.dbService.deleteMessage(this.challenge.id, post).subscribe(() => {
      this.parent.ngOnInit()
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
    return post.user == this.user.username
  }
}
