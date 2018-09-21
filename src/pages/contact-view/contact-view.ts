import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {ContactPage} from '../contact/contact';
import {CallingPage} from '../calling/calling';
import {ConnectProvider} from '../../providers/connect/connect';
import { Events } from 'ionic-angular';

import * as SIP from 'sip.js';

/**
 * Generated class for the ContactViewPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-contact-view',
  templateUrl: 'contact-view.html',
})
export class ContactViewPage {
  public contact:any;
  call:any;
  ua:any;
  logs;
  config;

  constructor(public navCtrl: NavController, public navParams: NavParams, public modal:ModalController, public connect:ConnectProvider, public events:Events) {
    this.contact = navParams.get('detail');
    var user = localStorage.getItem('username');
    var pass = localStorage.getItem('password');
    this.config = this.connect.registration(user,pass);
    this.ua = new SIP.UA(this.config);
    this.call =  (JSON.parse(window.localStorage.getItem('Calls')));
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ContactViewPage'); 
  

    
  }

  log(dial){
    this.logs = this.call;
    this.logs.push(dial);
    
    return this.logs;    
  }


  tel(){
    var dial = {message:this.contact.phoneNumbers[0].value};
    var num = this.contact.phoneNumbers[0].value;
    var session = this.connect.call(this.ua,'1061', dial);
      var myModal = this.modal.create(CallingPage, dial);
      myModal.onDidDismiss(() => {
        session.terminate();
      });
    myModal.present();
    this.logs = this.log(num);
    window.localStorage.setItem('calls', JSON.stringify(this.logs));
    this.events.publish('log:update', num);
  }

  ionViewWillLeave(){
    window.localStorage.setItem('calls', JSON.stringify(this.logs)); 
  }

  test(){
    this.events.publish('log:update', 'olopa');
  }
}
