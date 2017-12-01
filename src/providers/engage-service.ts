import { EnvVariables } from '../app/environment-variables/environment-variables.token';
import { Injectable, Inject } from '@angular/core';
import { Loading, LoadingController } from 'ionic-angular';


import 'rxjs/add/operator/map';

@Injectable()
export class EngageService {

  count = 0;
  loading: Loading;

  constructor(public loadingCtrl: LoadingController, @Inject(EnvVariables) private envVariables) {

  }

  public sent() {
    if (this.loading == null) {
        this.loading = this.loadingCtrl.create({
          content: 'Please wait...',
          dismissOnPageChange: false
        });
      }

      if (this.count == 0) {
        this.loading.present();
      }

      this.count++;
      // console.log('Present Count: ' + this.count);
  }

  public received() {
    this.count--;
    // console.log('Present Count: ' + this.count);

    if (this.count == 0) {
      this.loading.dismiss();
    }
  }
}