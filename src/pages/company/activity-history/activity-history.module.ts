import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ActivityHistory } from './activity-history';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
    declarations: [
        ActivityHistory,
    ],
    imports: [
        IonicPageModule.forChild(ActivityHistory),
        PipesModule,
        MbscModule
    ],
    exports: [
        ActivityHistory
    ],
    providers: [
    ]   
})
export class ActivityHistoryModule {}
