import { HttpClient } from '@angular/common/http';
import { Injectable, ViewChild } from '@angular/core';
import {NavController, ModalController, Nav, Events} from 'ionic-angular';
import {SettingPage} from '../../pages/setting/setting';
import {CallingPage} from '../../pages/calling/calling';
import {Http, Headers, RequestOptions} from '@angular/http';

import 'rxjs/add/operator/map';

@Injectable()
export class ConnectProvider {
  countries: any;
  contry:any
  public userDetails:any;
  public server:any;
  @ViewChild(NavController) nav:NavController;

  constructor(public modal:ModalController, public http:Http, public event:Events) {

    this.server = localStorage.getItem('server');

  this.http.get(this.server +"api/countries")
    .map(res=>res.json()).subscribe(result=>{
     this.countries = result.data;
    },
    err=>{
      alert('error cant connect to Ucaltell Server');
    })
  }

  async callNumber(call, phoneNumber):Promise<any>{
    try{
      await call.callNumber(String(phoneNumber), true)
    }
    catch(e){
      console.error(e);
    }

  }

  registration(ext, pass, port='7443'){
    var config = {    
     userAgentString: "TelvidaMobileApp",     
     // Replace this IP address with your FreeSWITCH IP address
      uri: ext + '@webrtc.telvida.com',

      // Replace this IP address with your FreeSWITCH IP address
      // and replace the port with your FreeSWITCH ws port
      ws_servers: 'wss://webrtc.telvida.com:'+port,

      // FreeSWITCH Default Username
      authorizationUser: ext,

      // FreeSWITCH Default Password
      password: pass
      
    };
    return config;
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

    ua.on('ringing', function(){
      this.event.publish('ringing', 'ring');
    });
    ua.on('accepted', function(){
      this.event.pubish('accepted', 'accpted');
    });

    ua.on('rejected', function(){
      this.event.pubish('rejected', 'rejected');
    });
    return session;
  }

    accept(session){
      session.on('accepted', function(){
        alert('youve just picked');
      });
    }

    reject(session){
      session.on('rejected', function(){
        alert('user cancel call');
      });
    }
    

  filterItems(searchTerm){ 
      return this.countries.filter((item) => {
          return item.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
      });    
  }

  country(){
    this.http.get(this.server +"api/country")
    .map(res=>res.json()).subscribe(result=>{
     this.contry = result.data;
    },
    err=>{
      alert('error');
    })
    return this.contry;
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
        alert('cant update your profile ');
      } 
          },
        err=>{
         alert('unable to connect for user');
    })

  }


}
