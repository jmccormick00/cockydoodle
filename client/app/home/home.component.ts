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

  cards = [{"name": 'Ticker', "currency": 'BTC/USD'}, {"name": 'Marketcap', "currency": 'n/a'}, {"name": 'Energy Consumption', "currency": 'Bitcoin'}, {"name": 'Mempool', "currency": 'BTC'}, {"name": 'Jokes', "currency": 'Bitcoin'}, {"name": 'Portfolio', "currency": 'n/a'}, {"name": 'Transaction Fees', "currency": 'Bitcoin'}];

  constructor(public auth: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
    console.log(this.auth.currentUser);
  }

}
