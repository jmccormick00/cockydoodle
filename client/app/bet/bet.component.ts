import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { NavComponent } from '../nav/nav.component';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css'],
  providers: [ NavComponent ]
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
  firstFour:any;
  firstRound: any;
  tooMuch: any;
  enterAmount: any;
  pickATeam: any;
  madeBet = false;
  erroredGame: any;
  noDecimal: any;
  constructor(public nav: NavComponent, public auth: AuthService, public userService: UserService, public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.firstRound = new Array();
    this.firstFour = new Array();
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
      data => {
        this.games = data;
        for(var i = 0; i < this.games.length; i++) {
          if (i < 4) {
            if(this.games[i].homeTeam != "16 Radford") {
              this.firstFour[i] = this.games[i];
            }
          }
          if (i >= 4) {
            this.firstRound[i - 4] = this.games[i];
          }
        }
      },
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
    if(datez.getHours() > 12) {
      datez.setHours(datez.getHours() - 12);
    }
    time += datez.getHours();
    time += ":";
    time += datez.getMinutes();
    return time;
  }

  makeBet(betform, gameId) {
    betform.value.amount = Math.floor(betform.value.amount);
    if(betform.value.amount == "" || betform.value.amount <= 0) {
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
        success => {
          console.log(21);
          this.madeBet = true;
          this.erroredGame = gameId;
        },
        error => {
          console.log(1);
          this.madeBet = true;
          this.erroredGame = gameId;
          window.location.reload();
        }
      );
    }
  }


}


