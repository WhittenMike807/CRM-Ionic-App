import { BrowserTab } from '@ionic-native/browser-tab';
import { PipesModule } from './../pipes/pipes.module';
import { EnvironmentsModule } from './environment-variables/environment-variables.module';
import { ActivitiesService } from './../providers/activities-service';
import { MarketService } from './../providers/market-service';
import { AuthService } from './../providers/auth-service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { RestangularModule } from 'ngx-restangular';
import { MyApp } from './app.component';
import { IonicStorageModule } from '@ionic/storage';
import { TouchID } from '@ionic-native/touch-id';
import { FileOpener} from '@ionic-native/file-opener';
import { LeadsService } from './../providers/leads-service';
import { ContactsService } from './../providers/contacts-service';
import { SharedService } from './../providers/shared-service';
import { AskService } from './../providers/ask-service';
import { BudgetService } from './../providers/budget-service';
import { EngageService } from './../providers/engage-service';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';
import { AppVersion } from '@ionic-native/app-version';
import { File } from '@ionic-native/file';
import { Transfer } from '@ionic-native/transfer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import {FormsModule} from '@angular/forms';

// import { MbscModule } from '../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min.js';

export const APP_API_KEY = '0B4705D3-CBB4-4843-BC47-663FAD0AE87A';
export function RestangularConfigFactory(RestangularProvider, EngageService) {
    RestangularProvider.setBaseUrl(EngageService.envVariables.apiEndpoint);
    RestangularProvider.setDefaultHttpFields({ withCredentials: true });
    //RestangularProvider.setDefaultHeaders({'X-ENGAGE-MOBILE': APP_API_KEY});
    RestangularProvider.setPlainByDefault(true);

    RestangularProvider.addFullRequestInterceptor((element, operation, path, url, headers, param) => {
        setTimeout(() => EngageService.sent(), 2000);
        return {
            headers: Object.assign({}, headers, { 'X-ENGAGE-MOBILE': APP_API_KEY })
        };
    });
    RestangularProvider.addResponseInterceptor((data, operation, what, url, response) => {
        EngageService.received();
        return data;
    });
    RestangularProvider.addErrorInterceptor(
    function(response, deferred, responseHandler) {
        EngageService.received();
        return true; // error not handled
    });
}
const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '95fd9fb3'
  }
};

export function startupServiceFactory(auth: AuthService): Function {
    return () => auth.load();
}

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    // MbscModule,
    FormsModule,
    RestangularModule.forRoot([EngageService],RestangularConfigFactory),
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    CloudModule.forRoot(cloudSettings),
    EnvironmentsModule,
    PipesModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthService,
    TouchID,
    FileOpener,
    BrowserTab,
    InAppBrowser,
    ActivitiesService,
    MarketService,
    LeadsService,
    SharedService,
    ContactsService,
    AskService,
    BudgetService,
    AppVersion,
    EngageService,
    File,
    Transfer,
    {
      provide: APP_INITIALIZER,
      useFactory: startupServiceFactory,
      deps: [AuthService],
      multi: true
    }
  ]
})
export class AppModule {}
