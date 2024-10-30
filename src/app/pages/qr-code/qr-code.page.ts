import { ShareService } from './../../services/share/share.service';
import { HelpersService } from './../../services/helpers/helpers.service';
import { DataService } from './../../services/data/data.service';
import { AuthService } from './../../services/auth/auth.service';
import { NavController, ActionSheetController } from '@ionic/angular';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels, QrcodeComponent } from '@techiediaries/ngx-qrcode';
import { Share } from '@capacitor/share';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';

@Component({
  selector: 'app-qr-code',
  templateUrl: './qr-code.page.html',
  styleUrls: ['./qr-code.page.scss'],
})
export class QrCodePage implements OnInit {
  elementType = NgxQrcodeElementTypes.IMG;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  value = '';
  @ViewChild('QR') qrComponent: QrcodeComponent;
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private actionSheetCtrl: ActionSheetController,
    private clipboard: Clipboard,
    private dataService: DataService,
    private shareService: ShareService,
    private helper: HelpersService

  ) { }

  ngOnInit() {
    this.value = `${this.dataService.baseURL}/profile/home/${this.authService.userData._id}`;
    console.log(this.value);

  }

  back() {
    this.navCtrl.back()
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
            this.copyLink()
          }
        },
        // {
        //   text: 'مشاركة الرابط',
        //   icon: 'link-outline',
        //   handler: () => {
        //     console.log('Share clicked');
        //     this.shareService.share(`${this.dataService.baseURL}/profile/home/${this.authService.userData._id}`)
        //   }
        // },
        {
          text: 'مشاركة الـ QR',
          icon: 'share-outline',
          handler: async () => {
            await this.generateImage()
          }
        },
        {
          text: 'الغاء',
          icon: 'close-outline',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }]
    });

    await actionSheet.present();
  }
  async generateImage() {
    await this.helper.showLoading();
    var node = document.getElementById('qr-code');
    await this.shareService.startSharing(node);
  }

  copyLink() {
    console.log('clickedd');
    this.clipboard.copy(`${this.dataService.baseURL}/profile/home/${this.authService.userData._id}`).then((val) => {
      this.helper.presentToast('تم نسخ الرابط')
    });
  }
}
