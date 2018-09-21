import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DomSanitizer } from '@angular/platform-browser';
import { Contact, ContactFieldType, Contacts, IContactField, IContactFindOptions } from "@ionic-native/contacts";
import {ContactViewPage} from '../contact-view/contact-view';
@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {
  list = [];
  cat: string = "men"; // default button
  constructor(public navCtrl: NavController, private contacts:Contacts, private sanitizer: DomSanitizer) {
    contacts.find(['displayName', 'phoneNumbers', 'photos'], {multiple: true})
      .then((contacts) => {
        for (var i=0 ; i < contacts.length; i++){
          if(contacts[i].displayName !== null) {
          this.list.push(contacts[i]);
          }else{
            continue;
          }
        }
      }).catch(err=>{
        console.log('Error');

      });  
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
              contact["image"] = "assets/dummy-profile-pic.png";
            }
            this.list.push(contact);
          }
        }
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
