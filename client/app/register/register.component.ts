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
  
  badEmail = false;
  badUsername = false;
  badName = false;
  badPassword = false;
  badCountry = false;
  badReferralEmail = false;

  registerForm: FormGroup;
  email = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(100),
    Validators.pattern(this.emailReg)
  ]);
  referralEmail = new FormControl('', [
    Validators.minLength(3),
    Validators.maxLength(100),
    Validators.pattern(this.emailReg)
  ]);
  name = new FormControl('', [
    Validators.required,
    Validators.minLength(3),
    Validators.maxLength(50)
  ]);
  username = new FormControl('', [
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
      username: this.username,
      email: this.email,
      country: this.country,
      password: this.password,
      referralEmail: this.referralEmail
    });
  }
  referNotEqualToEmail() {
    return this.email.value == this.referralEmail.value;
  }

  setClassUsername() {
    this.badUsername = !this.username.pristine && !this.username.valid;
    return { 'has-danger': !this.username.pristine && !this.username.valid };
  }
  setClassName() {
    this.badName = !this.name.pristine && !this.name.valid;
    return { 'has-danger': !this.name.pristine && !this.name.valid };
  }
  setClassEmail() {
    this.badEmail = !this.email.pristine && !this.email.valid;
    return { 'has-danger': !this.email.pristine && !this.email.valid };
  }

  setClassCountry() {
    this.badCountry = !this.country.pristine && !this.country.valid;
    return { 'has-danger': !this.country.pristine && !this.country.valid };
  }

  setClassReferralEmail() {
    this.badReferralEmail = (this.email.value == this.referralEmail.value);
    return { 'has-danger': !this.referralEmail.pristine && !this.referralEmail.valid };
  }

  checkInputs() {
    this.badReferralEmail = !this.referralEmail.pristine && !this.referralEmail.valid || this.referralEmail.value != "" && (this.email.value == this.referralEmail.value);
    this.badCountry = !this.country.pristine && !this.country.valid;
    this.badEmail = !this.email.pristine && !this.email.valid;
    this.badName = !this.name.pristine && !this.name.valid;
    this.badUsername = !this.username.pristine && !this.username.valid;
    this.badPassword = this.password.value.length > 0 && this.password.value.length <= 6;
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
        this.toast.setMessage('You successfully registered! Please login', 'success');
        this.goToLogin();
      },
      error => this.toast.setMessage('email already exists', 'danger')
    );
          this.changeDetector.detectChanges();

  }
}
