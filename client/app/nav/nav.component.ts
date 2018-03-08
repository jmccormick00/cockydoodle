import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HomeComponent } from '../home/home.component';
import { UserService } from '../services/user.service';
import { User } from '../shared/models/user.model';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  user: User;
  isLoading = true;

  constructor(public auth: AuthService, public home: HomeComponent, private userService: UserService,) { }

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

}
