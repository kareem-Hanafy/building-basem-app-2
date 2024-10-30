import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module').then((m) => m.HomePageModule),
  },
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadChildren: () =>
      import('./pages/welcome/welcome.module').then((m) => m.WelcomePageModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginPageModule),
  },
  {
    path: 'register',
    loadChildren: () =>
      import('./pages/register/register.module').then(
        (m) => m.RegisterPageModule
      ),
  },
  {
    path: 'profile/:id',
    loadChildren: () =>
      import('./pages/profile/profile.module').then((m) => m.ProfilePageModule),
  },
  {
    path: 'category',
    loadChildren: () =>
      import('./pages/category/category.module').then(
        (m) => m.CategoryPageModule
      ),
  },
  {
    path: 'details/:id',
    loadChildren: () =>
      import('./pages/details/details.module').then((m) => m.DetailsPageModule),
  },
  {
    path: 'add',
    loadChildren: () =>
      import('./pages/add/add.module').then((m) => m.AddPageModule),
  },
  {
    path: 'myadds',
    loadChildren: () =>
      import('./pages/myadds/myadds.module').then((m) => m.MyaddsPageModule),
  },
  {
    path: 'map',
    loadChildren: () =>
      import('./pages/map/map.module').then((m) => m.MapPageModule),
  },
  {
    path: 'me',
    loadChildren: () =>
      import('./pages/me/me.module').then((m) => m.MePageModule),
  },
  {
    path: 'otp',
    loadChildren: () =>
      import('./pages/otp/otp.module').then((m) => m.OtpPageModule),
  },
  {
    path: 'otp-vertify',
    loadChildren: () =>
      import('./pages/otp-vertify/otp-vertify.module').then(
        (m) => m.OtpVertifyPageModule
      ),
  },
  {
    path: 'qr-code',
    loadChildren: () =>
      import('./pages/qr-code/qr-code.module').then((m) => m.QrCodePageModule),
  },
  {
    path: 'menu',
    loadChildren: () =>
      import('./pages/menu/menu.module').then((m) => m.MenuPageModule),
  },
  {
    path: 'wishlist',
    loadChildren: () =>
      import('./pages/wishlist/wishlist.module').then(
        (m) => m.WishlistPageModule
      ),
  },
  {
    path: 'add-wishlist',
    loadChildren: () =>
      import('./pages/add-wishlist/add-wishlist.module').then(
        (m) => m.AddWishlistPageModule
      ),
  },
  {
    path: 'builds',
    loadChildren: () =>
      import('./pages/builds/builds.module').then((m) => m.BuildsPageModule),
  },
  {
    path: 'wish-detail',
    loadChildren: () =>
      import('./pages/wish-detail/wish-detail.module').then(
        (m) => m.WishDetailPageModule
      ),
  },
  {
    path: 'notification',
    loadChildren: () =>
      import('./pages/notification/notification.module').then(
        (m) => m.NotificationPageModule
      ),
  },
  {
    path: 'forget-pass',
    loadChildren: () =>
      import('./pages/forget-pass/forget-pass.module').then(
        (m) => m.ForgetPassPageModule
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
