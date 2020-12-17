import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTankPageRoutingModule } from './add-tank-routing.module';

import { AddTankPage } from './add-tank.page';
import {MaterialModule} from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTankPageRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
  ],
  declarations: [AddTankPage]
})
export class AddTankPageModule {}
