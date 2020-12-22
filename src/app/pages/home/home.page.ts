import { Component, OnInit } from '@angular/core';
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
    await this.router.navigateByUrl('my-tanks');
  }

  async goToDownload() {
    await this.router.navigateByUrl('download');
  }

  async addTank() {
    await this.router.navigateByUrl('add-tank');
  }
}
