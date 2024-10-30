import { AuthService } from 'src/app/services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { HelpersService } from './../../services/helpers/helpers.service';
import { DataService } from 'src/app/services/data/data.service';
import { Component, OnInit } from '@angular/core';
import { parsePhoneNumber } from 'libphonenumber-js';

@Component({
  selector: 'app-forget-pass',
  templateUrl: './forget-pass.page.html',
  styleUrls: ['./forget-pass.page.scss'],
})
export class ForgetPassPage implements OnInit {
  phone: any;
  step: number = 1;
  config = {
    length: 6,
    allowNumbersOnly: true,
    inputClass: 'otp-input',
    placeholder: '#'
  }
  code: any;
  newPass: any;
  newPassConfirm: any;
  constructor(
    private dataService: DataService,
    private helper: HelpersService,
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  back() {
    this.navCtrl.navigateBack('/welcome')
  }

  validPhoneNumber(number: string) {
    return parsePhoneNumber(number, `IQ`);
  }
  onOtpChange(ev?: any) {
    console.log(ev);
    this.code = ev;
  }

  submit() {
    if (this.step == 1) this.sendOtp();
    if (this.step == 2) this.sendCode();
    if (this.step == 3) this.changePassword();
  }
  sendOtp() {
    if (!this.validPhoneNumber(this.phone).isValid()) this.helper.presentToast('رقم الهاتف غير صالح')
    else {
      this.helper.showLoading();
      this.dataService.getData(`/user/isValid/${this.phone}`)
        .subscribe((res: any) => {
          console.log(res);
          if (res.valid == false) this.submitSendingOtp();
          else {
            this.helper.dismissLoading();
            this.helper.presentToast('هذا الرقم مستخدم من قبل')
          }
        })
    }
  }
  submitSendingOtp() {
    this.dataService.postOtp('/send', { phone: this.phone })
      .subscribe((res: any) => {
        this.dataService.addParams = { phone: this.phone }
        localStorage.setItem('otpId', res.verificationId);
        this.helper.dismissLoading();
        this.helper.presentToast('تم ارسال الكود بنجاح')
        this.step = 2;
        // this.navCtrl.navigateForward('/otp-vertify')
        console.log(res);
      })
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
          // localStorage.setItem('verified', 'true');
          // localStorage.setItem('vertifiedNumber', this.phone)
          this.helper.presentToast('تم التاكيد بنجاح');
          this.step = 3;
          // this.navCtrl.navigateRoot('/register')
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
  changePassword() {
    if (this.newPass != this.newPassConfirm) return this.helper.presentToast("كلمة المرور غير متطابقة");
    else {
      return this.authService.changePassword({
        phone: this.phone,
        password: this.newPass
      })
    }
  }

}
