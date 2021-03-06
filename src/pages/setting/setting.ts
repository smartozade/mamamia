import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import {Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {LoginPage} from '../login/login';
import {DisplayPage} from '../display/display';
import {ConnectProvider} from '../../providers/connect/connect';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

import {parseNumber, isValidNumber} from 'libphonenumber-js';

@IonicPage()
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html',
})
export class SettingPage {
  public reg:any;
  public country:any;
  public phoneNumber:any;
  public flag:any;
  public cflags:any;
  public code:any;
  public cid:any;
  public others:any;
  public read:any;
  public server:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fm:FormBuilder, public http:Http, private toastCtrl:ToastController, 
    private alertCtrl:AlertController, private connect:ConnectProvider) {
    this.country = (navParams.get('country')) || 'Nigeria';
    this.code = (navParams.get('dial_code')) || '+234';
    this.flag = (navParams.get('code'))|| 'NG';
    this.cid = navParams.get('cid') || '156';
    this.cflags = this.flag.toLowerCase();
    this.reg = fm.group({
        phoneNumber: ['', Validators.compose([Validators.minLength(12), Validators.maxLength(16), Validators.required])]
  
      });
      this.others = this.reg;
      this.phoneNumber = this.reg.controls['phoneNumber']; 
  }
    

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingPage');
    this.server = localStorage.getItem('server');
  }

  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(56px)';
      });
    } // end if
  }

  selectCountry(){
    window.localStorage.setItem('page', 'SettingPage');
    this.navCtrl.push(DisplayPage);
  }

  report(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'middle',
      showCloseButton:true,
    });
    toast.present();
  }

  parsePhone(phone){
    var pnumber = parseNumber(phone, {extended:true});
    alert(JSON.stringify(pnumber));
    return pnumber;
  }

  validate(phone, code){
    var valid = isValidNumber(phone,code);
    return valid;
  }

  submit():void {
    var valid = this.validate(String(this.phoneNumber.value),String(this.flag));
    if(valid){
      var obj = {country: this.cid, phonenumber: this.phoneNumber.value};
      var data = JSON.stringify(obj);
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({headers: headers});
      this.http.post(this.server +"api/auth/signup", data, options)
      .map(res=>res.json()).subscribe(result=>{
      this.read = result;
      console.log(this.read);
      this.connect.showAlert('Registration Success', 'Verification code has been sent to ' +this.phoneNumber.value);
      this.navCtrl.setRoot(LoginPage);      
      },
      err=>{
        this.report('Error try again later');
      });

      // if(this.read){
      //   this.report('Verification code has been sent to  '+this.phoneNumber.value);
      // }
    } else {
      this.report(this.phoneNumber.value +' is not a valid number in '+ this.country);
    }
  }
  sms(cnumb){
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({headers: headers});
    this.http.post(this.server +"api/auth/signup", cnumb, options)
    .map(res=>res.json()).subscribe(result=>{
      this.read = result;
      console.log(this.read);
    },
    err=>{
      this.connect.showAlert('Error', 'Unable to connect');
    });
    return this.read;
  }

}
