import _ from 'lodash';
import { ActivitiesService } from './../../providers/activities-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { extendMoment } from 'moment-range';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { LeadsService } from './../../../providers/leads-service';
import Moment from 'moment';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-notes',
    templateUrl: 'notes.html',
    encapsulation: ViewEncapsulation.None
})

export class Notes {
    accountDetails: any;
    leadNotes: any;

    formSettings: any = {
        
    };

    constructor(navParams: NavParams, private leadsService: LeadsService, private modalCtrl: ModalController) {
        this.accountDetails = navParams.data;
    }

    ionViewDidLoad() {
        this.leadsService.setLeadNotes(this.accountDetails.leadId);
    }

    doRefresh(event) {
        this.leadsService.setLeadNotes(this.accountDetails.leadId);
        setTimeout(() => {
            event.complete();    
        }, 2000);
    }

    editNote(note) {
        let modal = this.modalCtrl.create('EditNote', note);
        modal.onDidDismiss(data => {

        });
        modal.present();
    }
}