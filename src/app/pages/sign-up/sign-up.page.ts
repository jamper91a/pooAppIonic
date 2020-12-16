import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  hide = true;
  hideR = true;
  signUpForm: FormGroup;
  constructor() {}



  ngOnInit(): void {
    this.signUpForm = new FormGroup({});
    this.signUpForm.addControl('email', new FormControl('', [Validators.required, Validators.email]));
    this.signUpForm.addControl('password', new FormControl('', [Validators.required, Validators.minLength(6)]));
    this.signUpForm.addControl('repeatPassword', new FormControl('', [Validators.required, Validators.minLength(6), this.validateAreEqual.bind(this)]));
  }

  onSignUp() {
    console.warn(this.signUpForm.value);
  }

  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.signUpForm.get('password').value ? null : {
      NotEqual: true
    };
  }


}
