import { Component } from '@angular/core';
import { NavController, ModalController, NavParams, Platform } from 'ionic-angular';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import {CallingPage} from '../calling/calling';
import {DisplayPage} from '../display/display';
import {ConnectProvider} from '../../providers/connect/connect';
import { BackgroundMode } from '@ionic-native/background-mode';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {Diagnostic} from '@ionic-native/diagnostic';
import { Events } from 'ionic-angular';
import {Storage} from '@ionic/storage';
import {Http, Headers, RequestOptions} from '@angular/http';

declare var $:any;
declare var window:any;
declare var AudioToggle:any;
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
  notificationAlreadyReceived = false;
  verto:any;
  currentCall:any;
  callbacks:any; 
  ring;
  callerId;
  status:any= 'Offline';
  call_rate;
  net;

  constructor(public navCtrl: NavController, public modal:ModalController, public connect:ConnectProvider, public events:Events,public platform:Platform,
    public localNotifications:LocalNotifications,  public storage:Storage, public navParams: NavParams, public http:Http, private androidPermissions:AndroidPermissions, 
    public backgroundMode:BackgroundMode,  public diagnostic:Diagnostic) {

    platform.ready().then(() => {
      this.backgroundMode.on('activate').subscribe(() => {
        console.log('activated');
        this.backgroundMode.overrideBackButton();
      });
      this.getPermission();
      this.backgroundMode.enable();
      this.backgroundMode.overrideBackButton();
      // this.backgroundMode.excludeFromTaskList();s
    });
    this.connect.connection();
    this.callbacks = {
      onMessage: function(verto, dialog, msg, data) {
       console.error("msg ", msg);
       console.error("data ", data);  
      },
      onEvent: function(v, e) {
       console.error("GOT EVENT", e);
      },
      onWSLogin: (verto, success)=>{
        console.log('Login success', success);
        if (success) {
          this.events.publish('status', 'Online');
        }else{
          this.events.publish('status', 'Offline');
        }

      },
      onDialogState: (d) => {
        console.log(d);
        this.callerId = d.params.caller_id_number;
        this.currentCall = d;
        if(d.state.name =='ringing'){
          this.backgroundMode.unlock();
          this.backgroundMode.wakeUp();
          window.plugins.bringtofront();
          this.ring.loop = true;
          this.ring.play();
          this.receive();
        }  else if((d.state.name =='destroy')||(d.state.name =='hangup')){
          this.ring.pause();
          this.events.publish('closed', 'closed');
        }else if(d.gotAnswer){
          this.events.publish('accepted', 'accpted'); 
        }
      },  
     };
     this.ring = new Audio('assets/sounds/bell_ring2.wav');

     this.userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
     
    this.country = navParams.get('country') || this.userDetails.country.name;
    this.code = navParams.get('dial_code')|| this.userDetails.country.phonecode;
    this.code = this.code.slice(1);
    this.flag = navParams.get('code')||this.userDetails.country.iso;
    this.cflags = this.flag.toLowerCase();
    this.call_rate =  navParams.get('rate') ||this.userDetails.country.call_rate;
    this.call_rate = '$'+ this.call_rate + '/min';
    this.user =window.localStorage.getItem('us');
    this.pass = window.localStorage.getItem('pa');
    console.log(this.user);
   
    this.config = this.connect.registration(this.user,this.pass);
    this.verto = new $.verto(this.config,this.callbacks); 
    this.events.subscribe('status', (event_data)=>{
      this.status = event_data;
    });
    console.log(this.status);
    this.events.subscribe('speakerOn', (event_data)=>{
      AudioToggle.setAudioMode(AudioToggle.SPEAKER);
    });
    this.events.subscribe('speakerOff', (event_data)=>{
      AudioToggle.setAudioMode(AudioToggle.NORMAL);
    });    
  }

  receive(){
    var self = this;
    var dial = {message:this.callerId};
    window.localStorage.setItem('category','inbound');
    var myModal = this.modal.create(CallingPage, dial);
    myModal.onDidDismiss(() => {
      self.currentCall.hangup();
    }); 
    myModal.present();      
     self.events.subscribe('received', (event_data) => {
       this.ring.pause();
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
  }

   ionViewDidLoad(){  
    this.server = localStorage.getItem('server');
    this.try = window.localStorage.getItem('us');
    window.localStorage.setItem('counter','false');
    // this.timeZone();
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
    var net = window.localStorage.getItem('network');
    console.log(net);
    this.calls.unshift(this.result);
    window.localStorage.setItem('category','outbound');
    var number = window.localStorage.getItem("phone");
    if(this.result === number){
      this.connect.presentToast('You cannot call yourself');
    }else if(this.net==='false'){
     this.connect.presentToast('No internet connection');   
    }else{
      this.events.publish('log:update', this.result);
      this.connect.Calls(this.result,this.currentCall,this.verto,this.user)
      var dial = {message:this.result};
      var myModal = this.modal.create(CallingPage, dial);
      myModal.onDidDismiss(() => {
        self.currentCall.hangup();
        self.currentCall = null;
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
    }
    this.result = this.code;
  }
  
  normalCall(){
    this.calls.push(this.result);
    // window.localStorage.setItem('Calls', JSON.stringify(this.calls));
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
    } 
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
        // console.log(result.data);
      } else{
        this.connect.errorMessage('cant get your timezones');
      } 
          },
        err=>{
         this.connect.errorMessage('unable to connect please check your connection');
    })
  }

   showNotification () {
    this.localNotifications.schedule({
      title:'Hello from Telvida',
      text: 'Notification from UcallTel App',
      foreground:true

    });

    this.notificationAlreadyReceived = true;
  }

  getPermission() {
    this.diagnostic.getPermissionAuthorizationStatus(this.diagnostic.permission.RECORD_AUDIO).then((status) => {
      console.log(`AuthorizationStatus`);
      console.log(status);
      if (status != this.diagnostic.permissionStatus.GRANTED) {
        this.diagnostic.requestRuntimePermission(this.diagnostic.permission.RECORD_AUDIO).then((data) => {
          console.log(`getSipAuthorizationStatus`);
          console.log(data);
        })
      } else {
        console.log("We have the permission");
      }
    }, (statusError) => {
      console.log(statusError);
    });
  }


}
