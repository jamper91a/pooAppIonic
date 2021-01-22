import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {Geolocation} from '@ionic-native/geolocation/ngx';
import {circle, geoJSON, icon, Map, marker, tileLayer} from 'leaflet';
import {ActivatedRoute, Router} from '@angular/router';
import {Util} from '../../providers/util';
import {Platform} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TanksByClientResponse} from '../../api/responses/TanksByClientResponse';
import {ClientService} from '../../api/service/client.service';
import {TankService} from '../../api/service/tank.service';
import {HistoryCreateRequest} from '../../api/requests/HistoryCreateRequest';
// @ts-ignore
import {MatSnackBar} from '@angular/material/snack-bar';
import {MapService} from '../../api/service/map.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.page.html',
  styleUrls: ['./download.page.scss'],
})
export class DownloadPage implements OnInit, AfterViewInit, OnDestroy {
  public map: Map;
  public loading = true;
  downloadForm: FormGroup;
  response: TanksByClientResponse = new TanksByClientResponse();
  request: HistoryCreateRequest = new HistoryCreateRequest();
  public tankId = 0;
  public glookup = null;
  public firstTime = true;
  // User position
  public position: {x: number, y: number} = {x: 0, y: 0};
  public validPosition = true;
  public marketCurrentPosition = null;
  public circleDanger = null;
  public circleWarning = null;

  public tracking = true;
  constructor(
      private geolocation: Geolocation,
      private router: Router,
      private util: Util,
      public platform: Platform,
      private clientService: ClientService,
      private tankService: TankService,
      private route: ActivatedRoute,
      private snackBar: MatSnackBar,
      private mapService: MapService
  ) { }

  async ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tankId = this.router.getCurrentNavigation().extras.state.tankId;
      }
    });
    this.downloadForm = new FormGroup({});
    this.downloadForm.addControl('tank', new FormControl('', [Validators.required]));
    this.downloadForm.addControl('lat', new FormControl('', [Validators.required]));
    this.downloadForm.addControl('lon', new FormControl('', [Validators.required]));
    await this.getMyTanks();
  }

  ngAfterViewInit(): void {
    console.log('AFter view init');
    const self = this;

    this.platform.ready().then(async () => {
      console.log('Platform ready');
      await this.platformIsReady();
    });
  }
  async platformIsReady(){
    const self = this;
    const resp = await self.getPosition();
    if (resp != null) {
      self.loading = false;
      self.initMap();
      console.log('map');
      await self.positionReceived(resp.coords.latitude, resp.coords.longitude);
      setTimeout(async () => {
        if (self.tracking) {
          await this.platformIsReady();
        }
      }, 5000);
    } else {
      const snackRef = this.snackBar.open('Sorry, we could not obtained your position', 'Try again', {
        duration: 3000,

      });
      snackRef.onAction().subscribe(() => {
        self.platformIsReady();
      });
    }

  }
  getPosition(): Promise<any>{
    const self =  this;
    try {
      return self.geolocation.getCurrentPosition({timeout: 20000, enableHighAccuracy: true}).then((resp) => {
        return resp;
      }).catch((error) => {
        console.log('Error getting location', error);
        return null;
      });
    } catch (e) {
      console.log('another error');
    }
  }

  async positionReceived(x, y){
    console.log('new position');
    this.position.x = x;
    this.position.y = y;
    await this.addElements(this.position.x, this.position.y);
  }
  initMap() {
    if (!this.map){
      this.map = new Map('map', {
        center: [-41.2084402, 172.4722949],
        zoom: 5
      });
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(this.map);

      this.map.on('click', async (e) => {
        this.position.x = e.latlng.lat;
        this.position.y = e.latlng.lng;
        await this.addElements(e.latlng.lat, e.latlng.lng);
      });
    }


  }
  async addElements(x, y){
    this.downloadForm.controls.lat.setValue(x);
    this.downloadForm.controls.lon.setValue(y);
    const customMarkerIcon = icon({
      iconUrl: 'assets/images/pin.png',
      iconSize: [24, 24],
      popupAnchor: [0, -20]
    });
    const areaError = {
      color: 'red',
      fillColor: '#f03',
      fillOpacity: 0.5,
      radius: 500
    };
    const areaWarning = {
      color: 'yellow',
      fillColor: '#ffd044',
      fillOpacity: 0.5,
      radius: 1500
    };
    if (this.marketCurrentPosition) {
      this.map.removeLayer(this.marketCurrentPosition);
    }
    this.marketCurrentPosition = marker([x, y], {icon: customMarkerIcon}).addTo(this.map);
    this.validPosition = await this.validatePosition();
    this.map.flyTo([x, y], 13);
    this.map.on('zoomend', async () => {
      if (this.circleWarning) {
        this.map.removeLayer(this.circleWarning);
      }
      if (this.circleDanger) {
        this.map.removeLayer(this.circleDanger);
      }
      this.circleWarning = circle([x, y], areaWarning).addTo(this.map);
      this.circleDanger = circle([x, y], areaError).addTo(this.map);
      await this.getMapJson();
    });
  }



  /**
   * Load the json file with the coast line of new zealand
   */
  async getMapJson(){
    if (this.firstTime) {
      const json = await this.mapService.getCoastLineNzMapJson();
      geoJSON(json).addTo(this.map);
      this.firstTime = false;
    }
  }

  async validatePosition(){
    const result = await this.mapService.validatePosition(this.position.x, this.position.y);
    if (!result){
      if (this.tracking) {
        this.snackBar.open('You are too close to the coast', 'Ok', {
          duration: 3000
        });
      }
    }
    return result;
  }

  async onDownload() {
    if (!this.validPosition) {
      if (this.downloadForm.valid) {
        try {
          this.request.lat = this.downloadForm.value.lat;
          this.request.lon = this.downloadForm.value.lon;
          this.request.tank = this.downloadForm.value.tank;
          await this.tankService.download(this.request);
          await this.util.showToast('Download saved');
          await this.router.navigateByUrl('home');
          // this.initMap();
        } catch (e) {
          await this.util.showToast('Error getting the tanks');
          await this.router.navigateByUrl('home');
        }
      } else{
        await this.util.showToast('You must choose a tank');
      }
    } else {
      await this.util.showToast('You are too close to the coast');
    }


  }
  async getMyTanks() {
    try {
      this.response  = await this.clientService.getTanks();
      // this.initMap();
    } catch (e) {
      await this.util.showToast('Error getting the tanks');
      await this.router.navigateByUrl('home');
    }
  }

  ngOnDestroy(): void {
    console.log('ngDestroy');
    this.tracking = false;
    // this.geolocation.clearWatch(this.watchId);
  }
}
