import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NavComponent } from '../nav/nav.component';
import { HomeComponent } from '../home/home.component';
@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css'],
  providers: [ HomeComponent ]
})
export class LeaderboardComponent implements OnInit {

  leaderboard: any;
  isLoading = true;
  constructor(public userService: UserService, public home: HomeComponent) { }

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
