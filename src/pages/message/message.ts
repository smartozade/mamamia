import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

/**
 * Generated class for the MessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public http:Http) {
    // this.getHistory();
    this.history = JSON.parse(window.localStorage.getItem('history'));
    console.log(this.history);
    if(!this.history){
      this.test = 'You dont have Payement records yet, Please TopUp';
    }
    
  }

  ionViewDidLoad() {
    this.server = localStorage.getItem('server');
    this.token = window.localStorage.getItem('userToken');
    console.log('ionViewDidLoad MessagePage');
     this.getHistory();
  }

  ionViewWillEnter() {
    this.getHistory();
  }

  getHistory(){ 
    let header = new Headers;
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('Authorization','Bearer '+ this.token);
    let option = new RequestOptions({headers: header});
    this.http.get(this.server +"api/credits/topups/history", option)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
        console.log(result.data);
        var test = JSON.stringify(result.data)
        window.localStorage.setItem('history',test);
        // return result.data;
      } else{
        alert('cant load credit history ');
      } 
    },
      err=>{
      alert('unable to connect creditHistory');
      })

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
