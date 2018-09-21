import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {SettingPage} from '../setting/setting';
import {MyprofilePage} from '../myprofile/myprofile';
import {TopupPage} from '../topup/topup';
import {PaymentPage} from '../payment/payment';
import {MessagePage} from '../message/message';
import {HistoryPage} from '../history/history';
import {LoginPage} from '../login/login';
import {VoucherPage} from '../voucher/voucher';
import {ConnectProvider} from '../../providers/connect/connect';


@IonicPage()
@Component({
  selector: 'page-config',
  templateUrl: 'config.html',
})
export class ConfigPage {

  public username:any;
  public user:any;
  public size:boolean = true;
  public topUp:any = []; 
  public photo:any;
  showLevel1 = null;
  showLevel2 = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, public connect:ConnectProvider) {
    this.topUp = [
      {"title":"TopUp","name":"UcallTel Voucher","name1":"Credit Card","name2":"PayPal Account"}
    ]; 
    this.user =JSON.parse(window.localStorage.getItem('userDetails'));
    this.username = this.user.phonenumber;
    this.photo = this.user.photo;
    if(this.username){
      this.size = true;
    } 
    console.log(this.username);
    console.log(this.photo);
  }

   setting(){
    this.navCtrl.push(SettingPage);
  }

  profile(){
    this.navCtrl.push(MyprofilePage);
  }

  voucher(){
    this.navCtrl.push(VoucherPage);
  }

  topup(){
    this.navCtrl.push(TopupPage);
  }

  payment(){
    this.navCtrl.push(MessagePage);
  }

notification(){
  this.navCtrl.push(HistoryPage);
}

logout(){
  window.localStorage.clear();
  this.navCtrl.setPages([
    {page:LoginPage}
  ]);
}

isLevel1Shown(idx) {
  return this.showLevel1 === idx;
};

isLevel2Shown(idx) {
  return this.showLevel2 === idx;
};

toggleLevel1(idx) {
  if (this.isLevel1Shown(idx)) {
      document.getElementById('txt').innerHTML = "Recharge Your Account";
    this.showLevel1 = null;
  } else {
     document.getElementById('txt').innerHTML = " ";
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
}

creditc(){
  this.navCtrl.push(PaymentPage);
}

creditp(){

}

 ionViewDidLoad() {
    console.log('ionViewDidLoad ConfigPage');
  }

  ionViewWillEnter() {
    this.connect.getUser();
  } 

}
