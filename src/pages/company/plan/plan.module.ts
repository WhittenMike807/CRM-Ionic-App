import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Plan } from './plan';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
    declarations: [
        Plan,
    ],
    imports: [
        IonicPageModule.forChild(Plan),
        PipesModule,
        MbscModule
    ],
    exports: [
        Plan
    ],
    providers: [
    ]   
})
export class PlanModule {}
