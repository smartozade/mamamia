import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';

/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  public real:any;
  public trans:any = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http) {
  }

  ionViewDidLoad() {
     this.http.get("http://ucalltel.telvida.com/v2//accountActivityHistory")
    .map(res=>res.json()).subscribe(result=>{
     this.real = (result.historyData);
     for(var h=0; h<this.real.length; h++){
       this.trans.push(this.real[h]);
      }
    },
    err=>{
          alert('Error from ucalltel server');
    });  
  }

}
