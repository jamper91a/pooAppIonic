import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyTanksPage } from './my-tanks.page';

const routes: Routes = [
  {
    path: '',
    component: MyTanksPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyTanksPageRoutingModule {}
