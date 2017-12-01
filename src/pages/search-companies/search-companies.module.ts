import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchCompanies } from './search-companies';

@NgModule({
  declarations: [
    SearchCompanies,
  ],
  imports: [
    IonicPageModule.forChild(SearchCompanies),
  ],
  exports: [
    SearchCompanies
  ]
})
export class SearchCompaniesModule {}
