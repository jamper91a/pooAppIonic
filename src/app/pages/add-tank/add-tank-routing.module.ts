import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTankPage } from './add-tank.page';

const routes: Routes = [
  {
    path: '',
    component: AddTankPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTankPageRoutingModule {}
