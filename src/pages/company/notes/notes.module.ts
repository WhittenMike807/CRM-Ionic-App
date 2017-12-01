import { PipesModule } from './../../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Notes } from './notes';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};


@NgModule({
    declarations: [
        Notes,
    ],
    imports: [
        IonicPageModule.forChild(Notes),
        PipesModule,
        MbscModule
    ],
    exports: [
        Notes
    ],
    providers: [
    ]   
})
export class NotesModule {}
