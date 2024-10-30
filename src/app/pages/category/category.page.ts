import { HelpersService } from './../../services/helpers/helpers.service';
import { LocationService } from './../../services/location/location.service';
import { DataService } from './../../services/data/data.service';
import { IonModal, IonPopover, NavController } from '@ionic/angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-category',
  templateUrl: './category.page.html',
  styleUrls: ['./category.page.scss'],
})
export class CategoryPage implements OnInit, OnDestroy {
  @ViewChild('popover') popover: IonPopover;
  isOpen = false;
  @ViewChild('modal') filterModal: IonModal;
  typeBuild: any;
  loading: boolean = true;
  errorView: boolean = false;
  emptyView: boolean = false;
  searchQuery: string = '';
  disableInfinity: boolean = false;
  skip: number = 0;
  building: any[] = [];
  searchbarShow = true;

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
  roomsNumber: number | null = null;
  bathroomNumber: number | null = null;
  buildYear: number | null = null;
  sort: boolean = false;
  subzone: string | null = null;

  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private helper: HelpersService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.typeBuild = this.dataService.myParams.type;
    this.getdataFilters();
    this.getBuilds();
  }

  getBuilds(ev?: any) {
    this.dataService.getData(this.endPoint).subscribe(
      (res: any) => {
        console.log(res);
        this.building = this.skip ? this.building.concat(res) : res;
        this.building.length
          ? this.showContentView(ev)
          : this.showEmptyView(ev);
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
      this.dataService.getData(`/adGender?buildType=${this.typeBuild._id}`),
    ]).subscribe((res: any[]) => {
      console.log(res);
      this.citys = res[0];
      this.bondTypes = res[1];
      this.adTypes = res[2];
      this.adStatuss = res[3];
      this.adGenders = res[4].filter((item: any) => item['countBuilds'] > 0);
    });
  }
  getZones() {
    this.dataService
      .getData(`/subzone?city=${this.city}`)
      .subscribe((res: any) => {
        this.subzones = res;
      });
  }
  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    this.building = [];

    this.adGender = ev.detail.value;
    this.skip = 0;
    this.getBuilds();
  }

  back() {
    this.navCtrl.back();
  }

  get endPoint(): string {
    let location = this.locationService.currentLocation;
    let url = '/build/';
    url += `&buildType=${this.typeBuild._id}`;
    if (this.skip) url += `&skip=${this.skip}`;
    if (this.city) url += `&city=${this.city}`;
    if (this.sort)
      url += `&sort=${this.sort}&lng=${location.lng}&lat=${location.lat}`;
    if (this.adStatus) url += `&adStatus=${this.adStatus}`;
    if (this.adGender) url += `&adGender=${this.adGender}`;
    if (this.adType) url += `&adType=${this.adType}`;
    if (this.bondType) url += `&bondType=${this.bondType}`;
    if (this.roomsNumber) url += `&roomsNumber=${this.roomsNumber}`;
    if (this.bathroomNumber) url += `&bathroomNumber=${this.bathroomNumber}`;
    if (this.buildYear) url += `&buildYear=${this.buildYear}`;
    if (this.searchQuery) url += `&searchText=${this.searchQuery}`;
    if (this.subzone) url += `&subzone=${this.subzone}`;

    return url.replace('&', '?');
  }
  onSearchChange(ev?: Event) {
    this.getBuilds();
  }

  async openFilterModal() {
    await this.filterModal.present();
  }
  trackFu(build: any) {
    return build?._id;
  }

  doRefresh(ev: any) {
    this.skip = 0;
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
  details(build: any) {
    if (build.adStatus._id != '64e5e2a42fc638b85f5c2fcd')
      this.helper.presentToast(`هذا العقار ${build.adStatus.name}`);
    else {
      this.dataService.addParams = { build };
      this.helper.navigateForward('details/' + build._id);
    }
  }
  clearFilter() {
    this.adGender = null;
    this.adStatus = null;
    this.adType = null;
    this.bondType = null;
    this.buildYear = null;
    this.city = null;
    this.subzone = null;
    this.filterModal.dismiss();
    this.getBuilds();
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
  ngOnDestroy() {
    this.dataService.addParams = {};
  }
}
