import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PipelineList } from './pipeline-list';

@NgModule({
  declarations: [
    PipelineList,
  ],
  imports: [
    IonicPageModule.forChild(PipelineList),
  ],
  exports: [
    PipelineList
  ]
})
export class PipelineListModule {}
