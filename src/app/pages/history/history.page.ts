import {Component, OnInit} from '@angular/core';
import {HistoryByTankResponse} from '../../api/responses/HistoryByTankResponse';
import {HistoryService} from '../../api/service/history.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Util} from '../../providers/util';
import {Platform} from '@ionic/angular';
import {HistoryGetByTankRequest} from '../../api/requests/HistoryGetByTankRequest';
import {Tank} from '../../api/pojo/Tank';
import {icon, Map, marker, tileLayer} from 'leaflet';

@Component({
  selector: 'app-history',
  templateUrl: './history.page.html',
  styleUrls: ['./history.page.scss'],
})
export class HistoryPage implements OnInit {
  response: HistoryByTankResponse = new HistoryByTankResponse();
  tank: Tank = null;
  constructor(
      private historyService: HistoryService,
      private router: Router,
      private util: Util,
      public platform: Platform,
      private route: ActivatedRoute,
  ) {
  }

  async ngOnInit() {
    this.route.queryParams.subscribe(async params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.tank = this.router.getCurrentNavigation().extras.state.tank;
        console.log('tanks', this.tank);
        if (this.tank) {
          await this.getHistory(this.tank.id);
        } else {
          await this.util.showToast('Tank no valid');
          await this.router.navigateByUrl('my-tanks');
        }

      } else {
        await this.util.showToast('Tank no valid');
        await this.router.navigateByUrl('my-tanks');
      }
    });
  }

  async getHistory(tankId: number){

    try {
      const historyGetByTankRequest = new HistoryGetByTankRequest();
      historyGetByTankRequest.tank = tankId;
      this.response  = await this.historyService.getByTank(historyGetByTankRequest);
      this.initMap();
    } catch (e) {
      await this.util.showToast('Error getting the history');
      await this.router.navigateByUrl('home');
    }
  }

  initMap() {
    const self = this;
    setTimeout(() => {
      for (const tank of self.response.history){
          const map = new Map('map-history-' + tank.id, {
            center: [tank.position.x, tank.position.y],
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
          marker([tank.position.x, tank.position.y], {icon: customMarkerIcon})
              .addTo(map);
      }
    });
  }

}
