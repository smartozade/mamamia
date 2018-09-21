import { Component } from '@angular/core';
import {NavController, Nav, NavParams} from 'ionic-angular';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';
import { HomePage } from '../home/home';
import {SettingPage} from '../setting/setting';
import {NotificationPage} from '../notification/notification';
import {ConfigPage} from '../config/config';
import {LoginPage} from '../login/login';

import {ConnectProvider} from '../../providers/connect/connect';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;
  tab4Root = NotificationPage;
  tab5Root = ConfigPage;

  public para:any;
  public pama:any;

  constructor(public connect:ConnectProvider, public navCtrl: NavController, public navParams:NavParams) {
   
  }

}
