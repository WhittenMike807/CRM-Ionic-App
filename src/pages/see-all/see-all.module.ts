import { CompanyListComponentModule } from './../../components/company-list/company-list.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SeeAll } from './see-all';
import { MbscModule, mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    SeeAll,
  ],
  imports: [
    CompanyListComponentModule,
    IonicPageModule.forChild(SeeAll),
    MbscModule
  ],
  exports: [
    SeeAll
  ]
})
export class SeeAllModule {}
