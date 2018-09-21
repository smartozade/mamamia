import { Component } from '@angular/core';
import { NavController, ModalController, MenuController } from 'ionic-angular';
import {CallingPage} from '../calling/calling';
import {ConnectProvider} from '../../providers/connect/connect';
import {Http} from '@angular/http';

import 'rxjs/add/operator/map';

import { Events } from 'ionic-angular';

import * as SIP from 'sip.js';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  history = [];
  other:any = [];
  real:any;
  call:any;
  ua:any;
  received = [];
  dailed = []; 
  config;
  pcalls;
  public details:any;
  public server:any;

  constructor(public navCtrl: NavController, public modal:ModalController, public connect:ConnectProvider, public events:Events,
   public http:Http, public menu:MenuController) {    
    
    var user = window.localStorage.getItem('us');
    var pass = window.localStorage.getItem('pa');
    console.log(user);
    console.log(pass);
    this.config = this.connect.registration(user,pass);
    this.ua = new SIP.UA(this.config);

    this.call = (JSON.parse(window.localStorage.getItem('Calls')));
    if(this.call){
      for(var j=0; j<this.call.length; j++){
        this.history.push(this.call[j]);
      }
    }
    this.events.subscribe('log:update', (event_data) => {
      this.history.push(event_data);
    });

    this.pcalls = 'dailed'
   
  }

  ionViewDidLoad() {
    this.server = localStorage.getItem('server');
    this.http.get("http://ucalltel.telvida.com/v2//accountCallHistory")
    .map(res=>res.json()).subscribe(result=>{
     this.real = (result.historyData);
     for(var h=0; h<this.real.length; h++){
       this.other.push(this.real[h]);
     }
    //  console.log(this.other);
      for(var i=0; i<this.other.length; i++){
        if(this.other[i].TYPE ==='Incoming'){
          this.received.push(this.other[i]);
          // console.log(this.received);
        }else{
          this.dailed.push(this.other[i]);
          // console.log(this.dailed);
        }
      }   
    },
        err=>{
          alert('Error from ucalltel server');
    });  
       
  }

  ionViewWillEnter(){ 
    this.menu.swipeEnable(false);
  }

  tel(i){
    var self = this;
    var dial = {message:this.history[i]};
    window.localStorage.setItem('category','outbound');
    var session = this.connect.call(this.ua, this.history[i], this.history[i]);
    var myModal = this.modal.create(CallingPage, dial);
    myModal.onDidDismiss(() => {
      if(session.status !== 9){
          session.terminate();
        }   
    });
    this.events.subscribe('closed', (event_data) => {
     if(session.status !== 9){
          session.terminate();
        }   
    }); 
    myModal.present();
    this.events.publish('log:update', this.history[i]);

    session.on('ringing', function(){
      // this.event.publish('ringing', 'ring');
      alert('am ringing');
    });
    session.on('accepted', function(){
      self.events.publish('accepted', 'accpted');
      // alert('the call has being picked');
    });

    session.on('bye', function(){
      // this.event.pubish('rejected', 'rejected');
      alert('call rejected/dropped');
    });  

    session.on('cancel', function(){
      // this.event.pubish('rejected', 'rejected');
      alert('call canceled');
    }); 
  }

  close(i){
    this.history.splice(i,1);
  }

  dail(i){
    this.dailed.splice(i,1);
  }

  receive(i){
    this.received.splice(i,1);
  }

  cdail(i){
    var self = this;
    var dial = {message:this.dailed[i].NUMBER};
    window.localStorage.setItem('category','outbound');
    var session = this.connect.call(this.ua, this.dailed[i].NUMBER, dial);
    var myModal = this.modal.create(CallingPage, dial);
    myModal.onDidDismiss(() => {
       if(session.status !== 9){
          session.terminate();
       }
    });

    this.events.subscribe('closed', (event_data) => {
      if(session.status !== 9){
          session.terminate();
      }
    }); 

    myModal.present();
    this.events.publish('log:update', this.dailed[i].NUMBER);

    session.on('ringing', function(){
      // this.event.publish('ringing', 'ring');
      alert('am ringing');
    });
    session.on('accepted', function(){
      self.events.publish('accepted', 'accpted');
      // alert('the call has being picked');
    });

    session.on('bye', function(){
      // this.event.pubish('rejected', 'rejected');
      alert('call rejected/dropped');
    });  
  }

  creceive(i){
    var self = this;
     var dial = {message:this.received[i].NUMBER};
     window.localStorage.setItem('category','outbound');
    var session = this.connect.call(this.ua, this.received[i].NUMBER, dial);
    var myModal = this.modal.create(CallingPage, dial);
    myModal.onDidDismiss(() => {
     if(session.status !== 9){
          session.terminate();
        }   
    });
    myModal.present();
    this.events.publish('log:update', this.received[i].NUMBER);

    session.on('ringing', function(){
      // this.event.publish('ringing', 'ring');
      alert('am ringing');
    });
    session.on('accepted', function(){
      self.events.publish('accepted', 'accpted');
      // alert('the call has being picked');
    });

    session.on('bye', function(){
      // this.event.pubish('rejected', 'rejected');
      alert('call rejected/dropped');
    });  

  }
 


  
}
