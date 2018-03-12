import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {

  leaderboard: any;
  isLoading = true;
  constructor(public userService: UserService) { }

  ngOnInit() {
    this.loadLeaderboard();
  }



  loadLeaderboard() {
    this.userService.getLeaderboard().subscribe(
      data => this.leaderboard = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

}
