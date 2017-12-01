import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Lead } from './lead';
import { MbscModule, mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';
import { PipesModule } from './../../pipes/pipes.module';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    Lead,
  ],
  imports: [
    IonicPageModule.forChild(Lead),
    MbscModule,
    PipesModule
  ],
  exports: [
    Lead
  ]
})
export class LeadModule {}
