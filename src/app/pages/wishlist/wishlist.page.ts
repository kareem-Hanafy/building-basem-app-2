import { Component, OnInit, ViewChild } from '@angular/core';
import { IonPopover, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { DataService } from 'src/app/services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
})
export class WishlistPage implements OnInit {
  @ViewChild('popover') popover: IonPopover;
  isOpen = false;

  myId: string;
  loading: boolean = false;
  errorView: boolean = false;
  emptyView: boolean = false;
  disableInfinity: boolean = false;
  skip: number = 0;
  wishlists: any[] = [];

  selectedWish: any;
  selectedIndex: number;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private authService: AuthService,
    private helper: HelpersService
  ) {}

  ngOnInit() {
    // this.myId = this.authService.userData._id
  }
  ionViewWillEnter() {
    // this.getWishlist()
  }
  getWishlist(ev?: any) {
    this.dataService.getData(`/wishlist`).subscribe(
      (res: any) => {
        console.log(res);
        this.wishlists = this.skip ? this.wishlists.concat(res) : res;
        this.wishlists.length
          ? this.showContentView(ev)
          : this.showEmptyView(ev);
        this.disableInfinity = res?.length != 20;
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }

  showContentView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = false;
    this.disableInfinity = false;
    if (ev) ev.target.complete();
  }

  showErrorView(ev?: any) {
    this.loading = false;
    this.errorView = true;
    this.emptyView = false;
    if (ev) ev.target.complete();
  }

  showEmptyView(ev?: any) {
    this.loading = false;
    this.errorView = false;
    this.emptyView = true;
    if (ev) ev.target.complete();
  }

  back() {
    this.navCtrl.navigateBack('/menu');
  }
  doRefresh(ev: any) {
    this.skip = 0;
    this.getWishlist(ev);
  }

  items(wishlist: any) {
    this.dataService.addParams = { wishlist };
    this.navCtrl.navigateForward('builds');
  }

  addWishList() {
    this.navCtrl.navigateForward('/add-wishlist');
  }

  loadData(ev: any) {
    this.skip += 1;
    this.getWishlist(ev);
  }

  optionsPopOver(ev: any, wish: any, index: number) {
    this.selectedWish = wish;
    this.selectedIndex = index;
    this.popover.event = ev;
    this.isOpen = true;
  }

  deleteWish() {
    this.dataService
      .deleteDate(`/wishlist/${this.selectedWish._id}`)
      .subscribe((res) => {
        console.log(res);
        this.wishlists.splice(this.selectedIndex, 1);
        this.helper.presentToast('تم حذف الرغبة بنجاح');
      });
  }

  details() {
    this.dataService.addParams = { wish: this.selectedWish };
    this.navCtrl.navigateForward('wish-detail');
  }
}
