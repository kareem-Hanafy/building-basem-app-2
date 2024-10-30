import { FcmService } from './../fcm/fcm.service';
import { HelpersService } from './../helpers/helpers.service';
import { Injectable } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { from } from 'rxjs';
import { DataService } from '../data/data.service';
import { Device } from '@capacitor/device';

const USER = 'BuildingUserData';
const ACCESS_TOKEN = 'accessTokenBuilding';
const REFRESH_TOKEN = 'refreshTokenBuilding';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData: any = null;
  constructor(
    private dataService: DataService,
    private storage: Storage,
    private helper: HelpersService,
    private navCtrl: NavController,
    private fcmService: FcmService
  ) { }

  getAccessToken() {
    return localStorage.getItem(ACCESS_TOKEN);
  }

  removeCredentials() {
    localStorage.removeItem(ACCESS_TOKEN);
    // this.storage.remove('taboor_url');
    this.userData = null;
    return Promise.all([
      this.storage.remove(USER),
      this.storage.remove(REFRESH_TOKEN),
    ]);
  }

  getRefreshToken() {
    let promise = new Promise(async (resolve, reject) => {
      let token = await this.storage.get(REFRESH_TOKEN);
      this.dataService
        .getData(`/user/refreshToken?token=${token}`)
        .subscribe(
          (res: any) => {
            localStorage.setItem(ACCESS_TOKEN, res.accessToken);
            resolve(res.token);
          },
          (e) => reject(e)
        );
    });
    return from(promise);
  }

  login(body: any) {
    this.helper.showLoading();
    this.dataService.postData('/user/login', body).subscribe(
      async (user: any) => {
        this.userData = await this.storage.set(USER, user);
        await this.storage.set(REFRESH_TOKEN, user.refreshToken);
        localStorage.setItem(ACCESS_TOKEN, user.accessToken);
        this.helper.dismissLoading();
        this.navCtrl.navigateForward('/home');
        await this.fcmService.notificationsOne()
      },
      (err) => {
        this.helper.dismissLoading();
        if (err.status == 404)
          return this.helper.presentToast(
            'خطأ برقم الهاتف او كلمة المرور'
          );
        return this.helper.presentToast('خطأ بالشبكة');
      }
    );
  }
  register(body: any) {
    this.helper.showLoading();
    this.dataService.postData('/user/register', body)
      .subscribe(
        async (user: any) => {
          this.userData = await this.storage.set(USER, user);
          await this.storage.set(REFRESH_TOKEN, user.refreshToken);
          localStorage.setItem(ACCESS_TOKEN, user.accessToken);
          this.helper.dismissLoading();
          localStorage.removeItem('verified');
          localStorage.removeItem('vertifiedNumber')
          this.navCtrl.navigateForward('/home');
          await this.fcmService.notificationsOne()
        },
        (err) => {
          this.helper.dismissLoading();
          if (err.status == 404) return this.helper.presentToast('خطأ برقم الهاتف او كلمة المرور');
          if (err.status == 409) return this.helper.presentToast('اسم المستخدم موجود بالفعل ');

          return this.helper.presentToast('خطأ بالشبكة');
        }
      );
  }
  updateUser(body: any) {
    this.helper.showLoading();
    this.dataService.updateData(`/user/update/${this.userData?._id}`, body)
      .subscribe(
        async (user: any) => {
          this.userData = await this.storage.set(USER, user);
          await this.storage.set(REFRESH_TOKEN, user.refreshToken);
          localStorage.setItem(ACCESS_TOKEN, user.accessToken);
          this.helper.dismissLoading();
          localStorage.removeItem('verified');
          localStorage.removeItem('vertifiedNumber')
          this.navCtrl.navigateForward('/home');
        },
        (err) => {
          this.helper.dismissLoading();
          if (err.status == 404) return this.helper.presentToast('خطأ برقم الهاتف او كلمة المرور');
          if (err.status == 409) return this.helper.presentToast('اسم المستخدم موجود بالفعل ');
          return this.helper.presentToast('خطأ بالشبكة');
        }
      );
  }
  async logOut() {
    this.helper.showLoading();
    await this.removeCredentials();
    this.helper.dismissLoading();
    this.navCtrl.navigateRoot('/login');
  }

  async loginVisitor() {
    let uuid = (await Device.getId()).identifier;
    this.helper.showLoading();
    this.dataService.postData(
      '/user/visitor',
      {
        deviceId: uuid
      }
    )
      .subscribe(
        async (user: any) => {
          this.userData = await this.storage.set(USER, user);
          await this.storage.set(REFRESH_TOKEN, user.refreshToken);
          localStorage.setItem(ACCESS_TOKEN, user.accessToken);
          this.helper.dismissLoading();
          this.navCtrl.navigateForward('/home');
        },
        (err) => {
          this.helper.dismissLoading();
          if (err.status == 404)
            return this.helper.presentToast(
              'خطأ برقم الهاتف او كلمة المرور'
            );

          return this.helper.presentToast('خطأ بالشبكة');
        }
      );
  }
  changePassword(body: any) {
    this.helper.showLoading();
    this.dataService.postData(`/user/changePass`, body)
      .subscribe(
        async (user: any) => {
          this.userData = await this.storage.set(USER, user);
          await this.storage.set(REFRESH_TOKEN, user.refreshToken);
          localStorage.setItem(ACCESS_TOKEN, user.accessToken);
          this.helper.dismissLoading();
          // localStorage.removeItem('verified');
          // localStorage.removeItem('vertifiedNumber')
          this.navCtrl.navigateForward('/home');
        },
        (err) => {
          this.helper.dismissLoading();
          if (err.status == 404) return this.helper.presentToast('خطأ برقم الهاتف او كلمة المرور');
          if (err.status == 409) return this.helper.presentToast('اسم المستخدم موجود بالفعل ');
          return this.helper.presentToast('خطأ بالشبكة');
        }
      );
  }

}
