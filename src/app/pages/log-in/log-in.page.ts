import { Component } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {LoginRequest} from '../../api/requests/LoginRequest';
import {LoginResponse} from '../../api/responses/LoginResponse';
import {UserService} from '../../api/service/user.service';
import {Router} from '@angular/router';
import {Util} from '../../providers/providers';

@Component({
  selector: 'app-home',
  templateUrl: 'log-in.page.html',
  styleUrls: ['log-in.page.scss'],
})
export class LogInPage {
  hide = true;
  loginForm = new FormGroup({
    email: new FormControl('jamper91@hotmail.com', [Validators.required, Validators.email]),
    password: new FormControl('84945SDSDd', [Validators.required, Validators.minLength(6)]),
  });
  public request: LoginRequest = new LoginRequest();
  constructor(
      private userService: UserService,
      private router: Router,
      private util: Util,
  ) {}

  async onLogin() {
    this.request.email = this.loginForm.value.email;
    this.request.password = this.loginForm.value.password;
    try {
      let redirectUrl = '';
      const response: LoginResponse  = await this.userService.login(this.request);
      console.log(response);
      if (response.user.group.id === 2) {
          redirectUrl = 'home';
          // await this.router.navigateByUrl(redirectUrl);
      } else{
        await this.util.showToast('User no valid');
      }
    } catch (e) {
      console.error(e);
    }
  }
}