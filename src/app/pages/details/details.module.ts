import { LazyLoadImageModule } from 'ng-lazyload-image';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DetailsPageRoutingModule } from './details-routing.module';
import { DetailsPage } from './details.page';

// import { SwiperModule } from 'swiper/angular';
// import { SwiperModule } from 'ngx-swiper-wrapper';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DetailsPageRoutingModule,
    LazyLoadImageModule,
    // SwiperModule
  ],
  declarations: [DetailsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DetailsPageModule { }
