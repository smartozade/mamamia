import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import {NavController, ModalController, Nav, Events, ToastController, AlertController, LoadingController} from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Contacts } from "@ionic-native/contacts";
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';
import { Network } from '@ionic-native/network';
declare var cordova:any;

@Injectable()
export class ConnectProvider {
  countries: any;
  ringtone:any;
  list = [];
  public userDetails:any;
  public server:any;
  public url:any = 'wss://webrtc.telvida.com';
  public port:any = '8082';
  public subUrl:any = 'webrtc.telvida.com';
  @ViewChild(NavController) nav:NavController;

  constructor(public modal:ModalController, public http:Http, public event:Events, private contacts:Contacts, private sanitizer: DomSanitizer, 
    private toastCtrl:ToastController, private alertCtrl:AlertController, private loadingCtrl:LoadingController, private network:Network) {
      //http://ucalltelapi.telvida.com/
    window.localStorage.setItem('server', 'http://ucalltelapi.telvida.com/');
    this.server = window.localStorage.getItem('server');
    console.log(this.server);

    this.http.get(this.server +"api/countries")
      .map(res=>res.json()).subscribe(result=>{
      this.countries = result.data;
      if(this.countries){
        window.localStorage.setItem('countries', JSON.stringify(this.countries));
      }
      },
      err=>{
        console.log('Cant connect to Ucaltell Server');
      });
      
      let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      let options = new RequestOptions({headers: headers});
      this.http.get(this.server +"api/sip/servers", options)
      .map(res=>res.json()).subscribe(result=>{
        if(result){
          var test = result.data[0];
         this.url = test.url;
         this.subUrl = this.url.slice(6);
         this.port = test.port;
          console.log(this.url);
          console.log(this.port);
          console.log(this.subUrl);
        } else{
          this.presentToast('cant update your Server ');
        } 
            },
          err=>{
          console.log('unable to connect for user');
      });

      this.logs();

    }

  registration(ext, pass, port=this.port){
    var config = {    
    login: ext +'@'+this.subUrl,
    passwd: pass,
    socketUrl: this.url+':'+port,
    ringFile:'assets/sounds/bell_ring2.wav',
    iceServers: true,
    deviceParams: {
      useMic: 'any',
      useSpeak: 'any',
      useCamera: 'none',
    },
    tag: "webcam",
      
    };
    return config;
  }

  Calls(numb, currentCall,verto,user,id='7',email='sam@telvida.com') {
    currentCall = verto.newCall({
      destination_number: numb,
      caller_id_name: id,
      caller_id_number: user,
      outgoingBandwidth: 'default',
      incomingBandwidth: 'default',
      useStereo: false,
      useVideo: false,
      userVariables: {
        email: email,
      },
      dedEnc: false,
      useMic: 'any',
      useSpeak: 'any',
    });
  }

  connection(): void {
    this.network.onDisconnect()
      .subscribe(() => {
        this.showdash();
         window.localStorage.setItem('network','false');
      });
      this.network.onConnect()
      .subscribe(() => {
        this.showdash();
         window.localStorage.setItem('network','true');
      });
  }


  showAlert(title, mssg) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: mssg,
      buttons: ['OK']
    });
    alert.present();
  } 

  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 4000,
      position: 'top',
      cssClass: 'normalToast'
    });
    toast.present();
  }

  presentLoadingDefault() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
  
    loading.present();
  
    setTimeout(() => {
      loading.dismiss();
    }, 3000);
  }

  call(ua,dail,result){
    var session = ua.invite(dail,{
      sessionDescriptionHandlerOptions: {
        constraints: {
          audio: true,
          video: false
        }
      },
    });
    return session;
  }

  onMute(currentCall){
    currentCall.mute('toggle');
  }
    
  filterItems(searchTerm){ 
    var countries = JSON.parse(window.localStorage.getItem('countries'));
      return countries.filter((item) => {
          return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
  }

  getUser(){
    var token = window.localStorage.getItem('userToken');
    let headers = new Headers;
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      headers.append('Authorization','Bearer '+token);
      let options = new RequestOptions({headers: headers});
    this.http.get(this.server +"api/user", options)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
        this.userDetails = result.data;
        console.log(this.userDetails);
        var test = JSON.stringify(this.userDetails);
        window.localStorage.setItem('userDetails',test);
        window.localStorage.setItem("us",this.userDetails.extension.number);
        window.localStorage.setItem("pa",this.userDetails.extension.password);
        return this.userDetails;
      } else{
        this.presentToast('cant update your profile ');
      } 
          },
        err=>{
         console.log('unable to connect for user');
    })

  }

  getHistory(){ 
    var token = window.localStorage.getItem('userToken');
    let header = new Headers;
    header.append('Content-Type', 'application/json');
    header.append('Accept', 'application/json');
    header.append('Authorization','Bearer '+token);
    let option = new RequestOptions({headers: header});
    this.http.get(this.server +"api/credits/topups/history", option)
    .map(res=>res.json()).subscribe(result=>{
      if(result){
        console.log(result.data);
        var test = JSON.stringify(result.data)
        window.localStorage.setItem('history',test);
      } else{
        this.presentToast('unable to load credit history at this time ');
      } 
    },
      err=>{
      console.log('unable to connect please try again');
      })

  }

  getContacts(): void {
    this.contacts.find(
      ["displayName", "phoneNumbers","photos"],
      {multiple: true, hasPhoneNumber: true}
      ).then((contacts) => {
        for (var i=0 ; i < contacts.length; i++){
          if(contacts[i].displayName !== null) {
            var contact = [];
            contact["name"]   = contacts[i].displayName;
            contact["number"] = contacts[i].phoneNumbers[0].value;
            if(contacts[i].photos != null) {
              console.log(contacts[i].photos);
              contact["image"] = this.sanitizer.bypassSecurityTrustUrl(contacts[i].photos[0].value);
              console.log(contact);
            } else {
              contact["image"] = "assets/img/1.png";
            }
            this.list.push(contact);
          }
        }
    });
  }

  errorMessage(text) {
    let toast = this.toastCtrl.create({
      message: text,
      // duration: 3000,
      position: 'top',
      showCloseButton:true,
    });
    toast.present();
  }

  logs(){
    this.server = localStorage.getItem('server');
      var token = window.localStorage.getItem('userToken');
      let headers = new Headers;
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Authorization','Bearer '+token);
        let options = new RequestOptions({headers: headers});
      this.http.get(this.server +"api/call/logs",options)
      .map(res=>res.json()).subscribe(result=>{
        if(result){
          console.log(result);
          var logs = (result.data);
          var last_time = result.meta.last_call_time;
          window.localStorage.setItem('call', JSON.stringify(logs));
          window.localStorage.setItem('last_time',last_time);
          
        } else{
          this.errorMessage('cant get your logs');
        } 
            },
          err=>{
           console.log('unable to connect please check your connection');
      })
  
  }

  showdash(): void {
    // omitted;
  }

}
