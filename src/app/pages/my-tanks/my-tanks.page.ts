import { Component, OnInit } from '@angular/core';
import {TanksByClientResponse} from '../../api/responses/TanksByClientResponse';
import {ClientService} from '../../api/service/client.service';
import {Router} from '@angular/router';
import {Util} from '../../providers/util';

@Component({
  selector: 'app-my-tanks',
  templateUrl: './my-tanks.page.html',
  styleUrls: ['./my-tanks.page.scss'],
})
export class MyTanksPage implements OnInit {

  response: TanksByClientResponse = new TanksByClientResponse();
  constructor(
      private clientService: ClientService,
      private router: Router,
      private util: Util
  ) { }

  async ngOnInit() {
    await this.getMyTanks();
  }

  async getMyTanks() {
    try {
      this.response  = await this.clientService.getTanks();
      console.log(this.response);
    } catch (e) {
      this.util.showToast('Error getting the tanks');
      this.router.navigateByUrl('home');
    }
  }

}
