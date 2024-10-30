import { NavController } from '@ionic/angular';
import { DataService } from './../../services/data/data.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-wish-detail',
  templateUrl: './wish-detail.page.html',
  styleUrls: ['./wish-detail.page.scss'],
})
export class WishDetailPage implements OnInit, OnDestroy {
  wish: any;
  constructor(
    private dataService: DataService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.wish = this.dataService.myParams.wish;
    console.log(this.wish)
  }

  back() {
    this.navCtrl.back()
  }

  ngOnDestroy(): void {
    this.dataService.addParams = {}
  }
}
