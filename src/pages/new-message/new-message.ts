import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {MyprofilePage} from '../myprofile/myprofile';
import {ConfigPage} from '../config/config';

/**
 * Generated class for the NewMessagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-new-message',
  templateUrl: 'new-message.html',
})
export class NewMessagePage {
  public userDetails:any;
  public fname:any;
  public lname:any;
  public email:any;
  public username:any;
  public user:any;
  public token:any;
  public server:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fm:FormBuilder, public http:Http,
   public alertCtrl:AlertController,) {

    this.user = fm.group({
        fname: ['', Validators.compose([Validators.required])],
        lname: ['', Validators.compose([Validators.required])],  
        email: ['', Validators.compose([Validators.email, Validators.required])],  
        username: ['', Validators.compose([Validators.minLength(4), Validators.required])],  
      });
      // this.details = this.user;
      this.fname = this.user.controls['fname'];     
      this.lname = this.user.controls['lname'];  
      this.email = this.user.controls['email'];  
      this.username = this.user.controls['username'];   
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NewMessagePage');
    this.token = window.localStorage.getItem('userToken');
    this.server = localStorage.getItem('server');
  }

  submit(){
    let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization','Bearer '+this.token);
      let options = new RequestOptions({headers: headers});
      var obj = {first_name: this.fname.value, last_name: this.lname.value, email:this.email.value, username:this.username.value};
      var data = JSON.stringify(obj);
      console.log(data);
    //  this.http.get("http://ucalltel.telvida.com/v2/changePin?sid="+sid +"&oldPin="+this.oldPass.value + "&newPin="+this.newPass.value)
    this.http.put(this.server +"api/user", data, options)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
          alert('profile Update Successfully');
          this.navCtrl.setRoot(ConfigPage);
      }  else{
        alert('cant update your profile ');
      } 
          },
        err=>{
         alert('unable to connect');
    })
  }

}
