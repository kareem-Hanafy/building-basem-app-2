import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { AuthService } from './../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form!: FormGroup;

  constructor(
    private navCtrl: NavController,
    private fb: FormBuilder,
    private dataService: DataService,
    private helper: HelpersService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.createForm()
  }


  createForm() {
    this.form = this.fb.group({
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
    })
  }

  submit() {
    let body = this.form.value;
    this.authService.login(body)
  }

  back() {
    this.navCtrl.navigateBack('/welcome')
  }

  navigate(route: string) {
    this.navCtrl.navigateForward(route)
  }

  forgetPassword() {
    this.navCtrl.navigateForward('forget-pass')
  }
}
