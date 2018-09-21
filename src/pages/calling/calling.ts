import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import {ConnectProvider} from '../../providers/connect/connect';

import * as SIP from 'sip.js';

/**
 * Generated class for the CallingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-calling',
  templateUrl: 'calling.html',
})
export class CallingPage {
public navData:any;
public dail;
public ua;
public session;
public category:any;
public calling:boolean;
public incoming:boolean;
public con:boolean;
public options;

clearTime:any;
seconds = 0; 
minutes = 0; 
hours = 0;   
getTime ;

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, 
    public connect:ConnectProvider, public events:Events) {
    this.navData = this.navParams.get('message');

    this.options = {

      media:{
              constraints:{
                audio: true,
                video: false,
              },
              render:{
                remote:{
                  audio: document.getElementById('remoteAudio')
                },

                local:{
                  audio: document.getElementById('localAudio')
                }
              }
      }
    };  
     // getting closed event if the call is terminated by the other person
     this.events.subscribe('closed', (event_data) => {
        window.localStorage.setItem('counter','false');
        clearTimeout(this.getTime);
        this.viewCtrl.dismiss();   
      });

  }

  ionViewWillEnter(){
    // this differenciate incoming calls from the outgoing calls on the modal
     this.category = window.localStorage.getItem('category');
     if(this.category === 'outbound'){
       this.outbound();
     }else{
       this.inbound();
     }
  }
  // outgoing calls method
  outbound(){
    var self = this;
    this.calling = true;    
    document.getElementById('call').innerHTML = "Calling ......";
    this.events.subscribe('accepted', (event_data) => {
      document.getElementById('con1').innerHTML = "connected";
      // self.task();

    }); 

  }
  // incoming calls method
  inbound(){
    this.incoming = true;
    document.getElementById('call').innerHTML = "Incoming Call";
  }
  // exiting the modal
  closeModal(){
    window.localStorage.setItem('counter','true');
    clearTimeout(this.getTime);
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {    
    console.log('ionViewDidLoad CallingPage');
  }
  // method that enable the incoming call to be accepted
  accept(){
    this.events.publish('received', 'received');
    document.getElementById('call').innerHTML = "";
    this.incoming = false;
    this.con = true;
    document.getElementById('con1').innerHTML = "connected";
    // document.getElementById('con').innerHTML = "0:00";
    this.task();
  }

  task():void{
    var self = this;
    self.getTime = setInterval(function(){
      self.count();
    }, 1000);
  }

  count(){
    this.seconds++;
    if (this.seconds >= 60) {
      this.seconds = 0;
      this.minutes++;
      if (this.minutes >= 60) {
        this.minutes = 0;
        this.hours++;
      }
    }
    this.clearTime = document.getElementById('con');
    this.clearTime.innerHTML = (this.hours ? (this.hours> 9 ? this.hours : "0" + this.hours) : "0") + ":" + (this.minutes ? (this.minutes > 9 ? this.minutes : "0" + this.minutes) : "0") + ":" + (this.seconds > 9 ? this.seconds : "0" + this.seconds);
  }
  
}

