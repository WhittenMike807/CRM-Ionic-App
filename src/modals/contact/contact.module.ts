import { Contact } from './contact';
import { IonicPageModule } from 'ionic-angular';
import { MbscModule, mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';
import { NgModule } from '@angular/core';

@NgModule({
  declarations: [
    Contact
  ],
  imports: [
    IonicPageModule.forChild(Contact),
    MbscModule,
  ],
  exports: [
    Contact
  ]
})
export class ContactModule {}
