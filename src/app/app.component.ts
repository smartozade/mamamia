import { Component } from '@angular/core';
import { Platform, AlertController, ActionSheetController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import {AndroidPermissions} from '@ionic-native/android-permissions';
import { BackgroundMode } from '@ionic-native/background-mode';
import {Network} from '@ionic-native/network';
import {Http} from '@angular/http';
import 'rxjs/add/operator/map';
import { TabsPage } from '../pages/tabs/tabs';

declare var cordova:any;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;
  public test;
 
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private androidPermissions:AndroidPermissions, public backgroundMode:BackgroundMode,
    public http:Http, private alertCtrl:AlertController, private network:Network) {
    platform.ready().then(() => {
      cordova.plugins.autoStart.enable();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // window.localStorage.setItem('server', 'http://172.16.2.235/');
      statusBar.styleDefault();
      splashScreen.hide();  
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT)
      );
      
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
      this.androidPermissions.PERMISSION.CallPhone;
        //http://ucalltelapi.telvida.com/api/
      this.http.get("http://ucalltelapi.telvida.com/api/countries")
      .map(res=>res.json()).subscribe(result=>{
      var countries = result.data;
      if(countries){
        window.localStorage.setItem('countries', JSON.stringify(countries));
      }
      },
      err=>{
        console.log('Cant connect to Ucaltell Server');
        
      });    
      //config settings
      const configSet = localStorage.getItem('username');
      if (configSet) {
        this.rootPage = TabsPage;
      } else {
        this.test = window.localStorage.getItem('countries');
        this.showAlert();
        if(this.test){
          this.rootPage = LoginPage;
        }else{
         alert('UcallTel require internet connection please connect and try again');
          // document.location.href = 'index.html';
          platform.exitApp();
        }
      }
      //settings ends here

    });
  }

  private showAlert(): void {
    // omitted;
  }

}
