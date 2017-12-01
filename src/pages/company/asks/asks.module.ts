import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Asks } from './asks';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
    declarations: [
        Asks,
    ],
    imports: [
        IonicPageModule.forChild(Asks),
        PipesModule,
        MbscModule
    ],
    exports: [
        Asks
    ],
    providers: [
    ]   
})
export class AsksModule {}
