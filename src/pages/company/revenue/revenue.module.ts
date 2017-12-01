import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Revenue } from './revenue';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
    declarations: [
        Revenue,
    ],
    imports: [
        IonicPageModule.forChild(Revenue),
        PipesModule,
        MbscModule
    ],
    exports: [
        Revenue
    ],
    providers: [
    ]   
})
export class RevenueModule {}
