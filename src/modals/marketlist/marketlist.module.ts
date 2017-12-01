import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MarketList } from './marketlist';

@NgModule({
  declarations: [
    MarketList,
  ],
  imports: [
    IonicPageModule.forChild(MarketList),
  ],
  exports: [
    MarketList
  ]
})
export class MarketListModule {}
