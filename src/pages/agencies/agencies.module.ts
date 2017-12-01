import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Agencies } from './agencies';
import { MbscModule, mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    Agencies,
  ],
  imports: [
    IonicPageModule.forChild(Agencies),
    MbscModule
  ],
  exports: [
    Agencies
  ]
})
export class AgenciesModule {}
