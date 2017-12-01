import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddNote } from './add-note';
import { QuillModule } from 'ngx-quill';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    AddNote,
  ],
  imports: [
    IonicPageModule.forChild(AddNote),
    QuillModule,
    MbscModule
  ],
  exports: [
    AddNote
  ]
})
export class AddNoteModule {}
