import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditNote } from './edit-note';
import { QuillModule } from 'ngx-quill';
import { MbscModule, mobiscroll } from './../../../lib/mobiscroll/js/mobiscroll.custom-3.2.1.min';

mobiscroll.settings = {
   theme: 'ios'
};

@NgModule({
  declarations: [
    EditNote,
  ],
  imports: [
    IonicPageModule.forChild(EditNote),
    QuillModule,
    MbscModule
  ],
  exports: [
    EditNote
  ]
})
export class EditNoteModule {}
