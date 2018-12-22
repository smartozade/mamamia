import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Events } from 'ionic-angular';
import {ConnectProvider} from '../../providers/connect/connect';
import { BackgroundMode } from '@ionic-native/background-mode';

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
pause = true;
mic = true;
speaker = false;


  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl:ViewController, 
    public connect:ConnectProvider, public events:Events, public backgroundMode:BackgroundMode,) {
    this.backgroundMode.enable();
    this.backgroundMode.overrideBackButton();
    this.navData = this.navParams.get('message');

     // getting closed event if the call is terminated by the client
     this.events.subscribe('closed', (event_data) => {
      clearTimeout(this.getTime);
      this.viewCtrl.dismiss();
      this.getTime = '';  
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
      this.con = true;
      this.calling = false;
      self.task();

    }); 

  }
  // incoming calls method
  inbound(){
    this.incoming = true;
    document.getElementById('call').innerHTML = "Incoming Call";
  }
  // exit the modal
  closeModal(){
    clearTimeout(this.getTime);
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {    
    console.log('ionViewDidLoad CallingPage');
  }
  //mute calls
  mute(){
    this.mic = false;
    // this.events.publish('onMute', 'call muted');
    console.log('call muted');
  }

  unmute(){
    this.mic = true;
    // this.events.publish('unMute', 'call unMute');
    console.log('call is unMute');

  }
  //onHold call
  hold(){
    this.pause = false;
    this.events.publish('onHold', 'call onHold');
    console.log('calls on Hold');
  }
  unhold(){
    this.pause = true;
    this.events.publish('unHold', 'call is unHold');
    console.log('calls unHold');
  }

  speakOut(){
    this.speaker = true;
    this.events.publish('speakerOn','speak-out');
    console.log('on speaker');
  }
  speak(){
    this.speaker = false;
    this.events.publish('speakerOff','normall speaker');
    console.log('on normal speaker');
  }

  //accept the incoming calls
  accept(){
    this.events.publish('received', 'received');
    // document.getElementById('call').innerHTML = "";
    this.incoming = false;
    this.con = true;
    document.getElementById('con1').innerHTML = "connected";
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

