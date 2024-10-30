import { HelpersService } from './../../services/helpers/helpers.service';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { LocationService } from './../../services/location/location.service';
import { DataService } from './../../services/data/data.service';
import { IonModal, IonPopover, NavController } from '@ionic/angular';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-builds',
  templateUrl: './builds.page.html',
  styleUrls: ['./builds.page.scss'],
})
export class BuildsPage implements OnInit {

  wishlist: any;

  @ViewChild('popover') popover: IonPopover;
  isOpen = false;
  loading: boolean = true
  errorView: boolean = false
  emptyView: boolean = false
  disableInfinity: boolean = false;
  skip: number = 0;
  sort: boolean = false
  building: any[] = [];


  /// filter values
  city: string | null = null;
  adGender: string | null = null;
  bondType: string | null = null;
  buildType: string | null = null;
  buildYear: number | null = null;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private helper: HelpersService,
    private locationService: LocationService
  ) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.wishlist = this.dataService.myParams.wishlist;
    console.log(this.wishlist);

    this.patchValueEndPoint()
    this.getBuilds();
  }

  getBuilds(ev?: any) {
    this.dataService.getData(this.endPoint)
      .subscribe((res: any) => {
        console.log(res);
        this.building = this.skip ? this.building.concat(res) : res;
        this.building.length ? this.showContentView(ev) : this.showEmptyView(ev);
        this.disableInfinity = res?.length != 20
      }, (err) => {
        this.showErrorView(ev)
      })
  }

  back() {
    this.navCtrl.back()
  }

  patchValueEndPoint() {
    if (this.wishlist.buildType.length) this.buildType = this.wishlist.buildType.map((item: any) => item["_id"]).join(',')
    if (this.wishlist.bondType.length) this.bondType = this.wishlist.bondType.map((item: any) => item["_id"]).join(',')
    if (this.wishlist.adGender.length) this.adGender = this.wishlist.adGender.map((item: any) => item["_id"]).join(',')
    if (this.wishlist.city.length) this.city = this.wishlist.city.map((item: any) => item["_id"]).join(',')
  }
  get endPoint(): string {

    let url = '/build/wishlist/'
    if (this.buildType) url += `&buildType=${this.buildType}`
    if (this.skip) url += `&skip=${this.skip}`;
    if (this.city) url += `&city=${this.city}`;
    if (this.adGender) url += `&adGender=${this.adGender}`;
    if (this.bondType) url += `&bondType=${this.bondType}`;
    // if (this.searchQuery) url += `&searchText=${this.searchQuery}`;

    return url.replace('&', '?');
  }

  trackFu(build: any) {
    return build?._id
  }
  doRefresh(ev: any) {
    this.skip = 0
    this.getBuilds(ev);
  }

  loadData(ev: any) {
    this.skip += 1
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
    if (build.adStatus._id != '63cfb3527fbccb084be60c1e') this.helper.presentToast(`هذا العقار ${build.adStatus.name}`)
    else {
      this.dataService.addParams = { build }
      this.helper.navigateForward('details')
    }
  }
  presentPopover(e: Event) {
    this.popover.event = e;
    this.isOpen = true;
  }
}
