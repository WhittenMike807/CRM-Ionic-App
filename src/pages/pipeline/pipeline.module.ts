import { CalculateTotal } from './../../pipes/calculate-total';
import { ShrinkHeader } from './../../lib/shrink-header';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Pipeline } from './pipeline';
import {RoundProgressModule} from 'angular-svg-round-progressbar';


@NgModule({
  declarations: [
    Pipeline,
    CalculateTotal,
    ShrinkHeader
  ],
  imports: [
    IonicPageModule.forChild(Pipeline),
    RoundProgressModule,
  ],
  exports: [
    Pipeline,
  ]
})
export class PipelineModule {}
