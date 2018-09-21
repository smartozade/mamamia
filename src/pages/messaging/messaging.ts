import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import {Validators,FormBuilder,FormGroup,FormControl} from '@angular/forms';
import {Http, Headers, RequestOptions} from '@angular/http';
import {MyprofilePage} from '../myprofile/myprofile';
import 'rxjs/add/operator/map';

@IonicPage()
@Component({
  selector: 'page-messaging',
  templateUrl: 'messaging.html',
})
export class MessagingPage {
  public newPass:any;
  public oldPass:any;
  public conPass:any;
  public update:any;
  public details:any;
  public token:any;
  public server:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public fm:FormBuilder, public http:Http,
   public alertCtrl:AlertController) {

    this.details = JSON.parse(window.localStorage.getItem('userDetails'));

    this.update = fm.group({
        oldPass: ['', Validators.compose([Validators.minLength(4), Validators.required])],
        newPass: ['', Validators.compose([Validators.minLength(4), Validators.required])], 
        conPass:['', Validators.compose([Validators.minLength(4), Validators.required])],
      });
      //this.details = this.update;
      this.oldPass = this.update.controls['oldPass'];     
      this.newPass = this.update.controls['newPass']; 
      this.conPass = this.update.controls['conPass'];  
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MessagingPage');
    this.server = localStorage.getItem('server');
    this.token = window.localStorage.getItem('userToken');
  }

  submit(){
    let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization','Bearer '+this.token);
      let options = new RequestOptions({headers: headers});
      var obj = {current_password: this.oldPass.value, password: this.newPass.value, password_confirmation:this.conPass.value};
      var data = JSON.stringify(obj);
      console.log(data);
    this.http.put(this.server +"api/auth/password", data, options)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
          alert('password changed is successful');
          this.navCtrl.setRoot(MyprofilePage);
      }  else{
        alert('invalid Password');
      } 
          },
        err=>{
         alert('unable to connect');
    })
  }

}
