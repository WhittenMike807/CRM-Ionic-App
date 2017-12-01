import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditAsk } from './edit-ask';

@NgModule({
  declarations: [
    EditAsk,
  ],
  imports: [
    IonicPageModule.forChild(EditAsk),
  ],
  exports: [
    EditAsk
  ]
})
export class EditAskModule {}
