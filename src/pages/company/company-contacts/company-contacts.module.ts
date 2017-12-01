import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CompanyContacts } from './company-contacts';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';



mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
    declarations: [
        CompanyContacts,
    ],
    imports: [
        IonicPageModule.forChild(CompanyContacts),
        PipesModule,
        MbscModule
    ],
    exports: [
        CompanyContacts
    ],
    providers: [
    ]   
})
export class CompanyContactsModule {}
