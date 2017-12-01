import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CloseActivity } from './close-activity';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min'

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    CloseActivity,
  ],
  imports: [
    IonicPageModule.forChild(CloseActivity),
    MbscModule
  ],
  exports: [
    CloseActivity
  ]
})
export class CloseActivityModule {}
