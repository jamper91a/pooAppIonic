import {AfterViewInit, Component, OnInit} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, icon, circle } from 'leaflet';
import {Router} from '@angular/router';
import {Util} from '../../providers/util';
import {Platform} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TanksByClientResponse} from '../../api/responses/TanksByClientResponse';
import {ClientService} from '../../api/service/client.service';
import {TankService} from '../../api/service/tank.service';
import {HistoryCreateRequest} from '../../api/requests/HistoryCreateRequest';

@Component({
  selector: 'app-download',
  templateUrl: './download.page.html',
  styleUrls: ['./download.page.scss'],
})
export class DownloadPage implements OnInit, AfterViewInit {
  public map: Map;
  public loading = true;
  downloadForm: FormGroup;
  response: TanksByClientResponse = new TanksByClientResponse();
  request: HistoryCreateRequest = new HistoryCreateRequest();
  constructor(
      private geolocation: Geolocation,
      private router: Router,
      private util: Util,
      public platform: Platform,
      private clientService: ClientService,
      private tankService: TankService,
  ) { }

  async ngOnInit() {
    this.downloadForm = new FormGroup({});
    this.downloadForm.addControl('tank', new FormControl('', [Validators.required]));
    this.downloadForm.addControl('lat', new FormControl('', [Validators.required]));
    this.downloadForm.addControl('lon', new FormControl('', [Validators.required]));
    await this.getMyTanks();
  }

  ngAfterViewInit(): void {
    const self = this;

    this.platform.ready().then(() => {

      self.geolocation.getCurrentPosition().then((resp) => {
        self.loading = false;
        self.initMap();
        self.addElements(resp.coords.latitude, resp.coords.longitude);
      }).catch((error) => {
        console.log('Error getting location', error);
      });
    });
  }
  initMap() {
    this.map = new Map('map', {
      center: [-41.2084402, 172.4722949],
      zoom: 5,
    });
    tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);
  }
  addElements(x, y){
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
      radius: 1000
    };
    marker([x, y], {icon: customMarkerIcon}).addTo(this.map);
    this.map.flyTo([x, y], 13);
    this.map.on('zoomend', () => {
      circle([x, y], areaWarning).addTo(this.map);
      circle([x, y], areaError).addTo(this.map);
    });
  }

  async onDownload() {
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
      this.util.showToast('You must choose a tank');
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
}
