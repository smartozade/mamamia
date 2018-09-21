import { Component } from '@angular/core';
import { NavController, ModalController, NavParams } from 'ionic-angular';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {MessagePage} from '../message/message';
import {CallingPage} from '../calling/calling';
import {DisplayPage} from '../display/display';
import {ConnectProvider} from '../../providers/connect/connect';
import { Events } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';

import * as SIP from 'sip.js';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public result = "";
  public calls = [];
  public config;
  public user;
  public pass;
  public ua;
  public country;
  public flag:any;
  public cflags:any;
  public code;
  public userDetails:any;
  public try:any;
  public server:any;

  constructor(public navCtrl: NavController, public modal:ModalController, public connect:ConnectProvider, public events:Events,
  public storage:Storage, public navParams: NavParams, public http:Http, private androidPermissions:AndroidPermissions) {
    this.country = navParams.get('country') || 'Where do you want to call?';
    this.code = navParams.get('dial_code')|| '';
    this.flag = navParams.get('code')||'ng';
    this.cflags = this.flag.toLowerCase();
    var token = window.localStorage.getItem('userToken');
    this.user = window.localStorage.getItem('us');
    this.pass = window.localStorage.getItem('pa');
    this.userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
    console.log(this.user);
    console.log(this.pass);
    console.log(this.userDetails);
    this.config = this.connect.registration(this.user,this.pass);

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT).then(
      result => console.log('Has permission?',result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT)
    );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);

     var constraints = { audio: true, video:false}; 


    // navigator.mediaDevices.getUserMedia(constraints)
    // .then(function(stream) {
    //   /* use the stream */
    // })
    // .catch(function(err) {
    //   /* handle the error */
    // });


    // var Med = navigator.mediaDevices.getUserMedia(constraints);

 var Med =  navigator.mediaDevices.getUserMedia(constraints)
  .then(function(mediaStream) {
    var audio = document.querySelector('audio');
    audio.srcObject = mediaStream;
    // audio.onloadedmetadata = function(e) {
    //   audio.play();
    // };
  })
  .catch(function(err) { 
    console.log(err.name + ": " + err.message); }); 




    var RTCPeerConnection: {   
     new (configuration: RTCConfiguration): RTCPeerConnection;
      prototype: RTCPeerConnection;
    };


    this.ua = new SIP.UA(this.config, RTCPeerConnection);
    var self = this;
    this.ua.on('invite', function(session) {
      console.log(session);
      // alert(session.remoteIdentity.displayName);
      var dial = {message:session.remoteIdentity.displayName};
      window.localStorage.setItem('category','inbound');
      var myModal = self.modal.create(CallingPage, dial);
      myModal.present();  

      

      //bye or terminate event
      session.on('bye', function(){
        alert('bye');
        var counter = window.localStorage.getItem('counter');
        if(counter === 'false'){
          self.events.publish('closed', 'closed');
        }
      });

      //drop the ongoing call event
      session.on('rejected', function(){
        alert('rejected');
        var counter = window.localStorage.getItem('counter');
        if(counter === 'false'){
          self.events.publish('closed', 'closed');
        }
      });

      //cancel event
       session.on('cancel', function(){
         alert('cancel event');
        var counter = window.localStorage.getItem('counter');
        if(counter === 'false'){
          self.events.publish('closed', 'closed');
        }
      });

      myModal.onDidDismiss(() => {
        alert(session.status);
      if((session.status !== 9)&&(session.status !== 4 )){
        session.bye();
        session.removeListener('invite',()=>{
          console.log('mamamia');
        });
        window.localStorage.setItem('counter','true');
      }else if(session.status == 4){
        session.terminate();
        window.localStorage.setItem('counter','true');
      }
      window.localStorage.setItem('counter','false');
     
    }); 

      self.events.subscribe('received', (event_data) => {
           session.accept();   
      }); 
      
    });

    var options = {

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
    
  }

   ionViewDidLoad(){  
    this.server = localStorage.getItem('server');
    this.try = window.localStorage.getItem('us');
    if(!this.try){
     this.connect.getUser();
    }
    window.localStorage.setItem('counter','false');
    this.timeZone();
  }

   btnClick(btn){
    this.result+=btn;
  }

  btnCancel(){
    this.result = this.result.substr(0, this.result.length - 1);
  }

  btnClear(){
    this.result = '';
  }

  btnCall(){
    var self = this;
    this.calls.unshift(this.result);
    window.localStorage.setItem('Calls', JSON.stringify(this.calls));
    window.localStorage.setItem('category','outbound');
    this.events.publish('log:update', this.result);
    var session = this.connect.call(this.ua,this.result, this.result);
    console.log(session);
    
    session.on('accepted', function(){
      self.events.publish('accepted', 'accpted');
      // alert('the call has being picked');
    });
    session.on('rejected', function(){
      alert('call rejected/dropped');
      var counter = window.localStorage.getItem('counter');
        if(counter === 'false'){
          self.events.publish('closed', 'closed');
        }
    }); 
    session.on('failed', function(){
      alert('call failed/failed');
      var counter = window.localStorage.getItem('counter');
      if(counter === 'false'){
        self.events.publish('closed', 'closed');
      }
    }); 

    //cancel event
       session.on('cancel', function(){
         alert('cancel event');
        var counter = window.localStorage.getItem('counter');
        if(counter === 'false'){
          self.events.publish('closed', 'closed');
        }
      });

      //bye or terminate event
      session.on('bye', function(){
        var counter = window.localStorage.getItem('counter');
        if(counter === 'false'){
          self.events.publish('closed', 'closed');
        }
      });

    var dial = {message:this.result};
    var myModal = this.modal.create(CallingPage, dial);
    myModal.onDidDismiss(() => {
      if((session.status !== 9)&&(session.status !== 0 )){
        session.bye();
        window.localStorage.setItem('counter','true');
      }else if(session.status == 0){
        session.terminate();
        window.localStorage.setItem('counter','true');
      }
      window.localStorage.setItem('counter','false');
     
    }); 
    myModal.present();      
    this.result = this.code + '';
  }


  con(){
    this.connect.registration(this.user, this.pass);
    var ua = new SIP.UA(this.config);
  }
  
  normalCall(){
    this.calls.push(this.result);
    window.localStorage.setItem('Calls', JSON.stringify(this.calls));
    this.events.publish('log:update', this.result);
  }

  selCountry(){
    window.localStorage.setItem('page', 'HomePage')
    this.navCtrl.push(DisplayPage);
  }


  ionViewWillEnter() {
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(0)';
      });
    } // end if

    this.connect.getUser();
  } 
  
  timeZone(){
    var token = window.localStorage.getItem('userToken');
    let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization','Bearer '+token);
      let options = new RequestOptions({headers: headers});
    this.http.get(this.server +"api/timezones", options)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
        
        console.log(result.data);
       
      } else{
        alert('cant get your timezones');
      } 
          },
        err=>{
         alert('unable to connect');
    })
  }

}
