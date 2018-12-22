import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ConfigPage} from '../config/config';
import {ConnectProvider} from '../../providers/connect/connect';


@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {

  public reg:any;
  public cardNumb:any;
  public month:any;
  public year:any;
  public security:any;
  public name:any;
  public email:any;
  public amount:any;
  public credits:any;
  public read:any;
  public server:any;
  public mnth;
  public yrs;
  card: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fm:FormBuilder,public http:Http, private connect:ConnectProvider,
   public alertCtrl:AlertController) {
      this.reg = fm.group({
        cardNumb: ['', Validators.compose([Validators.minLength(16), Validators.required])],
        month: ['', Validators.compose([Validators.minLength(2), Validators.required])],
        year: ['', Validators.compose([Validators.minLength(4), Validators.required])],
        security: ['', Validators.compose([Validators.minLength(4), Validators.required])],
        name: ['', Validators.compose([Validators.minLength(5), Validators.required])], 
      });

    this.name = this.reg.controls['name'];     
    this.cardNumb = this.reg.controls['cardNumb'];
    this.month = this.reg.controls['month'];     
    this.year = this.reg.controls['year'];      
    this.security = this.reg.controls['security'];   
    this.mnth = [{day:'Jan', month:'01'},{day:'Feb', month:'02'},{day:'Mar', month:'03'},{day:'Apr', month:'04'},{day:'May', month:'05'},{day:'Jun', month:'06'},{day:'Jul', month:'07'},{day:'Aug', month:'08'},{day:'Sep', month:'09'},{day:'Oct', month:'10'},{day:'Nov', month:'11'},{day:'Dec', month:'12'},];
    this.yrs = ['2019','2020','2021','2022','2023','2024','2025','2026','2027','2028','2029','2030','2031','2032','2033','2034','2035','2036','2037','2038','2039','2040','2033']; 
       
     
  }

  ionViewDidLoad() {
    this.credits = JSON.parse(window.localStorage.getItem('credits'));
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
        this.connect.errorMessage('Unable access UcallTel Credits ');
      } 
    },
      err=>{
      console.log('unable to connect please try again');
      })

  }  

  submit(){
    var token = window.localStorage.getItem('userToken');  
    var obj = {credit: this.name.value, payment_method:'stripe', exp_month:this.month.value,exp_year:this.year.value,number:this.cardNumb.value,cvc:this.security.value};
    var data = JSON.stringify(obj);
    console.log(data);
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization','Bearer '+ token);
    let options = new RequestOptions({headers: headers});
    this.http.post(this.server +"api/credits/topups", data, options)
    .map(res=>res.json()).subscribe(result=>{
      console.log(result.error);
      this.read = result.data||result.error;
      this.connect.showAlert('Payment Message',this.read.message);
      this.navCtrl.push(ConfigPage);
    },
    err=>{
     this.connect.errorMessage('unable to connect please try again');
    });
  }

  ionViewWillEnter(){
    this.server = window.localStorage.getItem('server');
    this.getCredits();  
  }

 
}

