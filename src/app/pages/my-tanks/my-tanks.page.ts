import {AfterViewInit, Component, OnInit} from '@angular/core';
import {TanksByClientResponse} from '../../api/responses/TanksByClientResponse';
import {ClientService} from '../../api/service/client.service';
import {Router} from '@angular/router';
import {Util} from '../../providers/util';
import { Map, tileLayer, marker, icon } from 'leaflet';
import {Platform} from '@ionic/angular';
@Component({
  selector: 'app-my-tanks',
  templateUrl: './my-tanks.page.html',
  styleUrls: ['./my-tanks.page.scss'],
})
export class MyTanksPage implements OnInit, AfterViewInit {

  response: TanksByClientResponse = new TanksByClientResponse();
  constructor(
      private clientService: ClientService,
      private router: Router,
      private util: Util,
      public platform: Platform,
  ) { }

  async ngOnInit() {
    await this.getMyTanks();
  }

  async getMyTanks() {
    try {

      this.response  = await this.clientService.getTanks();
      this.initMap();
    } catch (e) {
      await this.util.showToast('Error getting the tanks');
      await this.router.navigateByUrl('home');
    }
  }

  ngAfterViewInit(): void {

  }

  initMap() {
    const self = this;
    setTimeout(() => {
      for (const tank of self.response.tanks){
        // const map = new Map('map' + tank.id).setView([tank.history.position.x, tank.history.position.y], 5);
        if (tank.history) {
          const map = new Map('map' + tank.id, {
            center: [tank.history.position.x, tank.history.position.y],
            zoom: 5,
            zoomControl: false,
            doubleClickZoom: false,
            dragging: false
          });
          tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(map);
          const customMarkerIcon = icon({
            iconUrl: 'assets/images/pin.png',
            iconSize: [24, 24],
            popupAnchor: [0, -20]
          });
          marker([tank.history.position.x, tank.history.position.y], {icon: customMarkerIcon})
              .addTo(map);
        }

      }
    });
  }

  async addTank() {
    await this.router.navigateByUrl('add-tank');
  }
}
