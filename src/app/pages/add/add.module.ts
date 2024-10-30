import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddPageRoutingModule } from './add-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AddPage } from './add.page';
// import { SwiperModule } from 'swiper/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddPageRoutingModule,
    // SwiperModule
  ],
  declarations: [AddPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class AddPageModule { }
