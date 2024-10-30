import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OtpVertifyPage } from './otp-vertify.page';

const routes: Routes = [
  {
    path: '',
    component: OtpVertifyPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OtpVertifyPageRoutingModule {}
