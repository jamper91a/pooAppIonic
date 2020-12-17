import { Injectable } from '@angular/core';
import {Util} from '../../providers/util';
import {Api} from '../../providers/api';
import {ClientCreateRequest} from '../requests/ClientCreateRequest';
import {TanksByClientResponse} from '../responses/TanksByClientResponse';


@Injectable({
  providedIn: 'root'
})
export class ClientService {

  constructor(
      private util: Util,
      private api: Api
  ) { }


  public async create(request: ClientCreateRequest): Promise<any> {
    const self = this;
    const dialog = await this.util.showDialog('Creating', true);
    try {
      // @ts-ignore
      const response: any = await this.api.post('client', request.getBody()).toPromise();
      await dialog.dismiss();
      // @ts-ignore
      return response;
    } catch (e) {
      await dialog.dismiss();
      self.util.showToast('User could not be create');
      throw e;
    }
  }

  public async getTanks(): Promise<TanksByClientResponse> {
    const self = this;
    const dialog = await this.util.showDialog('Getting tanks', true);
    try {
      // @ts-ignore
      const response: TanksByClientResponse = await this.api.get('tanks-by-client', {}).toPromise();
      await dialog.dismiss();
      // @ts-ignore
      return response;
    } catch (e) {
      await dialog.dismiss();
      self.util.showToast('Tanks could not be obtained');
      throw e;
    }
  }
}
