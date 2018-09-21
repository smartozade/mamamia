import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {LoginPage} from '../pages/login/login';
import {HomePage} from '../pages/home/home';
import {AndroidPermissions} from '@ionic-native/android-permissions';

import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = LoginPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private androidPermissions:AndroidPermissions) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();  
      
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT).then(
        result => console.log('Has permission?',result.hasPermission),
        err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT)
      );
      
      this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAPTURE_AUDIO_OUTPUT, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);
      
      //config settings
      localStorage.setItem('server', 'http://172.16.2.235/');
      const configSet = localStorage.getItem('username');
      if (configSet) {
        this.rootPage = TabsPage;
      } else {
        this.rootPage = LoginPage;
      }
      //settings ends here

    });
  }
}
