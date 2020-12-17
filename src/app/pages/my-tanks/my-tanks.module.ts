import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyTanksPageRoutingModule } from './my-tanks-routing.module';

import { MyTanksPage } from './my-tanks.page';
import {MaterialModule} from '../../material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyTanksPageRoutingModule,
    MaterialModule,
  ],
  declarations: [MyTanksPage]
})
export class MyTanksPageModule {}
