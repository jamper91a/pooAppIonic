import {LoadingController, ToastController} from '@ionic/angular';
import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {environment} from '../../environments/environment';

/**
 * Created by Usuario on 02/06/2017.
 */
@Injectable()
export class Util {
  constructor(
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,
    public router: Router
  ) {
      this.url = environment.url;
      this.apiPrefix = environment.apiPrefix;
      this.version = '1.0.0';
  }

  public constants;
  public url: string;
  public apiPrefix: string;
  public version: string;


    public static savePreference(key: string, value: any) {
    localStorage.setItem(key, value);
  }

    public static getPreference(key): any {
    return localStorage.getItem(key);
  }

    public static clearAllData() {
    localStorage.clear();
  }

  public async showToast(message: string) {
      const toast = await this.toastCtrl.create({
          message,
          duration: 3000,
          position: 'bottom'
      });
      toast.present();
      return toast;

  }

  public async showDialog(msg: string, showDialog = true): Promise<HTMLIonLoadingElement> {
    const loading = await this.loadingCtrl.create({
        message: msg,
        keyboardClose: false
    });
    if (showDialog) {
        await loading.present();
    }
    return loading;

  }

  public setLogs(msn: string) {
      let logs = Util.getPreference(this.constants.logs);
      logs = logs ? logs + '\n' + msn + ';' : msn + ';';
      Util.savePreference(this.constants.logs, logs);
  }

  public clearLogs() {
      Util.savePreference(this.constants.logs, '');
  }

  public getLogs() {
      return Util.getPreference(this.constants.logs);
  }

  public logOut() {
      Util.clearAllData();
      this.router.navigateByUrl('/');
  }
}
