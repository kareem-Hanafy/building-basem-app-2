import { FcmService } from './services/fcm/fcm.service';
import { LocationService } from './services/location/location.service';
import { AuthService } from './services/auth/auth.service';
import { Platform } from '@ionic/angular';
import { HelpersService } from './services/helpers/helpers.service';
import { Storage } from '@ionic/storage-angular';
import { Component } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';
import { DeepLinkService } from './services/deep-link/deep-link.service';
import { register } from 'swiper/element/bundle';
register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private storage: Storage,
    private helper: HelpersService,
    private platform: Platform,
    private authService: AuthService,
    private fcmService: FcmService,
    private deepLink: DeepLinkService,
    private locationService: LocationService
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    await this.storage.create();
    this.platform.ready().then(async () => {
      await this.checkUser();
      // this.authService.userStatus()
      this.locationService.getCurrentLocation().then((val) => {
        console.log(val);
      });
      if (Capacitor.getPlatform() != 'web') await this.setLightStatusBar();
      this.deepLink.listenToDeepLinkOpen();
    });
  }
  async checkUser() {
    const user = await this.storage.get('BuildingUserData');
    this.authService.userData = user;
    // await this.fcmService.initPush();
    if (user) {
      this.helper.navigateRoot('/home');
      // await this.fcmService.notificationsOne();
    } else {
      // if (localStorage.getItem('verified') == 'true') this.helper.navigateRoot('/register')
      this.helper.navigateRoot('/welcome');
    }
  }

  async setLightStatusBar() {
    if (this.platform.is('ios')) {
      await SplashScreen.hide();
      StatusBar.setOverlaysWebView({ overlay: true });
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f8f9fb' });
    } else {
      StatusBar.setOverlaysWebView({ overlay: false });
      await StatusBar.setStyle({ style: Style.Light });
      await StatusBar.setBackgroundColor({ color: '#f8f9fb' });
    }
    await SplashScreen.hide();
  }
}
