import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAsk } from './add-ask';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
  declarations: [
    AddAsk,
  ],
  imports: [
    IonicPageModule.forChild(AddAsk),
    PipesModule,
    MbscModule
  ],
  exports: [
    AddAsk
  ]
})
export class AddAskModule {}
