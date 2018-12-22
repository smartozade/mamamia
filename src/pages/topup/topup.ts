import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {MyprofilePage} from '../myprofile/myprofile';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ConnectProvider} from '../../providers/connect/connect';

/**
 * Generated class for the TopupPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-topup',
  templateUrl: 'topup.html',
})
export class TopupPage {

  public amount;
  public currencies;
  public recharge:boolean;
  public code:any;
  public currency:any;
  public email:any;
  public password:any;
  public voucher;
  public credits:any;
  public server:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController, public fm:FormBuilder, 
  public http:Http, private connect:ConnectProvider) {
    this.code = fm.group({
        voucher: ['', Validators.compose([Validators.maxLength(10), Validators.required])],
        currency: ['', Validators.compose([Validators.minLength(2), Validators.required])],
        email: ['', Validators.compose([Validators.minLength(40), Validators.email])],
        password: ['', Validators.compose([Validators.minLength(7), Validators.required])],
      });
    this.voucher = this.code.controls['voucher'];
    this.currency = this.code.controls['currency'];     
    this.email = this.code.controls['email'];
    this.password = this.code.controls['password'];     
    // this.year = this.code.controls['year'];    

    this.credits = JSON.parse(window.localStorage.getItem('credits'));
    this.currencies = ['EUR', 'USD', 'DOLLAR', 'NAIRA'];
      
      
  }
  

  ionViewDidLoad() {
     this.server = localStorage.getItem('server');
     this.getCredits();
    console.log('ionViewDidLoad TopupPage');
  }
  submit(){
    this.recharge = true;
    this.showAlert();
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Paypal Payment',
      subTitle: 'Paypal method is ongoing',
      buttons: ['OK']
    });
    alert.present();
  } 

  getCredits(){
    var token = window.localStorage.getItem('userToken');   
    let header = new Headers;
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('Authorization','Bearer '+ token);
    let option = new RequestOptions({headers: header});
    this.http.get(this.server +"api/credits", option)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
        this.credits = result.data;
        var test = JSON.stringify(this.credits);
        window.localStorage.setItem('credits',test);
      } else{
        this.connect.errorMessage('cant load UcallTel Credits ');
      } 
    },
      err=>{
      this.connect.errorMessage('unable to connect try again');
      })

  }


  
}
