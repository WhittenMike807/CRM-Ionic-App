import { EnvVariables } from './../../app/environment-variables/environment-variables.token';
import { Component,  ViewChild, Inject } from '@angular/core';
import { NavController,  AlertController,  LoadingController,  Loading,  IonicPage,  App,  ViewController,  Platform } from 'ionic-angular';
import { AuthService } from '../../providers/auth-service';
import { SharedService } from '../../providers/shared-service';
import { AskService } from '../../providers/ask-service';
import { LeadsService } from '../../providers/leads-service';
import { ContactsService } from '../../providers/contacts-service';
import { Storage } from '@ionic/storage';
import { Keyboard } from 'ionic-native';
import { TouchID } from '@ionic-native/touch-id';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  //@ViewChild('content') content: NavController;
  loading: Loading;
  registerCredentials = {
    username: '',
    password: '',
    rememberMe: false
  };
  disablePasswordInput: boolean = false;
  
  userIsAuthenicated: boolean = false;
  subscription: any;

  @ViewChild('input') myInput;


  constructor(private nav: NavController, private sharedService: SharedService, private contactsService: ContactsService, private askService: AskService, private leadsService: LeadsService, private auth: AuthService, private alertCtrl: AlertController, private loadingCtrl: LoadingController, private app: App, private viewCtrl: ViewController, private storage: Storage, private touchId: TouchID, private platform: Platform, @Inject(EnvVariables) private envVariables) {    
    platform.ready().then(() => {

      // this.touchId.verifyFingerprintWithCustomPasswordFallback('Fingerprints are Awesome')
      //   .then(
      //     res => this.login(),
      //     err => this.showTouchError(err)
      //   );
    });
  }

  ionViewWillEnter() {
    
    this.storage.ready().then(() => {
      this.storage.get('username').then((val) => {
        this.registerCredentials.username = val;
      });
      this.storage.get('password').then((val) => {
        this.registerCredentials.password = val;
      });
      this.storage.get('rememberMe').then((val) => {
        this.registerCredentials.rememberMe = val;
        this.disablePasswordInput = val;
      });
    });
  }

  ionViewLoaded() {
  }

  ionViewDidLoad() {
  }



  login() {
    this.showLoading()
    this.auth.login(this.registerCredentials).subscribe(statusData => {
        if (statusData.isLoggedIn) {
          this.sharedService.SetMarketStations();
          this.sharedService.SetUsersData();
          this.sharedService.SetUsersCompanies();
          this.askService.SetCorporateCampaigns();
          this.askService.SetStationCampaigns();
          this.leadsService.SetCompanyTypes();
          this.leadsService.SetRevenueTypes();
          this.contactsService.setAllCompaniesAndContacts();
          
          if (this.registerCredentials.rememberMe) {
            this.storage.ready().then(() => {
              this.storage.set('username', this.registerCredentials.username);
              this.storage.set('password', this.registerCredentials.password);
              this.storage.set('rememberMe', true);
              this.disablePasswordInput = true;
            })

          }
           this.nav.setRoot('Activities');
        } else {
          this.showError(statusData.loginMessage);
        }
      },
      error => {
        this.showError(error);
      });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }


  showTouchError(text) {
    let alert = this.alertCtrl.create({
      title: 'Login Failed',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present(prompt);
  }

  clearRememberMe() {
    this.storage.ready().then(() => {
      this.storage.remove('username');
      this.storage.remove('password');
      this.storage.remove('rememberMe');
    }).then(() => {
      this.registerCredentials.username = '';
      this.registerCredentials.password = '';
      this.registerCredentials.rememberMe = false;
      this.disablePasswordInput = false;
      setTimeout(() => {
        Keyboard.show();
        this.myInput.setFocus();
      }, 150);
    });
  }


}