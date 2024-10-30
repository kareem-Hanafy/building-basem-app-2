import { AuthService } from './../../services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form!: FormGroup;
  phone: any;
  // userTypes:[]<userType> =[]
  userTypes: any[] = []
  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private dataService: DataService,
    private helper: HelpersService,
    private authService: AuthService
  ) {
    this.createForm()
  }

  ngOnInit() {
    this.getuserTypes();
    this.phone = localStorage.getItem('vertifiedNumber')
    console.log(this.authService.userData);
    console.log(this.phone);

  }

  createForm() {
    this.form = this.fb.group({
      fullName: [''],
      // phone: ['', Validators.required],
      userType: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    })

  }

  back() {
    this.navCtrl.back()
  }

  getuserTypes() {
    this.dataService.getData('/userType')
      .subscribe((res: any) => {
        this.userTypes = res
      }, (err) => {
        console.log(err);
        this.helper.presentToast(err.message)
      })
  }

  submit() {
    let body = this.form.value;
    console.log(this.authService.userData);
    if (this.form.value.password_confirmation != this.form.value.password) return this.helper.presentToast('كلمة المرور غير متطابقة')
    delete body.password_confirmation;
    body.phone = this.phone;

    if (this.authService.userData) {
      return this.authService.updateUser(body)
    } else {
      return this.authService.register(body)
    }


  }

  navigate(route: string) {
    this.navCtrl.navigateForward(route)
  }
}
