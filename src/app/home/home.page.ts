import { LocationService } from './../services/location/location.service';
import { AuthService } from './../services/auth/auth.service';
import { DataService } from './../services/data/data.service';
import { HelpersService } from 'src/app/services/helpers/helpers.service';
import { IonModal, IonPopover, NavController } from '@ionic/angular';
import { Component, OnInit, AfterViewInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { forkJoin } from 'rxjs';
import { Browser } from '@capacitor/browser';
import { register } from 'swiper/element/bundle';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomePage implements OnInit, AfterViewInit {
  @ViewChild('modal') filterModal: IonModal;
  userImage: string = '';
  @ViewChild('popover') popover: IonPopover;
  isOpen = false;
  buildTypes: any[] = [];
  builds: any[] = [];
  offersBuilding: any[] = [];
  skip: number = 0;
  loading: boolean = false;
  errorView: boolean = false;
  emptyView: boolean = false;
  disableInfinity: boolean = false;
  searchQuery: string = '';

  /// filter data
  bondTypes: any[] = [];
  adTypes: any[] = [];
  adStatuss: any[] = [];
  adGenders: any[] = [];
  citys: any[] = [];
  subzones: any[] = [];
  /// filter values
  city: string | null = null;
  adStatus: string | null = null;
  adGender: string | null = null;
  adType: string | null = null;
  bondType: string | null = null;
  subzone: string | null = null;

  addOption: boolean = false;
  constructor(
    private helper: HelpersService,
    private dataService: DataService,
    private authService: AuthService,
    private locationService: LocationService
  ) {
    register();
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.userImage = this.authService.userData?.image;
    this.getTypes();
    this.getBuilds();
    this.getOffers();
    this.getdataFilters();
    this.getAddOption();
    if (!this.locationService.currentLocation)
      this.locationService.getCurrentLocation();
  }


  ngAfterViewInit() {
    // Configure Swiper after view initialization
    setTimeout(() => {
      const swiperEl = document.querySelector('swiper-container.homeSlider') as any;
      if (swiperEl) {
        Object.assign(swiperEl, {
          breakpoints: {
            640: {
              slidesPerView: 2.5,
              spaceBetween: 20,
            },
            768: {
              slidesPerView: 3.2,
              spaceBetween: 40,
            },
            1024: {
              slidesPerView: 4.2,
              spaceBetween: 50,
            },
          },
        });
        swiperEl.initialize();
      }
    }, 100);
  }
  getTypes() {
    this.dataService.getData('/buildType').subscribe((res: any) => {
      console.log(res);

      this.buildTypes = res;
    });
  }
  getAddOption() {
    this.dataService.getData('/setting').subscribe((res: any) => {
      this.addOption = res?.addOption || false;
    });
  }
  getOffers() {
    this.dataService
      .getData(`/build/?adType=64e5e2572fc638b85f5c2fb3`)
      .subscribe((res: any) => {
        console.log('offers ===>', res);

        this.offersBuilding = res;
      });
  }
  getBuilds(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe(
      (res: any) => {
        console.log(res);
        this.builds = this.skip ? this.builds.concat(res) : res;
        this.builds.length ? this.showContentView(ev) : this.showEmptyView(ev);
        this.disableInfinity = res?.length != 20;
      },
      (err) => {
        this.showErrorView(ev);
      }
    );
  }

  getdataFilters() {
    forkJoin([
      this.dataService.getData('/citys'),
      this.dataService.getData('/bondType'),
      this.dataService.getData('/adType'),
      this.dataService.getData('/adStatus'),
      this.dataService.getData('/adGender'),
    ]).subscribe((res: any[]) => {
      console.log(res);
      this.citys = res[0];
      this.bondTypes = res[1];
      this.adTypes = res[2];
      this.adStatuss = res[3];
      this.adGenders = res[4];
    });
  }
  get endPoint(): string {
    let url = '/build/';
    if (this.skip) url += `&skip=${this.skip}`;
    if (this.searchQuery) url += `&searchText=${this.searchQuery}`;
    if (this.city) url += `&city=${this.city}`;
    if (this.adStatus) url += `&adStatus=${this.adStatus}`;
    if (this.adGender) url += `&adGender=${this.adGender}`;
    if (this.adType) url += `&adType=${this.adType}`;
    if (this.bondType) url += `&bondType=${this.bondType}`;
    if (this.subzone) url += `&subzone=${this.subzone}`;

    return url.replace('&', '?');
  }
  getZones() {
    this.dataService
      .getData(`/subzone?city=${this.city}`)
      .subscribe((res: any) => {
        this.subzones = res;
      });
  }
  onSearchChange(ev?: Event) {
    this.getBuilds();
  }

  trackFu(build: any) {
    return build?._id;
  }

  doRefresh(ev: any) {
    this.skip = 0;
    this.filterReset();
    this.getTypes();
    this.getOffers();
    this.getAddOption();
    this.getBuilds(ev);
  }

  loadData(ev: any) {
    this.skip += 1;
    this.getBuilds(ev);
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
  navigate(route: string) {
    this.helper.navigateForward(route);
  }

  detailsType(type: any) {
    this.dataService.addParams = { type };
    this.helper.navigateForward('category');
  }
  detailsBuild(build: any) {
    if (build.adStatus._id != '64e5e2a42fc638b85f5c2fcd')
      this.helper.presentToast(`هذا العقار ${build.adStatus.name}`);
    else {
      this.dataService.addParams = { build };
      this.helper.navigateForward('details/' + build._id);
    }
  }
  addBuild() {
    // if (
    //   this.authService.userData?.phone &&
    //   this.authService.userData?.phone != 'visitor'
    // ) {
    this.helper.navigateForward('add');
    // } else {
    //   this.helper.presentToast('يجب تسجيل بياناتك اولا');
    //   this.helper.navigateForward('welcome');
    // }
  }

  menu() {
    // if (
    //   this.authService.userData?.phone &&
    //   this.authService.userData?.phone != 'visitor'
    // ) {
    this.helper.navigateForward('menu');
    // } else {
    //   this.helper.presentToast('يجب تسجيل بياناتك اولا');
    //   this.helper.navigateForward('welcome');
    // }
  }

  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }

  filterReset() {
    this.adGender = null;
    this.adStatus = null;
    this.adType = null;
    this.city = null;
    this.searchQuery = '';
    this.bondType = null;
    this.skip = 0;
    this.subzone = null;
  }

  async filter() {
    await this.filterModal.present();
  }

  clearFilter() {
    this.adGender = null;
    this.adStatus = null;
    this.adType = null;
    this.bondType = null;
    this.city = null;
    this.subzone = null;
    this.filterModal.dismiss();
    this.getBuilds();
  }

  logOut() {
    this.authService.logOut();
  }

  async whatsapp(number: any) {
    await Browser.open({ url: `https://wa.me/+964${number}` });
  }
}
