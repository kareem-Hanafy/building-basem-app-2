import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForgetPassPageRoutingModule } from './forget-pass-routing.module';

import { ForgetPassPage } from './forget-pass.page';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOtpInputModule,
    ForgetPassPageRoutingModule
  ],
  declarations: [ForgetPassPage]
})
export class ForgetPassPageModule { }
