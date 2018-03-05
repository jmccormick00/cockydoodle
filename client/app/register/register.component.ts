import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { StartComponent } from '../start/start.component';
import { ChangeDetectorRef } from '@angular/core';

import { UserService } from '../services/user.service';
import { ToastComponent } from '../shared/toast/toast.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailReg: any = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  registerForm: FormGroup;
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
    Validators.pattern(this.emailReg)
  ]);
  referralEmail = new FormControl('', [
    Validators.minLength(3),
    Validators.maxLength(100)
  ]);
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]);
  country = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50),
    Validators.pattern('[a-zA-Z_-\\s]*')
  ]);
  password = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  constructor(private formBuilder: FormBuilder,
              private router: Router,
              public toast: ToastComponent,
              private userService: UserService,
              private start: StartComponent,
              private changeDetector: ChangeDetectorRef) { }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: this.name,
      email: this.email,
      country: this.country,
      password: this.password,
      referralEmail: this.referralEmail
    });
  }

  setClassUsername() {
    return { 'has-danger': !this.name.pristine && !this.name.valid };
  }

  setClassEmail() {
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }

  setClassCountry() {
    return { 'has-danger': !this.country.pristine && !this.country.valid };
  }

  setClassReferralEmail() {
    return { 'has-danger': !this.referralEmail.pristine && !this.referralEmail.valid };
  }

  goToLogin() {
    this.start.showLogin = true;
    this.start.showRegister = false;
          this.changeDetector.detectChanges();

  }

  setClassPassword() {
    return { 'has-danger': !this.password.pristine && !this.password.valid };
  }

  register() {
    this.userService.register(this.registerForm.value).subscribe(
      res => {
        this.toast.setMessage('you successfully registered!', 'success');
        this.router.navigate(['/']);
      },
      error => this.toast.setMessage('email already exists', 'danger')
    );
          this.changeDetector.detectChanges();

  }
}
