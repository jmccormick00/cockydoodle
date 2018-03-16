import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { NavComponent } from '../nav/nav.component';
import { HomeComponent } from '../home/home.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-mybets',
  templateUrl: './mybets.component.html',
  styleUrls: ['./mybets.component.css'],
  providers: [HomeComponent]
})
export class MybetsComponent implements OnInit {

  constructor(private auth: AuthService, public userService: UserService, public home: HomeComponent) { }
  user: any;
  isLoading = true;
  myBets: any;
  ngOnInit() {
    this.getUser();

  }

  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => {
        this.user = data;
        this.getMyBets(this.user._id);
      },
      error => console.log(error)
    );
  }

  getMyBets(userId) {
    this.userService.getMyBets(userId).subscribe(
      data => {
        this.myBets = data;
        console.log(data);
      },
      error => console.log(error),
      () => this.isLoading = false
    );
  }
  substr(stringz) {
    return stringz.substring(2);
  }
}
