import { Share } from '@capacitor/share';
import { LocationService } from './../../services/location/location.service';
import { DataService } from 'src/app/services/data/data.service';
import {
  NavController,
  ModalController,
  ActionSheetController,
} from '@ionic/angular';
import {
  Component,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  OnDestroy,
} from '@angular/core';
// import { SwiperComponent } from 'swiper/angular';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

import SwiperCore from 'swiper';
import { MapPage } from '../map/map.page';
// SwiperCore.use([Pagination, Navigation]);
import { Browser } from '@capacitor/browser';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { DeepLinkService } from 'src/app/services/deep-link/deep-link.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DetailsPage implements OnInit, OnDestroy {
  build: any;
  id: string;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private modalController: ModalController,
    private locationService: LocationService,
    private deepLink: DeepLinkService,
    private actionSheetCtrl: ActionSheetController,
    private route: ActivatedRoute,

    private clipboard: Clipboard,
    private helper: HelpersService
  ) { }

  ngOnInit() {
    this.build = this.dataService.myParams.build;
    this.id = this.route.snapshot.params['id'];
    if (!this.build) this.getOneBuild();
    console.log(this.build);
  }
  getOneBuild() {
    this.dataService.getData(`/build/adds/${this.id}`).subscribe((res: any) => {
      console.log(res);
      this.build = res;
    });
  }
  call(number: any) {
    window.open(`tel:${number}`);
  }

  async whatsapp(number: any) {
    await Browser.open({ url: `https://wa.me/+964${number}` });
  }

  async openMap(location: any) {
    // let currentLocation =
    navigator.geolocation.getCurrentPosition(async (value) => {
      await Browser.open({
        url: `https://www.google.com/maps/dir/${value.coords.latitude},${value.coords.longitude}/${location[1]},${location[0]}`,
      });
    });
    // this.locationService.currentLocation;
  }

  back() {
    this.navCtrl.back();
  }
  ngOnDestroy(): void {
    this.dataService.addParams = {};
  }

  async share() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'مشاركة الحساب',
      mode: 'ios',
      buttons: [
        {
          text: 'نسخ الرابط',
          icon: 'copy-outline',
          handler: () => {
            this.copyLink();
          },
        },
        {
          text: 'مشاركة الاعلان مباشرة',
          icon: 'share-outline',
          handler: async () => {
            await Share.share({
              url: `${this.dataService.baseURL}/build/details/${this.build._id}`,
              title: 'تطبيق عقارك',
            }).catch((reason) => {
              console.log(reason);
            });
          },
        },
        {
          text: 'الغاء',
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          },
        },
      ],
    });
    await actionSheet.present();
  }

  async directShare() {
    let liink = await this.deepLink.createLink(this.build);
    console.log(liink);
    this.deepLink.share(this.build);
    // await Share.share({
    //   url: `${this.dataService.baseURL}/build/details/${this.build._id}`,
    //   title: 'باسم الشمري للعقارات',
    // }).catch((reason) => {
    //   console.log(reason);
    // });
  }

  copyLink() {
    console.log('clicked');
    this.clipboard
      .copy(`${this.dataService.baseURL}/build/details/${this.build._id}`)
      .then((val) => {
        this.helper.presentToast('تم نسخ الرابط');
      });
  }
  toProfile() {
    this.navCtrl.navigateForward(`/profile/${this.build.userId._id}`);
  }
}
