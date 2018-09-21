import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import {Contacts} from '@ionic-native/contacts';
import {HttpModule} from '@angular/http';
import {Sim} from '@ionic-native/sim';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import {File} from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import {IonicStorageModule} from '@ionic/storage';
import {AndroidPermissions} from '@ionic-native/android-permissions';

import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import {SettingPage} from '../pages/setting/setting';
import { TabsPage } from '../pages/tabs/tabs';
import {MessagePage } from '../pages/message/message';
import {NotificationPage} from '../pages/notification/notification';
import {DisplayPage} from '../pages/display/display';
import {CallingPage} from '../pages/calling/calling';
import {LoginPage} from '../pages/login/login';
import {ConfigPage} from '../pages/config/config';
import {MyprofilePage} from '../pages/myprofile/myprofile';
import {PaymentPage} from '../pages/payment/payment';
import {TopupPage} from '../pages/topup/topup';
import {ContactViewPage } from '../pages/contact-view/contact-view';
import {MessagingPage} from '../pages/messaging/messaging';
import {HistoryPage} from '../pages/history/history';
import {RechargePage} from '../pages/recharge/recharge';
import {VoucherPage} from '../pages/voucher/voucher';
import {NewMessagePage} from '../pages/new-message/new-message';
import {PasswordPage} from '../pages/password/password';
import {SuperTabsModule} from 'ionic2-super-tabs';
import {EventDirective} from '../directives/event/event';




import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ConnectProvider } from '../providers/connect/connect';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    SettingPage,
    TabsPage,
    MessagePage,
    DisplayPage,
    NotificationPage,
    CallingPage,
    VoucherPage,
    HistoryPage,
    RechargePage,
    ConfigPage,
    LoginPage,
    TopupPage,
    PaymentPage,
    MyprofilePage,
    NewMessagePage,
    MessagingPage,
    ContactViewPage,
    PasswordPage,
    EventDirective

  ],
  imports: [
    BrowserModule,
    HttpModule,
    SuperTabsModule.forRoot(),
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp, {tabsPlacement:'bottom'}),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    SettingPage,
    TabsPage,
    MessagePage,
    DisplayPage,
    NotificationPage,
    CallingPage,
    ConfigPage,
    VoucherPage,
    HistoryPage,
    RechargePage,
    LoginPage,
    TopupPage,
    PaymentPage,
    MyprofilePage,
    NewMessagePage,
    MessagingPage,
    ContactViewPage,
    PasswordPage
  ],
  providers: [
    StatusBar,
    Contacts,
    SplashScreen,
    File,
    Sim,
    Transfer,
    Camera,
    FilePath,
    FileTransfer, 
    FileTransferObject, 
    AndroidPermissions,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ConnectProvider
  ]
})
export class AppModule {}
