import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {ConfigPage} from '../config/config';

declare var Stripe;

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
  stripe = Stripe('pk_test_Aq8i82J5jROFkGMYOLtDgNYz');
  card: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fm:FormBuilder,public http:Http,
   public alertCtrl:AlertController) {
      this.reg = fm.group({
        cardNumb: ['', Validators.compose([Validators.minLength(16), Validators.required])],
        month: ['', Validators.compose([Validators.minLength(2), Validators.required])],
        year: ['', Validators.compose([Validators.minLength(4), Validators.required])],
        security: ['', Validators.compose([Validators.minLength(4), Validators.required])],
        name: ['', Validators.compose([Validators.minLength(5), Validators.required])], 
        email: ['', Validators.compose([  Validators.email, Validators.required])],
      });

      this.credits = JSON.parse(window.localStorage.getItem('credits'));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    this.server = localStorage.getItem('server');
    this.setupStripe();
    this.getCredits();
   
    
  }

  submit(){
    alert('welcome');
  }

  setupStripe(){
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
 
    this.card = elements.create('card', { style: style });
 
    this.card.mount('#card-element');
 
    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
 
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
      this.stripe.createToken(this.card).then(result => {
        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          this.creditPay(result.token);
        }
      });
    });
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

  creditPay(stp){
    var token = window.localStorage.getItem('userToken');  
    var obj = {credit: this.amount, payment_method:'stripe', stripe_token:stp};
    var data = JSON.stringify(obj);
    console.log(data);
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('Authorization','Bearer '+ token);
    let options = new RequestOptions({headers: headers});
    this.http.post(this.server +"api/credits/topups", data, options)
    .map(res=>res.json()).subscribe(result=>{
      this.read = result.data;
      alert(this.read.message);
      this.navCtrl.push(ConfigPage);
    },
    err=>{
      alert('error');
    });

  }
 
}

