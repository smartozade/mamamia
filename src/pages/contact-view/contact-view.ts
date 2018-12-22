import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {CallingPage} from '../calling/calling';
import {ConnectProvider} from '../../providers/connect/connect';
import { Events } from 'ionic-angular';

declare var $:any;

@IonicPage()
@Component({
  selector: 'page-contact-view',
  templateUrl: 'contact-view.html',
})
export class ContactViewPage {
  public contact:any;
  call:any;
  ua:any;
  user;
  pass;
  logs;
  config;
  verto:any;
  currentCall:any;
  callbacks:any; 

  constructor(public navCtrl: NavController, public navParams: NavParams, public modal:ModalController, public connect:ConnectProvider, public events:Events) {
    this.contact = navParams.get('detail');
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
        if(d.state.name =='ringing'){
          // this.receive();
        }  else if((d.state.name =='destroy')||(d.state.name =='hangup')){
          this.events.publish('closed', 'closed');
        }else if(d.gotAnswer){
          this.events.publish('accepted', 'accpted'); 
        }
      },  
     };
     var audio = new Audio('assets/sounds/bell_ring2.mp3');
    this.config = this.connect.registration(this.user,this.pass);
    this.verto = new $.verto(this.config,this.callbacks); 
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
    var self = this;
    var dial = {message:this.contact.number};
    // if(this.connect.connection){
    //   this.connect.presentToast('No internet connection');   
    // }else{
      window.localStorage.setItem('category','outbound');
      this.connect.Calls(this.contact.number,this.currentCall,this.verto,this.user);
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
        this.events.publish('log:update', this.contact.number);
    // }
  }

  ionViewWillLeave(){
    window.localStorage.setItem('calls', JSON.stringify(this.logs)); 
  }

}
