import { EnvVariables } from './environment-variables/environment-variables.token';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LeadsService } from './../providers/leads-service';
import { ContactsService } from './../providers/contacts-service';
import { AskService } from './../providers/ask-service';
import { Storage } from '@ionic/storage';
import { Component, ViewChild, Inject } from '@angular/core';
import { Menu, NavController, Platform, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';

import { AuthService } from './../providers/auth-service';
import { SharedService } from './../providers/shared-service';
import { Deploy } from '@ionic/cloud-angular';
// import { ThreeDeeTouch, ThreeDeeTouchQuickAction, ThreeDeeTouchForceTouch } from '@ionic-native/three-dee-touch';

import { BrowserTab } from '@ionic-native/browser-tab';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  rootPage: any;

  @ViewChild('content') content: NavController;
  @ViewChild(Menu) menu: Menu;

  constructor(public platform: Platform, private auth: AuthService, private storage: Storage, public modalCtrl: ModalController, public loadingCtrl: LoadingController, public alertCtrl: AlertController, private browserTab: BrowserTab, private iab: InAppBrowser,
    private sharedService: SharedService, private askService: AskService, private leadsService: LeadsService, private contactsService: ContactsService, private statusBar: StatusBar, private splashScreen: SplashScreen, private toastCtrl: ToastController, private deploy: Deploy,  @Inject(EnvVariables) private envVariables) {
    this.platform.ready().then(() => {
      // console.log(envVariables);
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.deploy.channel = envVariables.ionicEnvName;
      this.initializeApp();
    });

    
  }

  checkForUpdate() {
    const checking = this.loadingCtrl.create({
      content: 'Checking for update...',
      dismissOnPageChange: true
    });
    checking.present();

    this.deploy.check().then((snapshotAvailable: boolean) => {
      if (snapshotAvailable) {
        this.presentConfirm();
        checking.dismiss();
      }
      else {
        const toast = this.toastCtrl.create({
          message: 'No update available',
          duration: 1500,
          position: 'middle',
          cssClass: 'centerToastText',
          dismissOnPageChange: true
        });
        toast.present();
        checking.dismiss();
      }
    });
  }

  private presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirm update',
      message: 'Do you want to update the app?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.downloadAndInstall();
          }
        }
      ]
    });
    alert.present();
  }

    private presentSurveyConfirm() {
    let alert = this.alertCtrl.create({
      title: 'AMP Mobile App - Feedback',
      message: 'Please tell how AMP Mobile is working',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.storage.set('showSurveyMonkey', false);
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.iab.create('https://www.surveymonkey.com/r/ZP8FDL3');
            this.storage.set('showSurveyMonkey', false);
          }
        }
      ]
    });
    alert.present();
  }


  private downloadAndInstall() {
    const updating = this.loadingCtrl.create({
      content: 'Installing New Features'
    });
    updating.present();
    //this.splashScreen.show();
    this.deploy.download().then(() => this.deploy.extract()).then(() => this.deploy.load());
  }



  initializeApp() {
    this.storage.get('showSurveyMonkey').then((val) => {
      if (val === null) {
          this.presentSurveyConfirm();
        }
      });

    if (this.platform.is('cordova')) {
      
      // this.storage.get('showSurveyMonkey').then((val) => {
      //   if (val) {
      //     this.presentSurveyConfirm();
      //   }
      // });

      this.deploy.check().then((snapshotAvailable: boolean) => {
        if (snapshotAvailable) {
          this.downloadAndInstall();
        }
      });
    }

    let status = this.auth.getUserStatus();
    if (status.isLoggedIn) {

      this.sharedService.SetMarketStations();
      this.sharedService.SetUsersData();
      this.sharedService.SetUsersCompanies();
      this.askService.SetCorporateCampaigns();
      this.askService.SetStationCampaigns();
      this.leadsService.SetCompanyTypes();
      this.leadsService.SetRevenueTypes();
      this.contactsService.setAllCompaniesAndContacts();
      
      this.storage.get('lastPageViewed').then((val) => {
        if (val) {
          this.content.setRoot(val);
        } else {
          this.storage.set('lastPageViewed', 'Activities');
          this.content.setRoot('Activities');
        }
      });

    } else {
      this.content.setRoot('LoginPage');
    }
  }

  launchSurvey(){
    
  }


  navigate(name) {
    // console.log(name);
    
    this.storage.ready().then(() => {
      if (name !== 'AboutPage') {
        this.storage.set('lastPageViewed', String(name));
      }
      
      this.content.setRoot(name);
        
    })
  }

  closeMenu() {
    this.menu.close();
  }

  logout() {
    this.auth.logout();
    this.storage.remove('lastPageViewed');
    this.content.setRoot('LoginPage');
  }


  openUserMarketsModal() {
    let modal = this.modalCtrl.create('MarketList');
    modal.onDidDismiss(res => {
      this.sharedService.SetMarketStations();
      this.sharedService.SetUsersData();
      this.sharedService.SetUsersCompanies();
      this.leadsService.SetCompanyTypes();
      this.leadsService.SetRevenueTypes();
      this.contactsService.setAllCompaniesAndContacts();
      this.content.setRoot(this.content.getActive().component);
    })
    modal.present();

  }
}