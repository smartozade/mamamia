import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Contact, ContactFieldType, Contacts, IContactField, IContactFindOptions } from "@ionic-native/contacts";
import {ContactViewPage} from '../contact-view/contact-view';
import {FormControl} from '@angular/forms';
import {ConnectProvider} from '../../providers/connect/connect';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  list = [];
  contact:any;
  searchTerm: string = '';
  searchControl: FormControl;
  items:any;
  searching:any = false;
  constructor(public navCtrl: NavController, private contacts:Contacts, private sanitizer: DomSanitizer, public connect:ConnectProvider) {
    this.searchControl = new FormControl();

    // this.list = JSON.parse(window.localStorage.getItem('contacts'));
  }

  ionViewDidLoad(){  
   
    this.getContacts();
  }

  ionViewWillEnter() {
    // this.getContacts();
  }

   onSearchInput(){
      this.searching = true;
  }

   setFilteredItems() { 
      this.contact = this.connect.filterItems(this.searchTerm);
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
        // localStorage.setItem('contacts',JSON.stringify(this.list));
    });
  }

  contactView(i){
     var cont = this.list[i];
    this.navCtrl.push(ContactViewPage, 
      {detail:cont});
  }

  ionViewWillLeave(){

  }

  view(){
    this.navCtrl.push(ContactViewPage);
  }

}
