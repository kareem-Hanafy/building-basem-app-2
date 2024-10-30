import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OtpVertifyPageRoutingModule } from './otp-vertify-routing.module';

import { OtpVertifyPage } from './otp-vertify.page';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NgOtpInputModule,
    OtpVertifyPageRoutingModule
  ],
  declarations: [OtpVertifyPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class OtpVertifyPageModule { }
