import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { LogInPage } from './log-in.page';

import { LogInPageRoutingModule } from './log-in-routing.module';
import { MaterialModule } from '../../material.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        LogInPageRoutingModule,
        MaterialModule,
        ReactiveFormsModule,
    ],
  declarations: [LogInPage],
})
export class LogInPageModule {}
