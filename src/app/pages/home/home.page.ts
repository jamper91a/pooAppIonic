import { Component, OnInit } from '@angular/core';
import {LoginResponse} from '../../api/responses/LoginResponse';
import {TanksByClientResponse} from '../../api/responses/TanksByClientResponse';
import {ClientService} from '../../api/service/client.service';
import {Router} from '@angular/router';
import {Util} from '../../providers/util';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  constructor(
      private clientService: ClientService,
      private router: Router,
      private util: Util
  ) { }

  ngOnInit() {
  }

  async getMyTanks() {
    try {
      const response: TanksByClientResponse  = await this.clientService.getTanks();
      console.log(response);
      // if (response.user.group.id === 2) {
      //   redirectUrl = 'home';
      //   // await this.router.navigateByUrl(redirectUrl);
      // } else{
      //   await this.util.showToast('User no valid');
      // }
    } catch (e) {
      console.error(e);
    }
  }
}
