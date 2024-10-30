import { AuthService } from 'src/app/services/auth/auth.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { DataService } from 'src/app/services/data/data.service';
import { NavController } from '@ionic/angular';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-add-wishlist',
  templateUrl: './add-wishlist.page.html',
  styleUrls: ['./add-wishlist.page.scss'],
})
export class AddWishlistPage implements OnInit, OnDestroy {
  editeWishlist: any = null;
  form: FormGroup = new FormGroup({});
  buildTypes: any[] = []
  bondTypes: any[] = []
  adGender: any[] = []
  citys: any[] = []
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private helper: HelpersService,
    private formBuilder: FormBuilder,

  ) {
    this.createForm()
  }

  ngOnInit() {
    this.getTypes()
  }
  getTypes() {
    forkJoin([
      this.dataService.getData('/buildType'),
      this.dataService.getData('/bondType'),
      this.dataService.getData('/adGender'),
      this.dataService.getData('/citys'),
    ]).subscribe((res: any[]) => {
      this.buildTypes = res[0]
      this.bondTypes = res[1]
      this.adGender = res[2]
      this.citys = res[3]
    })
  }

  createForm() {
    this.form = this.formBuilder.group({
      title: ['', Validators.required],
      bondType: [''],
      adGender: [''],
      buildType: [''],
      city: ['']
    })
  }

  async submit() {
    this.helper.showLoading('جاري رفع البيانات')

    let body = this.form.value
    console.log(body);

    if (this.editeWishlist) {
      this.updateWishlist(body)
    } else {
      this.addWishlist(body)
    }
  }
  updateWishlist(body: any) {
    this.dataService.updateData(`/wishlist/${this.editeWishlist?._id}`, body).subscribe((res) => {
      this.helper.dismissLoading()
      this.navCtrl.navigateRoot('/menu');
      this.helper.presentToast('تم تعديل الرغبة بنجاح')
    }, (err) => {
      console.log(err);
      this.helper.presentToast('خطأ برفع البيانات اعد المحاولة');
      this.helper.dismissLoading()
    })
  }
  addWishlist(body: any) {
    this.dataService.postData('/wishlist', body).subscribe((res) => {
      this.helper.dismissLoading()
      this.navCtrl.navigateRoot('/menu');
      this.helper.presentToast('تم اضافة الرغبة بنجاح')
    }, (err) => {
      this.helper.presentToast('خطأ برفع البيانات اعد المحاولة');
      this.helper.dismissLoading()
    })
  }

  back() {
    this.navCtrl.back()
  }

  ngOnDestroy(): void {
    this.dataService.addParams = {}
  }
}
