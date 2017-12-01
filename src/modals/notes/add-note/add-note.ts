import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Restangular } from 'ngx-restangular';

@IonicPage()
@Component({
    selector: 'page-add-note',
    templateUrl: 'add-note.html',
})

export class AddNote {

    note: any = {};
    leadId: string;

    constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular) {
        
        this.leadId = navParams.get('leadId');
    }

    editCancel() {
        let data = { userCanceled: true };
        this.view.dismiss(data);
    }

    editSave() {
        this.note.leadId = this.leadId;
        this.restangular.all('Lead/AddLeadNote').post(this.note);
        this.view.dismiss('');
    }

}
