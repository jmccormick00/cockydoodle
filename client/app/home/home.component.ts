import { Component, OnInit, Input } from '@angular/core';
import { CardComponent } from '../card/card.component';
import { StartComponent } from '../start/start.component';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  showAccount = false;
  user: any;
  toggleAccount() {
    this.showAccount = !this.showAccount
  }

  constructor(public auth: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit() {

  }


  winPct() {
    console.log(this.auth.currentUser);
    var pct = this.auth.currentUser.winCount / (this.auth.currentUser.winCount + this.auth.currentUser.lossCount);
    pct = pct * 100;
    pct = Math.round(pct * 10) / 10;

    return pct;
  }

}
