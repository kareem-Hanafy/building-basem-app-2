import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CameraService } from 'src/app/services/camera/camera.service';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  form: FormGroup;
  image: any;
  userData: any;
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private navCtrl: NavController,
    private cameraService: CameraService,
    private helper: HelpersService,
    private authService: AuthService
  ) {
    this.createFrom();
  }
  createFrom() {
    this.form = this.fb.group({
      fullName: [''],
      address: [''],
    });
  }

  ngOnInit() {
    this.userData = this.authService.userData;
    this.form.patchValue(this.userData);
  }

  back() {
    this.navCtrl.back();
  }
  selectImage() {
    console.log('clicked');
    this.cameraService.showActionSheet().then((val) => {
      this.image = val;
    });
  }

  async submit() {
    let image;
    if (this.image) {
      image = await this.cameraService.uploadOneImage(this.image);
    }
    let body = {
      image,
      ...this.form.value,
    };
    if (!this.image) delete body.image;
    console.log(body);
    this.authService.updateUser(body);
  }
}
