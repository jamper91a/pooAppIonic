import {Injectable} from '@angular/core';
import {Util} from '../../providers/util';
import {Api} from '../../providers/api';
import {HistoryGetByTankRequest} from '../requests/HistoryGetByTankRequest';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  constructor(
      private util: Util,
      private api: Api
  ) { }


  public async getByTank(request: HistoryGetByTankRequest): Promise<any> {
    const self = this;
    const dialog = await this.util.showDialog('Getting history', true);
    try {
      // @ts-ignore
      const response: any = await this.api.post('history/get-by-tank', request.getBody()).toPromise();
      await dialog.dismiss();
      // @ts-ignore
      return response;
    } catch (e) {
      await dialog.dismiss();
      await self.util.showToast('History could not be obtained');
      throw e;
    }
  }
}
