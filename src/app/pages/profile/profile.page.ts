import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';
import { DataService } from '../../services/data/data.service';
import { HelpersService } from '../../services/helpers/helpers.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  userId: any;
  userData: any;
  builds: any[] = [];
  skip: number = 0;
  adGender: any;
  adGenders: any[] = [];

  constructor(
    private helper: HelpersService,
    private dataService: DataService,
    private route: ActivatedRoute,
    private navCtrl: NavController
  ) { }

  ngOnInit(): void {
    this.userId = this.route.snapshot.params['id'];
    // this.getDepartments(this.route.snapshot.params['id'])
    // this.getaddGender()
    this.getData()
  }

  // getaddGender() {
  //   this.dataService.getData('/adGender')
  //     .subscribe((res: any) => {
  //       console.log(res);
  //       this.adGenders = res;
  //       // this.adGender = this.adGenders[0]._id
  //     })
  // }

  get endPoint(): string {
    let url = `/build/${this.userId}`
    if (this.skip) url += `&skip=${this.skip}`;
    if (this.adGender) url += `&adGender=${this.adGender}`;
    return url.replace('&', '?');
  }
  getData() {
    this.dataService.getData(this.endPoint)
      .subscribe((res: any) => {
        console.log(res);
        this.userData = res['user']
        this.builds = res['builds']
        this.adGenders = res['adgenders']
      })
  }
  segmentChanged(ev: any) {
    console.log(ev.detail.value);
    this.getData()
  }
  details(build: any) {
    this.dataService.addParams = { build }
    this.navCtrl.navigateForward('details')
  }
  back() {
    this.navCtrl.navigateBack('/home')
  }
  async whatsapp() {
    await Browser.open({ url: `https://wa.me/+964${this.userData.number}` });
  }


  call() {
    window.open(`tel:${this.userData.phone}`)
  }
}
