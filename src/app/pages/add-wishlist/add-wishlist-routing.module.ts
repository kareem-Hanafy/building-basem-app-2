import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddWishlistPage } from './add-wishlist.page';

const routes: Routes = [
  {
    path: '',
    component: AddWishlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddWishlistPageRoutingModule {}
