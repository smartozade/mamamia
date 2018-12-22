import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ConnectProvider} from '../../providers/connect/connect';
import 'rxjs/add/operator/map';


@IonicPage()
@Component({
  selector: 'page-message',
  templateUrl: 'message.html',
})
export class MessagePage {
  public userDetails:any;
  public test:any;
  public history:any;
  public server:any;
  public token:any;

  showLevel1 = null;
  showLevel2 = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http, private connect:ConnectProvider) {
    this.test = 'You don\'t have Payement records yet';    
    
  }

  doRefresh(refresher) {
    setTimeout(() => {
      this.history = JSON.parse(window.localStorage.getItem('history'));
      refresher.complete();
    }, 2000);
  }

  ionViewDidLoad() {
    this.connect.getHistory();
    this.history = JSON.parse(window.localStorage.getItem('history'));
     console.log('ionViewDidLoad MessagePage');
  }

  ionViewWillEnter() {
    
  }
  

  isLevel1Shown(idx) {
    return this.showLevel1 === idx;
  };

  isLevel2Shown(idx) {
    return this.showLevel2 === idx;
  };

  toggleLevel1(idx) {
    if (this.isLevel1Shown(idx)) {
      this.showLevel1 = null;
    } else {
      this.showLevel1 = idx;
    }
  };

  toggleLevel2(idx) {
    if (this.isLevel2Shown(idx)) {
      this.showLevel1 = null;
      this.showLevel2 = null;
    } else {
      this.showLevel1 = idx;
      this.showLevel2 = idx;
    }
  };

}
