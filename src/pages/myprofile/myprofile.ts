import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController, ToastController, Platform, Loading, LoadingController } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { Transfer, FileUploadOptions, TransferObject } from '@ionic-native/transfer';
import { FilePath } from '@ionic-native/file-path';
import { Camera } from '@ionic-native/camera';
import {NewMessagePage} from '../new-message/new-message';
import {MessagingPage} from '../messaging/messaging';
import {ConnectProvider} from '../../providers/connect/connect';
import {Http, Headers, RequestOptions} from '@angular/http';


@IonicPage()
@Component({
  selector: 'page-myprofile',
  templateUrl: 'myprofile.html',
})
export class MyprofilePage {
  public ucalltel:any;
  public username:any;
  public userDetails:any;
  public size:boolean= true;
  public balance:any;
  public lastImage:string = null;
  public loading:Loading;
  public upload:boolean = false;
  public photo:any;
  public server:any;
  public fname:any;
  public lname:any;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private camera: Camera, private transfer: Transfer, private file: File, private filePath: FilePath, 
    public actionSheetCtrl: ActionSheetController, public toastCtrl: ToastController, public platform: Platform, public loadingCtrl: LoadingController,
    public connect:ConnectProvider, public http:Http) {
      this.userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
      this.balance = this.userDetails.credits ||'0.00';
      this.photo = this.userDetails.photo;
      this.lastImage = localStorage.getItem('lastImage');
      console.log(this.balance);
      this.username = this.userDetails.username;
      this.ucalltel = this.userDetails.extension.number;
      this.fname = this.userDetails.first_name;
      this.lname = this.userDetails.last_name;
   
  }

  ionViewDidLoad() {
    this.userDetails = JSON.parse(window.localStorage.getItem('userDetails'));
    this.server = localStorage.getItem('server');
    console.log('ionViewDidLoad MyprofilePage');    
  }

  ionViewWillEnter() {
    this.connect.getUser();
  }  

  public presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Select Image Source',
      buttons: [
        {
          text: 'Load from Library',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            this.takePicture(this.camera.PictureSourceType.CAMERA);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    actionSheet.present();
    this.upload = true;
  }


  public takePicture(sourceType) {
  // Create options for the Camera Dialog
    var options = {
    quality: 100,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true
  };
 
  // Get the data of an image
  this.camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === this.camera.PictureSourceType.PHOTOLIBRARY) {
      this.filePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

// Create a new name for the image
private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  this.file.copyFile(namePath, currentName, this.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';//"assets/img/3.png";
  } else {
    return this.file.dataDirectory + img;
  }
}

changePin(){
    this.navCtrl.push(MessagingPage);
  }

updateProfile(){
  this.navCtrl.push(NewMessagePage);
}

public uploadImage() {
  let token = window.localStorage.getItem('userToken');
  let url = this.server +"api/user/photo";
  let photo = this.pathForImage(this.lastImage);
  let options: FileUploadOptions = {
    fileKey: 'photo',
    mimeType: "multipart/form-data",
    chunkedMode: false,
    httpMethod: 'POST',
    headers: {
      Accept: 'application/json',
      Authorization: 'Bearer ' + token
    }
  };

  const fileTransfer: TransferObject = this.transfer.create();
  console.log(photo);
  this.loading = this.loadingCtrl.create({
    content:'Uploading ....',
  })
  this.loading.present(); 
  fileTransfer.upload(photo, url, options)
    .then((res) => {
      this.loading.dismissAll()
      this.presentToast('Image succesful uploaded.');
      localStorage.setItem('lastImage', this.lastImage);
      
      this.upload = false;
    }).catch((err) => {
      this.loading.dismissAll()
      this.presentToast('Error while uploading file.');
      console.log(err);
    })

  
}

}
