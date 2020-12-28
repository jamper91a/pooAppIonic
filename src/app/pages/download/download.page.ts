import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Map, tileLayer, marker, icon, circle, geoJSON, polygon } from 'leaflet';
import * as turf from '@turf/turf';
import {ActivatedRoute, Router} from '@angular/router';
import {Util} from '../../providers/util';
import {Platform} from '@ionic/angular';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TanksByClientResponse} from '../../api/responses/TanksByClientResponse';
import {ClientService} from '../../api/service/client.service';
import {TankService} from '../../api/service/tank.service';
import {HistoryCreateRequest} from '../../api/requests/HistoryCreateRequest';
// @ts-ignore
// import * as nzgeoJSON from '../../../assets/maps/nz.json';
import * as  GeoJsonGeometriesLookup  from 'geojson-geometries-lookup';
import {MatSnackBar} from '@angular/material/snack-bar';
import {filter} from 'rxjs/operators';
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
  /**
   * Id of the watcher. it will be use to close the watcher once the user leave the page
   */
  public watchId;
  public intervalPosition = null;
  constructor(
      private geolocation: Geolocation,
      private router: Router,
      private util: Util,
      public platform: Platform,
      private clientService: ClientService,
      private tankService: TankService,
      private route: ActivatedRoute,
      private snackBar: MatSnackBar
  ) { }

  async ngOnInit() {

    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tankId = this.router.getCurrentNavigation().extras.state.tankId;
        console.log('tankId', this.tankId);
      }
    });
    this.downloadForm = new FormGroup({});
    this.downloadForm.addControl('tank', new FormControl('', [Validators.required]));
    this.downloadForm.addControl('lat', new FormControl('', [Validators.required]));
    this.downloadForm.addControl('lon', new FormControl('', [Validators.required]));
    await this.getMyTanks();
  }

  ngAfterViewInit(): void {
    const self = this;

    this.platform.ready().then(() => {

      self.intervalPosition = setInterval(() => {
        self.geolocation.getCurrentPosition().then((resp) => {
            self.loading = false;
            self.initMap();
            self.positionReceived(resp.coords.latitude, resp.coords.longitude);
          }).catch((error) => {
            console.log('Error getting location', error);
          });
      }, 5000);

    });
  }
  positionReceived(x, y){
    console.log('new position');
    this.position.x = x;
    this.position.y = y;
    this.addElements(this.position.x, this.position.y);
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

      this.map.on('click', e => {
        this.position.x = e.latlng.lat;
        this.position.y = e.latlng.lng;
        this.addElements(e.latlng.lat, e.latlng.lng);
      });
    }


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
      radius: 1500
    };
    if (this.marketCurrentPosition) {
      this.map.removeLayer(this.marketCurrentPosition);
    }
    this.marketCurrentPosition = marker([x, y], {icon: customMarkerIcon}).addTo(this.map);
    this.map.flyTo([x, y], 13);
    this.map.on('zoomend', () => {
      if (this.circleWarning) {
        this.map.removeLayer(this.circleWarning);
      }
      if (this.circleDanger) {
        this.map.removeLayer(this.circleDanger);
      }
      this.circleWarning = circle([x, y], areaWarning).addTo(this.map);
      this.circleDanger = circle([x, y], areaError).addTo(this.map);
      this.getMapJson();
      this.firstTime = false;

    });
  }

  /**
   * Function that turn a point into a polygon.
   * This polygon will be a 'circle' around the central point
   */
  circleToPolygon(x, y){
    const radius = 0.5;
    // I have to change the position of x and y because that is how turf works
    const circlePosition = turf.circle([y, x], radius, {steps: 10});
    return circlePosition;
  }

  /**
   * Load the json file with the coast line of new zealand
   */
  getMapJson(){
    if (this.glookup) {
      this.validPosition = this.validatePosition();
    } else {
      fetch('./assets/maps/nz_coast_line.geojson').then(res => res.json())
          .then(json => {
            // Add the coast line to the map
            geoJSON(json).addTo(this.map);
            this.glookup = new GeoJsonGeometriesLookup(json);
            this.validPosition = this.validatePosition();
          });
    }


  }

  /**
   * This function will validate that the position of the user is not close to the beach
   */
  validatePosition(){
    const circlePosition = this.circleToPolygon(this.position.x, this.position.y);
    // I check every point of the 'circle' to check if is inside any of the polygons of the coast line
    for (const point of circlePosition.geometry.coordinates[0]){
      const point1 = {type: 'Point', coordinates: point};
      const touchs = this.glookup.countContainers(point1);
      if (touchs > 0){
        // this.snackBar.open('You are too close to the coast', 'Ok', {
        //   duration: 3000
        // });
        return false;
      }
    }

    return true;
  }

  async onDownload() {
    if (this.validPosition) {
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
    clearInterval(this.intervalPosition);
    // this.geolocation.clearWatch(this.watchId);
  }
}
