import { IonicModule } from 'ionic-angular';
import { MbscModule } from './../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';
import { NgModule } from '@angular/core';
 
@NgModule({
  declarations: [
    MbscModule
  ],
  imports: [
    IonicModule
  ],
  exports: [
    MbscModule
  ]
})
export class ComponentsModule {}