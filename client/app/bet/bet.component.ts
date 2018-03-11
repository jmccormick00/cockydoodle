import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {
  games:any;
  isLoading = true;
  homePercentage: any;
  awayPercentage: any;
  constructor(public userService: UserService) { }

  ngOnInit() {
    this.getGames();
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
    datez.setHours(datez.getHours()+4);
    time += datez.getHours();
    time += ":";
    time += datez.getMinutes();
    return time;
  }

  makeBet() {
    
  }

}


