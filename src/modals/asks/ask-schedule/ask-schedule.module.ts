import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AskSchedule } from './ask-schedule';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min'

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    AskSchedule,
  ],
  imports: [
    IonicPageModule.forChild(AskSchedule),
    MbscModule
  ],
  exports: [
    AskSchedule
  ]
})
export class AskScheduleModule {}
