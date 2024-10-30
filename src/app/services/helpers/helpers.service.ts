import { Injectable } from '@angular/core';
import { LoadingController, ToastController, NavController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class HelpersService {
  isLoading: boolean = false;

  constructor(
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) { }

  async showLoading(message = '') {
    this.isLoading = true;
    await this.loadingCtrl
      .create({
        message: message,
        mode: 'ios'
      })
      .then((loading) => {
        loading.present().then((_) => {
          if (!this.isLoading) loading.dismiss();
        });
      });
  }

  dismissLoading() {
    this.isLoading = false;
    this.loadingCtrl.dismiss().catch((e) => console.log('dismissed'));
  }

  async presentToast(message: string) {
    let toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'bottom',
      cssClass: 'ion-text-center',
      buttons: [
        {
          icon: 'close',
        },
      ],
    });

    await toast.present();
  }

  navigateForward(route: string) {
    this.navCtrl.navigateForward(route)
  }

  navigateBack(route: string) {
    this.navCtrl.navigateBack(route)
  }

  navigateRoot(route: string) {
    this.navCtrl.navigateRoot(route)
  }
}
