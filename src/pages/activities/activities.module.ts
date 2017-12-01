import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Activities } from './activities';
import { MbscModule } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';
import { mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
  declarations: [
    Activities,
  ],
  imports: [
    IonicPageModule.forChild(Activities),
    PipesModule,
    MbscModule
  ],
  exports: [
    Activities
  ]
})
export class ActivitiesModule {}
