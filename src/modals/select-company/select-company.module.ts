import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SelectCompany } from './select-company';

@NgModule({
  declarations: [
    SelectCompany,
  ],
  imports: [
    IonicPageModule.forChild(SelectCompany),
  ],
  exports: [
    SelectCompany
  ]
})
export class SelectCompanyModule {}
