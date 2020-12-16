import { Injectable } from '@angular/core';
import {LoginRequest} from '../requests/LoginRequest';
import {LoginResponse} from '../responses/LoginResponse';
import {Api, Util} from '../../providers/providers';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
      private util: Util,
      private api: Api
  ) {

  }

  public async login(request: LoginRequest): Promise<LoginResponse> {
    const self = this;
    const dialog = await this.util.showDialog('Logging', true);
    try {
      // @ts-ignore
      const response: LoginResponse = await this.api.post('login', request.getBody()).toPromise();
      await dialog.dismiss();
      if (response) {
        Util.savePreference('token', response.token);
        Util.savePreference('user', JSON.stringify(response.user));
      }
      // @ts-ignore
      return response;
    } catch (e) {
      await dialog.dismiss();
      self.util.showToast('Email / password does not match');
      throw e;
    }
  }
}
