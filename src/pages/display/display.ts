import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {FormControl} from '@angular/forms';
import {ConnectProvider} from '../../providers/connect/connect';
import {HomePage} from '../home/home';
import {SettingPage} from '../setting/setting';

import 'rxjs/add/operator/debounceTime';
/**
 * Generated class for the DisplayPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-display',
  templateUrl: 'display.html',
})
export class DisplayPage {
public country:any;
public page:any;
searchTerm: string = '';
searchControl: FormControl;
items:any;
searching:any = false;

  constructor(public navCtrl: NavController, public navParams: NavParams,  public connect:ConnectProvider) {
    this.page = window.localStorage.getItem('page');
    this.searchControl = new FormControl();
  }

  ionViewDidLoad() { 
      this.setFilteredItems();
      this.searchControl.valueChanges.debounceTime(700).subscribe(search => {
          this.searching = false;
          this.setFilteredItems();
      });
      console.log('ionViewDidLoad displayPage');
  }
 
  onSearchInput(){
      this.searching = true;
  }

  setFilteredItems() { 
      this.country = this.connect.filterItems(this.searchTerm);
  }
  

  coSelect(i){
    if(this.page ==='HomePage'){
    this.navCtrl.push(HomePage,{dial_code:this.country[i].phonecode, country:this.country[i].name, code:this.country[i].iso, cid:this.country[i].id, rate:this.country[i].call_rate});
    }else{
       this.navCtrl.push(SettingPage,{dial_code:this.country[i].phonecode, country:this.country[i].name, code:this.country[i].iso,  cid:this.country[i].id, rate:this.country[i].call_rate});
    }
  }
}
