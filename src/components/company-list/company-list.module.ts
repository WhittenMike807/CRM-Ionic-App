import { PipesModule } from './../../pipes/pipes.module';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import { IonicModule, IonicPageModule } from 'ionic-angular';
import { CompanyListComponent } from './company-list';

@NgModule({
  declarations: [
    CompanyListComponent,
  ],
  imports: [
    IonicModule,
    CommonModule,
    PipesModule
    // IonicPageModule.forChild(CompanyListComponent)
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [
    CompanyListComponent
  ]
})
export class CompanyListComponentModule {}
