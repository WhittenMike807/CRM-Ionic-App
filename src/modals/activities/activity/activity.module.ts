import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Activity } from './activity';
import { MbscModule } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min'


@NgModule({
  declarations: [
    Activity,
  ],
  imports: [
    IonicPageModule.forChild(Activity),
    MbscModule
  ],
  exports: [
    Activity
  ]
})
export class AddActivityModule {}
