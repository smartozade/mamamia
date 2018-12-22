import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Thumbnail } from 'ionic-angular';
import {LoginPage} from '../login/login';
import {HistoryPage} from '../history/history';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {
  public language:any;
  public phone:any;
  public currency:any;
  public user;
  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http) {
    this.phone = navParams.get('message');
    this.user =JSON.parse(window.localStorage.getItem('userDetails'));
    this.currency = this.user.currency.symbol;
    console.log(this.currency);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
  }

  logout(){
    this.navCtrl.setRoot(LoginPage);
  }

  contact(){
    this.navCtrl.push(HistoryPage,{contact:'contact'});
  }


}
