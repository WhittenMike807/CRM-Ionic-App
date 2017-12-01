import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AskDetails } from './ask-details';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min'

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    AskDetails,
  ],
  imports: [
    IonicPageModule.forChild(AskDetails),
    MbscModule,
    PipesModule
  ],
  exports: [
    AskDetails
  ]
})
export class AskDetailsModule {}
