import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditCompany } from './edit-company';

@NgModule({
    declarations: [
        EditCompany,
    ],
    imports: [
        IonicPageModule.forChild(EditCompany),
    ],
    exports: [
        EditCompany
    ]
})
export class EditCompanyModule {}
