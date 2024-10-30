import { AuthService } from './../../services/auth/auth.service';
import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(
    private navCtrl: NavController,
    private authService: AuthService
  ) { }

  ngOnInit() {
  }


  navigate(route: string) {
    this.navCtrl.navigateForward(route)
  }

  loginAsVisitor() {
    this.authService.loginVisitor()
  }
}
