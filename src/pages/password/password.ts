import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {Validators, FormGroup, FormBuilder, FormControl} from '@angular/forms';
import {LoginPage} from '../login/login';
import {NotificationPage} from '../notification/notification';
import {Http, Headers, RequestOptions} from '@angular/http';

/**
 * Generated class for the PasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-password',
  templateUrl: 'password.html',
})
export class PasswordPage {
  public reg:any;
  public phoneNumber:any;
  public others:any;
  public read:any;
  public server:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fm:FormBuilder, public http:Http) {

    this.reg = fm.group({
        phoneNumber: ['', Validators.compose([Validators.minLength(12), Validators.maxLength(16), Validators.required])]
  
      });
      this.others = this.reg;
      this.phoneNumber = this.reg.controls['phoneNumber']; 
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PasswordPage');
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

submit(){
  var valid = this.phoneNumber.value;
    if(valid){
      var obj = { phonenumber: this.phoneNumber.value};
      var data = JSON.stringify(obj);
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({headers: headers});
      this.http.put(this.server +"api/auth/password/reset", data, options)
      .map(res=>res.json()).subscribe(result=>{
      this.read = result;
      console.log(this.read);
      this.navCtrl.push(NotificationPage,{
          message:this.phoneNumber.value     
        });
      },
      err=>{
        alert('error');
      });

      if(this.read){
        this.navCtrl.push(NotificationPage,{
          message:this.phoneNumber.value     
        });
      }
    } else {
      this.navCtrl.setRoot(PasswordPage);
      alert(this.phoneNumber.value +' is not a valid number in ');

    }
}

}
