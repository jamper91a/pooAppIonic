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
    debug: true, //  enable this hear sounds for background-geolocation life-cycle.
    stopOnTerminate: false, // enable this to clear background location settings when the app terminates,
    notificationTitle: 'Background tracking',
    notificationText: 'enabled',
    interval: 10000,
    fastestInterval: 5000,
    activitiesInterval: 10000,
  };

  constructor(
      private clientService: ClientService,
      private router: Router,
      private util: Util,
      private backgroundGeolocation: BackgroundGeolocation,
      public platform: Platform,
      public mapService: MapService
  ) { }

  ngOnInit() {
    // Load map data in case we need
    if (this.platform.is('cordova')) {
      this.backgroundGeolocation.configure(this.config)
          .then(() => {
            this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
                .subscribe(async (location: BackgroundGeolocationResponse) => {
                  const result = await this.mapService.validatePosition(location.latitude, location.longitude);
                  await this.backgroundGeolocation.finish(); // FOR IOS ONLY
            });
          });
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
    await this.backgroundGeolocation.start();
  }

  async stopFollow(){
    // start recording location
    await this.backgroundGeolocation.stop();
  }


}
