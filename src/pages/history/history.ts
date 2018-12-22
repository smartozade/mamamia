import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import {Validators,FormBuilder} from '@angular/forms';
import {Http} from '@angular/http';


/**
 * Generated class for the HistoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-history',
  templateUrl: 'history.html',
})
export class HistoryPage {
  public contact;
  public message;
  public reg:any;
  public email:any;
  public feedback:any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private http:Http, private viewCtrl:ViewController, public fm:FormBuilder) {

    this.contact = navParams.get('contact');
    this.reg = fm.group({
      email: ['', Validators.compose([Validators.email, Validators.required])],
      feedback: ['', Validators.compose([Validators.minLength(10), Validators.required])],  
    });
    
    this.email = this.reg.controls['email'];     
    this.feedback = this.reg.controls['feedback'];      
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad historyPage');
  }

  close(){
    this.viewCtrl.dismiss();
  }

  submit(){
    
  }
}
