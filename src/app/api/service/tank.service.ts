import { Injectable } from '@angular/core';
import {Util} from '../../providers/util';
import {Api} from '../../providers/api';
import {ClientCreateRequest} from '../requests/ClientCreateRequest';
import {TankCreateRequest} from '../requests/TankCreateRequest';

@Injectable({
  providedIn: 'root'
})
export class TankService {

  constructor(
      private util: Util,
      private api: Api
  ) { }


  public async create(request: TankCreateRequest): Promise<any> {
    const self = this;
    const dialog = await this.util.showDialog('Creating', true);
    try {
      // @ts-ignore
      const response: any = await this.api.post('tank', request.getBody()).toPromise();
      await dialog.dismiss();
      // @ts-ignore
      return response;
    } catch (e) {
      await dialog.dismiss();
      self.util.showToast('Tank could not be create');
      throw e;
    }
  }
}
