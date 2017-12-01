import { CompanyProfile } from './company-profile';
import { GoogleMaps } from '@ionic-native/google-maps';
import { IonicPageModule } from 'ionic-angular';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { NgModule } from '@angular/core';
import { PipesModule } from './../../../pipes/pipes.module';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
    declarations: [
        CompanyProfile,
    ],
    imports: [
        IonicPageModule.forChild(CompanyProfile),
        PipesModule,
        MbscModule
    ],
    exports: [
        CompanyProfile
    ],
    providers: [
        GoogleMaps,
        NativeGeocoder
    ]   
})
export class CompanyProfileModule {}
