import { LocationService } from './../../services/location/location.service';
import { AuthService } from './../../services/auth/auth.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { CameraService } from './../../services/camera/camera.service';
import { DataService } from 'src/app/services/data/data.service';
import { forkJoin } from 'rxjs';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
// import SwiperCore, { Pagination, Navigation } from 'swiper';
// SwiperCore.use([Pagination, Navigation]);

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class AddPage implements OnInit, OnDestroy {
  form: FormGroup = new FormGroup({});
  buildTypes: any[] = [];
  bondTypes: any[] = [];
  adTypes: any[] = [];
  adStatus: any[] = [];
  adGender: any[] = [];
  citys: any[] = [];
  imagesFromDevice: any[] = [];
  imagesToSubmit: any[] = [];
  currentLocation: {} | null = null;
  locationType: string | null = 'map';
  mapLocation: {} | null = null;
  step: number = 1;
  mapOpened: boolean = false;
  editedBuild: any;
  constructor(
    private navCtrl: NavController,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private cameraService: CameraService,
    private helper: HelpersService,
    private authService: AuthService,
    private locationService: LocationService,
    private alertCtrl: AlertController
  ) {
    this.createForm();
  }

  ngOnInit() {
    // this.getTypes()
  }

  ionViewWillEnter() {
    // console.log(this.dataService.myParams.mapLocation);

    if (this.dataService.myParams.mapLocation) {
      this.mapLocation = this.dataService.myParams.mapLocation;
      this.helper.presentToast('تم تحديد الموقع بنجاح');
    }
    this.editedBuild = this.dataService.myParams.build;
    if (this.editedBuild) {
      console.log(this.editedBuild);
      this.patchMyForm(this.editedBuild);
    }
  }

  patchMyForm(data: any) {
    this.form.patchValue(this.editedBuild);
    // this.mapLocation = this.editedBuild.location
    this.imagesToSubmit = this.editedBuild.images;
    this.form.patchValue({
      city: data.city._id,
      bondType: data.bondType._id,
      adType: data.adType._id,
      adGender: data.adGender._id,
      buildType: data.buildType._id,
    });
  }
  getTypes() {
    forkJoin([
      this.dataService.getData('/buildType'),
      this.dataService.getData('/bondType'),
      // this.dataService.getData('/adType'),
      // this.dataService.getData('/adStatus'),
      this.dataService.getData('/adGender'),
      this.dataService.getData('/citys'),
    ]).subscribe((res: any[]) => {
      this.buildTypes = res[0];
      this.bondTypes = res[1];
      // this.adTypes = res[2]
      // this.adStatus = res[3]
      this.adGender = res[2];
      this.citys = res[3];
    });
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      address: [''],
      price: [''],
      area: [''],
      roomsNumber: [''],
      bedsNumber: [''],
      bathroomNumber: [''],
      buildYear: [''],
      description: [''],
      phoneCall: [''],
      whatsapp: [''],
      bondType: [''],
      interface: [''],
      floorsNumber: [''],
      depth: [''],
      // adType: [''],
      // adStatus: [''],
      adGender: [''],
      buildType: ['', Validators.required],
      city: [''],
    });
  }

  back() {
    this.navCtrl.back();
  }
  selectImage() {
    // console.log('clicked');
    this.cameraService.showActionSheet().then((val) => {
      if (val) this.imagesFromDevice.push(val);
    });
  }

  async getCurrentLocation() {
    this.locationType = 'current';
    this.locationService.getCurrentLocation().then((val) => {
      this.currentLocation = val;
      this.helper.presentToast('تم تحديد موقعك بنجاح');
    });
  }

  getMapLocation() {
    this.locationType = 'map';
  }

  async submit() {
    // this.helper.showLoading('جاري نشر الاعلان');
    // let uploadedImages = this.imagesFromDevice.length
    //   ? await this.cameraService.uploadImages(this.imagesFromDevice)
    //   : [];
    // this.imagesToSubmit = this.imagesToSubmit.concat(uploadedImages);
    // let location = this.location;
    // if (!this.editedBuild && !location)
    //   return (
    //     this.helper.presentToast('يجب تحديد موقع العقار'),
    //     this.helper.dismissLoading()
    //   );
    // let body = {
    //   images: this.imagesToSubmit,
    //   ...this.form.value,
    //   user: this.authService.userData?._id,
    // };

    // if (this.location)
    //   body['location'] = { coordinates: [location.lng, location.lat] };
    // if (this.editedBuild) {
    //   this.updateBuild(body);
    // } else {
    //   this.addBuild(body);
    // }
    this.navCtrl.navigateRoot('/home');
    this.helper.presentToast('تم اضافة الاعلان بنجاح');
  }
  updateBuild(body: any) {
    this.dataService
      .updateData(`/build/${this.editedBuild._id}`, body)
      .subscribe(
        (res) => {
          this.helper.dismissLoading();
          this.navCtrl.navigateRoot('/home');
          this.helper.presentToast('تم تعديل الاعلان بنجاح');
        },
        (err) => {
          console.log(err);
          this.helper.presentToast('خطأ برفع البيانات اعد المحاولة');
          this.helper.dismissLoading();
        }
      );
  }
  addBuild(body: any) {
    this.dataService.postData('/build', body).subscribe(
      (res) => {
        this.helper.dismissLoading();
        this.navCtrl.navigateRoot('/home');
        this.helper.presentToast('تم اضافة الاعلان بنجاح');
      },
      (err) => {
        this.helper.presentToast('خطأ برفع البيانات اعد المحاولة');
        this.helper.dismissLoading();
      }
    );
  }
  get location(): any {
    let location = null;
    if (this.locationType == 'current' && this.currentLocation)
      location = this.currentLocation;
    if (this.locationType == 'map' && this.mapLocation)
      location = this.mapLocation;
    return location;
  }
  //########   Map Modal
  async openMap() {
    this.navCtrl.navigateForward('/map');
  }

  async deleteImage(img: any, index: number, type: string) {
    const alert = await this.alertCtrl.create({
      header: 'حذف الصورة',
      message: 'متأكد من حذف هذة الصورة',
      mode: 'ios',
      buttons: [
        {
          text: 'حذف',
          handler: () => {
            if (type == 'device') this.imagesFromDevice.splice(index, 1);
            else if (type == 'submit') this.imagesToSubmit.splice(index, 1);
          },
          cssClass: 'danger',
        },
        {
          text: 'الغاء',
          role: 'cancel',
          cssClass: 'dark',
        },
      ],
    });
    await alert.present();
  }

  ngOnDestroy(): void {
    this.dataService.addParams = {};
  }
}
