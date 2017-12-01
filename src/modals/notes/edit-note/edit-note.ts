import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Restangular } from 'ngx-restangular';

@IonicPage()
@Component({
    selector: 'page-edit-note',
    templateUrl: 'edit-note.html',
})

export class EditNote {

    note: any;

    constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular) {
        this.note = navParams.data;
    }

    editCancel() {
        this.view.dismiss('');
    }

    editSave() {
        this.restangular.all('Lead/UpdateLeadNote').customPOST(this.note);
        this.view.dismiss('');
    }

}
