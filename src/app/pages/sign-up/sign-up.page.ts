import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ClientCreateRequest} from '../../api/requests/ClientCreateRequest';
import {LoginResponse} from '../../api/responses/LoginResponse';
import {UserService} from '../../api/service/user.service';
import {Router} from '@angular/router';
import {Util} from '../../providers/util';
import {ClientService} from '../../api/service/client.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  hide = true;
  hideR = true;
  signUpForm: FormGroup;
  request: ClientCreateRequest = new ClientCreateRequest();
  constructor(
      private clientService: ClientService,
      private router: Router,
      private util: Util
  ) {}



  ngOnInit(): void {
    this.signUpForm = new FormGroup({});
    this.signUpForm.addControl('name', new FormControl('', [Validators.required, Validators.minLength(3)]));
    this.signUpForm.addControl('email', new FormControl('', [Validators.required, Validators.email]));
    this.signUpForm.addControl('password', new FormControl('', [Validators.required, Validators.minLength(6)]));
    this.signUpForm.addControl('repeatPassword', new FormControl('', [Validators.required, Validators.minLength(6), this.validateAreEqual.bind(this)]));
  }

  async onSignUp() {
    this.request.email = this.signUpForm.value.email;
    this.request.password = this.signUpForm.value.password;
    this.request.name = this.signUpForm.value.name;
    try {
      const response: any  = await this.clientService.create(this.request);
      console.log(response);
      await this.router.navigateByUrl('log-in');
      await this.util.showToast('User created, validate your email');
    } catch (e) {
      console.error(e);
    }
  }

  private validateAreEqual(fieldControl: FormControl) {
    return fieldControl.value === this.signUpForm.get('password').value ? null : {
      NotEqual: true
    };
  }


}
