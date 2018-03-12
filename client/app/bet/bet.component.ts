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

  user: any;

  amount = new FormControl('', [
    Validators.required
  ]);
  homeOrAway = new FormControl('', [
    Validators.required
  ]);

  tooMuch: any;
  enterAmount: any;
  pickATeam: any;

  erroredGame: any;

  constructor(public auth: AuthService, public userService: UserService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.tooMuch = false;
    this.getGames();
    this.getUser();
    this.betForm = this.formBuilder.group({
      amount: this.amount,
      homeOrAway: this.homeOrAway
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

  makeBet(betform, gameId) {
    if(betform.value.amount == "") {
      this.erroredGame = gameId;
      this.enterAmount = true;
      this.tooMuch = false;
      this.pickATeam = false;
    } else if(betform.value.homeOrAway == "") {
      this.erroredGame = gameId;
      this.pickATeam = true;
      this.tooMuch = false;
      this.enterAmount = false;
    } else if (betform.value.amount > this.user.wallet) {
      this.erroredGame = gameId;
      this.tooMuch = true;
      this.enterAmount = false;
      this.pickATeam = false;
    } else {
      this.tooMuch = false;
      this.pickATeam = false;
      this.enterAmount = false;
      var homeAmount = 0;
      var awayAmount = 0;
      this.user.wallet -= betform.value.amount;
      if (betform.value.homeOrAway == "home") {
        homeAmount = betform.value.amount;
      } else {
        awayAmount = betform.value.amount;
      }
      var betObject = {
        gameId: gameId,
        userId: this.user._id,
        homeAmount: homeAmount,
        awayAmount: awayAmount
      }
      this.userService.makeBet(betObject).subscribe(
      );
    }
  }


}


