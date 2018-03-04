import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { LoginComponent } from '../login/login.component';
import { RegisterComponent } from '../register/register.component';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {

  showLogin = false;
  showRegister = false;
  darkRed = true;

  getStyle() {
    if(this.darkRed) {
      return "rgb(98,28,24)";
    } else {
      return "rgb(123,73,70)";
    }
  }

  constructor(public auth: AuthService, private ref: ChangeDetectorRef) { }

  ngOnInit() {
  }

}
