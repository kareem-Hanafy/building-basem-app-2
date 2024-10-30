import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddWishlistPageRoutingModule } from './add-wishlist-routing.module';

import { AddWishlistPage } from './add-wishlist.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddWishlistPageRoutingModule
  ],
  declarations: [AddWishlistPage]
})
export class AddWishlistPageModule { }
