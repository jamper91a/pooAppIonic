import {Component, OnInit} from '@angular/core';
import {ClientService} from '../../api/service/client.service';
import {Router} from '@angular/router';
import {Util} from '../../providers/util';
import {
    BackgroundGeolocation,
    BackgroundGeolocationConfig,
    BackgroundGeolocationEvents,
    BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation/ngx';
import {Platform} from '@ionic/angular';
import {MapService} from '../../api/service/map.service';
import {LocalNotifications} from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  public config: BackgroundGeolocationConfig = {
    desiredAccuracy: 10,
    stationaryRadius: 20,
    distanceFilter: 30,
    debug: false, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled',
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
  };
  public notificationsEnabled;
  public backGroundLocationRunning = false;
  constructor(
      private clientService: ClientService,
      private router: Router,
      private util: Util,
      private backgroundGeolocation: BackgroundGeolocation,
      public platform: Platform,
      public mapService: MapService,
      private localNotifications: LocalNotifications
  ) {
    this.notificationsEnabled = this.localNotifications.requestPermission();
  }

  async ngOnInit() {
    // Load map data in case we need
    if (this.platform.is('cordova')) {
      this.backgroundGeolocation.configure(this.config)
          .then(() => {
            this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
                .subscribe(async (location: BackgroundGeolocationResponse) => {
                  const result = await this.mapService.validatePosition(location.latitude, location.longitude);
                  if (!result) {
                    if (this.notificationsEnabled) {
                      this.showNotification();
                    }
                  }
                  await this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });
          });
      const status = await this.backgroundGeolocation.checkStatus();
      this.backGroundLocationRunning = status.isRunning;
    }
  }

  async getMyTanks() {
    await this.router.navigateByUrl('my-tanks');
  }

  async goToDownload() {
    await this.router.navigateByUrl('download');
  }

  async addTank() {
    await this.router.navigateByUrl('add-tank');
  }

  async follow(){
    // start recording location
    this.backGroundLocationRunning = true;
    await this.backgroundGeolocation.start();
  }

  async stopFollow(){
    // start recording location
    this.backGroundLocationRunning = false;
    await this.backgroundGeolocation.stop();
  }

  showNotification(){
    // Schedule a single notification
    this.localNotifications.schedule({
      id: 1,
      title: 'Proximity notification',
      text: 'Too close to the beach',
      foreground: true,
      actions: [{
        id: 'download',
        title: 'Download'
      }]
    });
    this.localNotifications.on('download').subscribe(async (data) => {
        alert('click on notification');
        await this.goToDownload();
    });
  }

  async logOut(){
      localStorage.clear();
      await this.router.navigateByUrl('log-in');
  }

}
