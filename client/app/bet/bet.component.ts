import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {
  games: any;
  isLoading = true;
  homePercentage: any;
  awayPercentage: any;
  betForm: any;

  homeTeam: any = true;
  awayTeam: any = false;

  user: any;

  amount = new FormControl('', [
    Validators.required
  ]);


  constructor(public auth: AuthService, public userService: UserService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.getGames();
    this.getUser();
    this.betForm = this.formBuilder.group({
      amount: this.amount
    });
  }

  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => this.user = data,
      error => console.log(error)
    );
  }

  getGames() {
    this.userService.getGames().subscribe(
      data => this.games = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  truncate(number) {
    return Math.floor(number);
  }
  truncate2(number) {
    return Math.ceil(number);
  }

  getTime(date) {
    var time = "";
    var datez = new Date(date);
    datez.setHours(datez.getHours() + 4);
    time += datez.getHours();
    time += ":";
    time += datez.getMinutes();
    return time;
  }

  makeBet() {
    var homeAmount = 0;
    var awayAmount = 0;
    if (this.homeTeam) {
      homeAmount = this.betForm.amount;
    } else {
      awayAmount = this.betForm.amount
    }
    var betObject = {
      gameId: this.games[0].gameId,
      userId: this.user.userId,
      homeAmount: homeAmount,
      awayAmount: awayAmount,
      date: Date.now()
    }
    console.log(betObject);
  }

  homeTeamZero() {
    this.homeTeam = false;
    this.awayTeam = true;
  }

  awayTeamZero() {
    this.awayTeam = false;
    this.homeTeam = true;
  }

}


