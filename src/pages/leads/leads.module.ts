import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Leads } from './leads';
import { MbscModule, mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    Leads,
  ],
  imports: [
    IonicPageModule.forChild(Leads),
    MbscModule
  ],
  exports: [
    Leads
  ]
})
export class LeadsModule {}
