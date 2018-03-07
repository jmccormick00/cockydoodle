import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NavComponent } from '../nav/nav.component';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.css'],
  providers: [ HomeComponent ]
})
export class RulesComponent implements OnInit {

  constructor(public auth: AuthService, public home: HomeComponent) { }

  ngOnInit() {
  }

}
