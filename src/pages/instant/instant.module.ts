import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { InstantPage } from './instant';

@NgModule({
  declarations: [
    InstantPage,
  ],
  imports: [
    IonicPageModule.forChild(InstantPage),
  ],
})
export class InstantPageModule {}
