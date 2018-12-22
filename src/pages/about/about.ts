import { Component } from '@angular/core';
import { NavController, ModalController, MenuController } from 'ionic-angular';
import {CallingPage} from '../calling/calling';
import {ConnectProvider} from '../../providers/connect/connect';
import {Http,Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

import { Events } from 'ionic-angular';

declare var $:any;

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  history = [];
  other:any = [];
  real:any;
  call:any;
  logs:any;
  ua:any;
  received = [];
  dailed = []; 
  missed= [];
  Lreceived = [];
  Ldailed = []; 
  Lmissed= [];
  last_time;
  config;
  pcalls;
  user;
  pass;
  public details:any;
  public server:any;
  verto:any;
  currentCall:any;
  callbacks:any; 

  constructor(public navCtrl: NavController, public modal:ModalController, public connect:ConnectProvider, public events:Events,
   public http:Http, public menu:MenuController) {    
    
    this.user = localStorage.getItem('us');
    this.pass = localStorage.getItem('pa');
    this.callbacks = {
      onMessage: function(verto, dialog, msg, data) {
       console.error("msg ", msg);
       console.error("data ", data);
  
      },
      onEvent: function(v, e) {
       console.error("GOT EVENT", e);
      },
      onDialogState: (d) => {
        console.log(d);
        this.currentCall = d;
        if((d.state.name =='destroy')||(d.state.name =='hangup')){
          this.events.publish('closed', 'closed');
        }else if(d.gotAnswer){
          this.events.publish('accepted', 'accpted'); 
        }
      },  
     };
    this.config = this.connect.registration(this.user,this.pass);
    this.verto = new $.verto(this.config,this.callbacks); 

    this.call = (JSON.parse(window.localStorage.getItem('call')));
    this.logs = (JSON.parse(window.localStorage.getItem('logs')));
    console.log('logs'+this.logs);

    if(this.call){
      for(var j=0; j<this.call.length; j++){
        this.history.push(this.call[j]);
      }
      for(var i=0; i<this.history.length; i++){
        if(this.history[i].status ==='received'){
          this.received.push(this.history[i]);
        }else if(this.history[i].status ==='dialed'){
          this.dailed.push(this.history[i]);
        }else if(this.history[i].status ==='missed'){
          this.missed.push(this.history[i]);
        }            
      }
      console.log(this.received);
      console.log(this.missed);
      console.log(this.dailed);  
      console.log(this.last_time); 
    }

    if(this.logs){
      for(var i=0; i<this.logs.length; i++){
        if(this.logs[i].status ==='received'){
          this.Lreceived.push(this.logs[i]);
        }else if(this.logs[i].status ==='dialed'){
          this.Ldailed.push(this.logs[i]);
        }else if(this.logs[i].status ==='missed'){
          this.Lmissed.push(this.logs[i]);
        }            
      }
      if(this.Ldailed.length>=20){
        this.dailed = this.Ldailed;
      }else{
        for(var l=0; l<this.Ldailed.length; l++){
          this.dailed[l]=(this.Ldailed[l]);
        }
      }
      if(this.Lmissed.length>=20){
        this.missed = this.Lmissed;
      }else{
        for(var l=0; l<this.Lmissed.length; l++){
          this.missed[l]=(this.Lmissed[l]);
        }
      }
      if(this.Lreceived.length>=20){
        this.received = this.Lreceived;
      }else{
        for(var l=0; l<this.Lreceived.length; l++){
          this.received[l]=(this.Lreceived[l]);
        }
      }
      this.last_time = window.localStorage.getItem('last_time');
      console.log(this.received);
      console.log(this.missed);
      console.log(this.dailed);  
      console.log(this.last_time); 
    }
    this.events.subscribe('log:update', (event_data) => {
      this.history.push(event_data);
    });

    this.pcalls = 'dailed';
   
  }

  ionViewDidLoad() {
    this.server = localStorage.getItem('server');
    this.last_time = localStorage.getItem('last_time');
      var token = window.localStorage.getItem('userToken');
      let headers = new Headers;
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization','Bearer '+token);
        let options = new RequestOptions({headers: headers});
      this.http.get(this.server +"api/call/logs?last_time_call="+this.last_time +'&limit=30',options)
      .map(res=>res.json()).subscribe(result=>{
        if(result){
          console.log(result);
          var logs = (result.data);
          var last_time = result.meta.last_call_time;
          window.localStorage.setItem('logs', JSON.stringify(logs));
          window.localStorage.setItem('last_time',last_time);
          
        } else{
          this.connect.errorMessage('cant get your');
        } 
            },
          err=>{
           console.log('unable to connect please check your connection');
      })
  
       
  }

  ionViewWillEnter(){ 
    this.call = (JSON.parse(window.localStorage.getItem('call')));
    this.menu.swipeEnable(false);
  }

  tel(i){
    // this.navCtrl.push(HomePage,{numb:this.dailed[i].caller_num});
    var self = this;
    var dial = {message:this.dailed[i].caller_num};
    // if(this.connect.connection){
    //   this.connect.presentToast('No internet connection');   
    // }else{
      window.localStorage.setItem('category','outbound');
      this.connect.Calls(this.dailed[i].caller_num,this.currentCall,this.verto,this.user);
      var myModal = this.modal.create(CallingPage, dial);
      myModal.onDidDismiss(() => {
        this.currentCall.hangup();
        this.currentCall = null;
      }); 
      myModal.present();
      self.events.subscribe('received', (event_data) => {
        self.currentCall.answer();
      }); 
      self.events.subscribe('onMute', (event_data) => {
        self.currentCall.mute("off");
      }); 

      self.events.subscribe('unMute', (event_data) => {
        self.currentCall.mute("on");
      }); 

      self.events.subscribe('onHold', (event_data) => {
        self.currentCall.hold();
      }); 

      self.events.subscribe('unHold',(event_data)=>{
        self.currentCall.unhold();
      });      
      this.events.publish('log:update', this.dailed[i].caller_num);
    // }
  }

  close(i){
    this.dailed.splice(i,1);
  }

  dail(i){
    this.missed.splice(i,1);
  }

  receive(i){
    this.received.splice(i,1);
  }

  creceive(i){
    // this.navCtrl.push(HomePage,{numb:this.received[i].caller_num});
    var self = this;
    var dial = {message:this.received[i].caller_num};
    if(this.connect.connection){
      this.connect.presentToast('No internet connection');   
    }else{
      window.localStorage.setItem('category','outbound');
      this.connect.Calls(this.received[i].caller_num,this.currentCall,this.verto,this.user);
      var myModal = this.modal.create(CallingPage, dial);
      myModal.onDidDismiss(() => {
        this.currentCall.hangup();
        this.currentCall = null;
      }); 
      myModal.present();
      self.events.subscribe('received', (event_data) => {
        self.currentCall.answer();
      }); 
      self.events.subscribe('onMute', (event_data) => {
        self.currentCall.mute("off");
      }); 

      self.events.subscribe('unMute', (event_data) => {
        self.currentCall.mute("on");
      }); 

      self.events.subscribe('onHold', (event_data) => {
        self.currentCall.hold();
      }); 

      self.events.subscribe('unHold',(event_data)=>{
        self.currentCall.unhold();
      });      
      this.events.publish('log:update', this.received[i].caller_num);
    }
  }

  cdail(i){
    // this.navCtrl.push(HomePage,{numb:this.missed[i].caller_num});
    var self = this;
     var dial = {message:this.missed[i].caller_num};
     if(this.connect.connection){
      this.connect.presentToast('No internet connection');   
     }else{
      window.localStorage.setItem('category','outbound');
      this.connect.Calls(this.missed[i].caller_num,this.currentCall,this.verto,this.user);
      var myModal = this.modal.create(CallingPage, dial);
      myModal.onDidDismiss(() => {
        this.currentCall.hangup();
        this.currentCall = null;
      }); 
      myModal.present();
      self.events.subscribe('received', (event_data) => {
        self.currentCall.answer();
      }); 
      self.events.subscribe('onMute', (event_data) => {
        self.currentCall.mute("off");
      }); 

      self.events.subscribe('unMute', (event_data) => {
        self.currentCall.mute("on");
      }); 

      self.events.subscribe('onHold', (event_data) => {
        self.currentCall.hold();
      }); 

      self.events.subscribe('unHold',(event_data)=>{
        self.currentCall.unhold();
      });      
      this.events.publish('log:update', this.missed[i].caller_num);

    }

  }
 


  
}
