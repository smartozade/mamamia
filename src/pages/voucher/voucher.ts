import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {HomePage} from '../home/home';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ConnectProvider} from '../../providers/connect/connect';

/**
 * Generated class for the VoucherPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-voucher',
  templateUrl: 'voucher.html',
})
export class VoucherPage {
   public amount;
  public recharge:any;
  public code:any;
  public voucher;
  public server:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController, public fm:FormBuilder, public http:Http,
    private connect:ConnectProvider) {
    this.code = fm.group({
        voucher: ['', Validators.compose([Validators.minLength(10), Validators.required])],
      });
      this.voucher = this.code.controls['voucher'];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VoucherPage');
    this.server = localStorage.getItem('server');
  }

  submit(){
    this.recharge = true; 
    var token = window.localStorage.getItem('userToken');   
    var obj = { code: this.voucher.value};
    var data = JSON.stringify(obj);
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization','Bearer '+token);
    let options = new RequestOptions({headers: headers});
    this.http.post(this.server +"api/voucher/redeem", data, options)
    .map(res=>res.json()).subscribe(result=>{
    this.recharge = result;
    console.log(this.recharge);
    this.navCtrl.push(HomePage);
    },
    err=>{
      this.connect.errorMessage('Unable to connect try again');
      
    });
    
  }

}
