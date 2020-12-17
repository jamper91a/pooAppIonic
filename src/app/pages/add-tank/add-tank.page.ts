import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TankCreateRequest} from '../../api/requests/TankCreateRequest';
import {ClientService} from '../../api/service/client.service';
import {Router} from '@angular/router';
import {Util} from '../../providers/util';
import {TankService} from '../../api/service/tank.service';

@Component({
  selector: 'app-add-tank',
  templateUrl: './add-tank.page.html',
  styleUrls: ['./add-tank.page.scss'],
})
export class AddTankPage implements OnInit {

  request: TankCreateRequest = new TankCreateRequest();
  addTankForm: FormGroup;
  constructor(
      private tankService: TankService,
      private router: Router,
      private util: Util
  ) { }

  ngOnInit() {
    this.addTankForm = new FormGroup({});
    this.addTankForm.addControl('name', new FormControl('', [Validators.required, Validators.minLength(3)]));
    this.addTankForm.addControl('plate', new FormControl(''));
    this.addTankForm.addControl('type', new FormControl('', [Validators.required]));
  }

  async onAddTank() {
    this.request.name = this.addTankForm.value.name;
    this.request.plate = this.addTankForm.value.plate;
    this.request.type = this.addTankForm.value.type;
    try {
      const response: any  = await this.tankService.create(this.request);
      await this.router.navigateByUrl('home');
      await this.util.showToast('Tank created');
    } catch (e) {
      console.error(e);
    }
  }
}
