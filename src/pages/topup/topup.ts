import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {MyprofilePage} from '../myprofile/myprofile';
import {Http, Headers, RequestOptions} from '@angular/http';

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
  public recharge:boolean;
  public code:any;
  public voucher;
  public credits:any;
  public server:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl:AlertController, public fm:FormBuilder, 
  public http:Http) {
    this.code = fm.group({
        voucher: ['', Validators.compose([Validators.maxLength(10)])],
      });
      this.voucher = this.code.controls['voucher'];

       this.credits = JSON.parse(window.localStorage.getItem('credits'));
  }
  

  ionViewDidLoad() {
     this.server = localStorage.getItem('server');
     this.getCredits();
    console.log('ionViewDidLoad TopupPage');
  }
  topup(){
    
    this.recharge = true;
    alert('Paypal is ongoing');
  }

  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Login Details',
      subTitle: 'The phone Numer with the Pin does not match please try again',
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
        alert('cant load UcallTel Credits ');
      } 
    },
      err=>{
      alert('unable to connect credits');
      })

  }


  
}
