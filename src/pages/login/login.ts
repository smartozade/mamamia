import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {Storage} from '@ionic/storage';
import {Sim} from '@ionic-native/sim';
import {TabsPage} from '../tabs/tabs';
import {SettingPage} from '../setting/setting';
import {PasswordPage} from '../password/password';
import {ConnectProvider} from '../../providers/connect/connect';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {
  splash = true;
  public reg:any;
  public username:any;
  public password:any;
  public details:any;
  public navData;
  public userDetails:any;
  public geocode:boolean;
  public user:any;
  public server:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fm:FormBuilder, public http:Http,
   public alertCtrl:AlertController, private sim:Sim, private storage:Storage) {
     this.getSim();
    this.reg = fm.group({
        username: ['', Validators.compose([Validators.minLength(4), Validators.required])],
        password: ['', Validators.compose([Validators.minLength(4), Validators.required])],  
      });
      this.details = this.reg;
      this.username = this.reg.controls['username'];     
      this.password = this.reg.controls['password']; 
      this.server = localStorage.getItem('server');      
  }

    async getSim(){
      try{
        let simPerm = await this.sim.requestReadPermission();
        if(simPerm == 'OK'){
          let simData = await this.sim.getSimInfo();
          window.localStorage.setItem('countryCode', simData.countryCode);
          window.localStorage.setItem('Sim', simData.carrierName);

        }
      }catch (error){
        console.log(error);
        alert(error);
      }
    }    

  ionViewDidLoad() {
    this.server = localStorage.getItem('server');
    console.log(this.server+"api/user");
    setTimeout(() => this.splash = false, 7000);
  }

  //"http://ucalltel.telvida.com/v2/getUser?phone=+15125788409&password=95885"
  submit(){
    let headers = new Headers;
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    let options = new RequestOptions({headers: headers});
    var obj = {phonenumber: this.username.value, password: this.password.value};
    var data = JSON.stringify(obj);

    this.http.post(this.server+"api/auth/login", data, options)
    .map(res=>res.json()).subscribe(result=>{
      this.userDetails = result;
        if(this.userDetails){
          window.localStorage.setItem("userToken",this.userDetails.access_token);
           window.localStorage.setItem("username",this.username.value);
          window.localStorage.setItem("token", this.userDetails.access_token);

          let header = new Headers;
          header.append('Content-Type', 'application/json');
          header.append('Accept', 'application/json');
          header.append('Authorization','Bearer '+this.userDetails.access_token);
          let option = new RequestOptions({headers: header});
          this.http.get(this.server+"api/user", option)
          .map(res=>res.json()).subscribe(result=>{
            if(result){
              this.user = result.data;
              var test = JSON.stringify(this.user);
              console.log(test);
              window.localStorage.setItem('user', test);
              window.localStorage.setItem("us",this.user.extension.number);
              window.localStorage.setItem("pa",this.user.extension.password);
              window.localStorage.setItem("phone",this.user.phonenumber);
              window.localStorage.setItem('photo', this.user.photo);
              this.navCtrl.setRoot(TabsPage); 
            } else{
              alert('cant get Auth user for now ');
            } 
          },
            err=>{
            alert('unable to connect to users api');
            })
        }
    },
      err=>{
        this.showAlert();
          this.navCtrl.setRoot(LoginPage);
    });

  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Login Details',
      subTitle: 'The phone Numer with the Pin does not match please try again',
      buttons: ['OK']
    });
    alert.present();
  } 

  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(56px)';
      });
    } // end if
  }

  register(){
    this.navCtrl.push(SettingPage);
  }

  pass_reset(){
    this.navCtrl.push(PasswordPage);
  }
  
  ionViewWillLeave(){
    
  }
  
  getUser(){
    var token = window.localStorage.getItem("userToken");
    let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization','Bearer '+token);
      let options = new RequestOptions({headers: headers});
      this.http.get(this.server + "api/user", options)
      .map(res=>res.json()).subscribe(result=>{
        if(result){
          this.user = result.data;
          console.log(this.user.extension.number);
          this.storage.set('user',this.user);
          window.localStorage.setItem("us",this.user.extension.number);
          window.localStorage.setItem("pa",this.user.extension.password);
          return this.user;
        } else{
          alert('cant update your profile ');
        } 
      },
        err=>{
         alert('unable to connect');
        })
  }

}
