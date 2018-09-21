import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  public country:any;
  public phone:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http) {
    this.phone = navParams.get('message');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  ionViewWillEnter() {
  let tabs = document.querySelectorAll('.tabbar');
  if ( tabs !== null ) {
    Object.keys(tabs).map((key) => {
      tabs[ key ].style.transform = 'translateY(56px)';
    });
  } // end if
}

  login(){
    this.navCtrl.setRoot(LoginPage);
  }

}
