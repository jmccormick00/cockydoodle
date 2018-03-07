import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public auth: AuthService, public home: HomeComponent) { }

  ngOnInit() {
  }

}
