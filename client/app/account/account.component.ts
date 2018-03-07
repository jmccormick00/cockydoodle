import { Component, OnInit } from '@angular/core';
import { ToastComponent } from '../shared/toast/toast.component';
import { AuthService } from '../services/auth.service';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.model';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html'
})
export class AccountComponent implements OnInit {

  user: User;
  isLoading = true;

  constructor(private auth: AuthService,
              public toast: ToastComponent,
              private userService: UserService,
              public home: HomeComponent) { }

  ngOnInit() {
    this.getUser();
  }

  getUser() {
    this.userService.getUser(this.auth.currentUser).subscribe(
      data => this.user = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  winPct() {
    var pct = this.user.winCount / (this.user.winCount + this.user.lossCount);
    pct = pct * 100;
    pct = Math.round(pct * 10) / 10;

    return pct;
  }

}
