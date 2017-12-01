import { EnvVariables } from './../../app/environment-variables/environment-variables.token';
import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { AppVersion } from '@ionic-native/app-version';

@IonicPage()
@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
})
export class AboutPage {
  versionNumber;
  constructor(public navCtrl: NavController, @Inject(EnvVariables) private envVariables, private appVersion: AppVersion, private platform: Platform) {
    if (this.platform.is('cordova')) {
      appVersion.getVersionNumber().then((s) => {
        this.versionNumber = s;
      })
    }
  }

  ionViewDidLoad() {

  }

}
