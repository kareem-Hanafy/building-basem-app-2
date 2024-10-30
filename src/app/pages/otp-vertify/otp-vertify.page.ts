import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-otp-vertify',
  templateUrl: './otp-vertify.page.html',
  styleUrls: ['./otp-vertify.page.scss'],
})
export class OtpVertifyPage implements OnInit {
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input',
    placeholder: '#'
  }
  code: any;
  phone: any;
  constructor(
    private dataService: DataService,
    private helper: HelpersService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.phone = this.dataService.myParams.phone
  }

  onOtpChange(ev?: any) {
    console.log(ev);
    this.code = ev;
  }

  back() {
    this.navCtrl.navigateBack('/otp')
  }
  sendCode() {
    let ver = {
      code: this.code,
      verificationId: localStorage.getItem('otpId'),
    };
    this.dataService.postOtp('/verify', ver).subscribe(
      (res: any) => {
        if (res.verified) {
          localStorage.removeItem('otpId');
          localStorage.setItem('verified', 'true');
          localStorage.setItem('vertifiedNumber', this.phone)
          this.helper.presentToast('تم التاكيد بنجاح');
          this.navCtrl.navigateRoot('/register')
          // this.dismiss(res.verified);
        } else {
          this.helper.presentToast('الكود الذي ادخلته غير صحيح');
        }
      },
      (err: any) => {
        console.log(err);
        this.helper.presentToast('خطأ بالسيرفر يرجي المحاوله لاحقا');
      }
    )
  }
}
