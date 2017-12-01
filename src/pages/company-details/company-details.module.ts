import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyDetails } from './company-details';
import { GoogleMaps } from '@ionic-native/google-maps';
import { NativeGeocoder } from '@ionic-native/native-geocoder';
import { MbscModule, mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
    declarations: [
        CompanyDetails,
    ],
    imports: [
        IonicPageModule.forChild(CompanyDetails),
        PipesModule,
        MbscModule
    ],
    exports: [
        CompanyDetails
    ],
    providers: [
        GoogleMaps,
        NativeGeocoder
    ]   
})
export class CompanyDetailsModule {}
