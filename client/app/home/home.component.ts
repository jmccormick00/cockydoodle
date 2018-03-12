import { Component, OnInit, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { StartComponent } from '../start/start.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';
import { LeaderboardComponent } from '../leaderboard/leaderboard.component';

import { Observable, Subscription } from 'rxjs/Rx';
import { ElementRef, OnDestroy } from '@angular/core';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


  private future: Date;
  private futureString: string;
  private diff: number;
  private $counter: Observable<number>;
  private subscription: Subscription;
  private message: string;


  showAccount = false;
  user: any;
  toggleAccount() {
    this.showAccount = !this.showAccount
  }

  constructor(public auth: AuthService, private ref: ChangeDetectorRef) { 

    this.futureString = "March 11, 2018 18:00:00";

  }

  dhms(t) {
    var days, hours, minutes, seconds;
    days = Math.floor(t / 86400);
    t -= days * 86400;
    hours = Math.floor(t / 3600) % 24;
    t -= hours * 3600;
    minutes = Math.floor(t / 60) % 60;
    t -= minutes * 60;
    seconds = t % 60;

    return [
        days + 'd',
        hours + 'h',
        minutes + 'm',
        seconds + 's'
    ].join(' ');
}

  ngOnInit() {
    this.future = new Date(this.futureString);
    this.$counter = Observable.interval(1000).map((x) => {
        this.diff = Math.floor((this.future.getTime() - new Date().getTime()) / 1000);
        return x;
    });

    this.subscription = this.$counter.subscribe((x) => this.message = this.dhms(this.diff));
  }


}
