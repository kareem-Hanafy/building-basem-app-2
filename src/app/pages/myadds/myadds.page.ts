import { HelpersService } from './../../services/helpers/helpers.service';
import { AuthService } from './../../services/auth/auth.service';
import { DataService } from './../../services/data/data.service';
import { IonModal, IonPopover, NavController } from '@ionic/angular';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-myadds',
  templateUrl: './myadds.page.html',
  styleUrls: ['./myadds.page.scss'],
})
export class MyaddsPage implements OnInit {
  // my ID
  myId: string;
  @ViewChild('modal') filterModal: IonModal;
  @ViewChild('popover') popover: IonPopover;
  isOpen = false;
  loading: boolean = false;
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

  /// filter values
  city: string | null = null;
  adStatus: string | null = null;
  adGender: string | null = null;
  adType: string | null = null;
  bondType: string | null = null;
  roomsNumber: number | null = null;
  bathroomNumber: number | null = null;
  buildYear: number | null = null;

  selectedBuild: any;
  constructor(
    private navCtrl: NavController,
    private dataService: DataService,
    private authService: AuthService,
    private helper: HelpersService
  ) {}

  ngOnInit() {
    // this.myId = this.authService.userData._id
    // this.getdataFilters();
    // this.getBuilds();
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
      this.dataService.getData('/adGender'),
    ]).subscribe((res: any[]) => {
      // console.log(res);
      this.citys = res[0];
      this.bondTypes = res[1];
      this.adTypes = res[2];
      this.adStatuss = res[3];
      console.log(this.adStatuss);

      this.adGenders = res[4];
    });
  }

  back() {
    this.navCtrl.navigateBack('/menu');
  }

  get endPoint(): string {
    let url = `/build/&userId=${this.myId}`;
    // url += `&buildType=${this.typeBuild._id}`
    if (this.skip) url += `&skip=${this.skip}`;
    if (this.city) url += `&city=${this.city}`;
    if (this.adStatus) url += `&adStatus=${this.adStatus}`;
    if (this.adGender) url += `&adGender=${this.adGender}`;
    if (this.adType) url += `&adType=${this.adType}`;
    if (this.bondType) url += `&bondType=${this.bondType}`;
    if (this.roomsNumber) url += `&roomsNumber=${this.roomsNumber}`;
    if (this.bathroomNumber) url += `&bathroomNumber=${this.bathroomNumber}`;
    if (this.buildYear) url += `&buildYear=${this.buildYear}`;
    if (this.searchQuery) url += `&searchText=${this.searchQuery}`;

    return url.replace('&', '?');
  }
  onSearchChange(ev?: Event) {
    console.log(ev);
    console.log(this.searchQuery);
    this.getBuilds();
  }

  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    this.getBuilds();
  }
  updateStatus(id: string) {
    this.dataService
      .updateData(`/build/${this.selectedBuild._id}`, {
        adStatus: id,
      })
      .subscribe((res) => {
        console.log(res);
        this.helper.presentToast('تم تعديل الحالة بنجاح');
        this.getBuilds();
      });
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
    this.dataService.addParams = { build };
    this.navCtrl.navigateForward('details');
  }
  clearFilter() {
    this.adGender = null;
    this.adStatus = null;
    this.adType = null;
    this.bondType = null;
    this.buildYear = null;
    this.city = null;
    this.filterModal.dismiss();
    this.getBuilds();
  }

  ngOnDestroy() {
    this.dataService.addParams = {};
  }

  optionsPopOver(ev: any, build: any) {
    this.selectedBuild = build;
    this.popover.event = ev;
    this.isOpen = true;
  }

  edit() {
    this.dataService.addParams = { build: this.selectedBuild };
    this.navCtrl.navigateForward('/add');
  }
}
