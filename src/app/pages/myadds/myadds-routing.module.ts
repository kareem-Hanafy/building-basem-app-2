import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyaddsPage } from './myadds.page';

const routes: Routes = [
  {
    path: '',
    component: MyaddsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyaddsPageRoutingModule {}
