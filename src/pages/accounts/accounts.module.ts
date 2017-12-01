import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Accounts } from './accounts';
import { MbscModule, mobiscroll } from './../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    Accounts,
  ],
  imports: [
    IonicPageModule.forChild(Accounts),
    MbscModule
  ],
  exports: [
    Accounts
  ]
})
export class AccountsModule {}
