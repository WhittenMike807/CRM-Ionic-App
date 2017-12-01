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
    selector: 'page-company-contacts',
    templateUrl: 'company-contacts.html',
    encapsulation: ViewEncapsulation.None
})

export class CompanyContacts {
    accountDetails: any;
    contacts: any;

    formSettings: any = {
        
    };

    constructor(navParams: NavParams, private leadsService: LeadsService, private modalCtrl: ModalController,) {
        this.accountDetails = navParams.data;
    }

    ionViewDidLoad() {
        this.leadsService.setLead(this.accountDetails.leadId);
        // this.leadsService.getLead(this.accountDetails.id).subscribe(res => {
        //     this.contacts = _.orderBy(res.leadContacts, 'isDecisionMaker', 'desc');
        //     console.log('contacts', res);
        // });
    }

    doRefresh(event) {
        this.leadsService.setLead(this.accountDetails.leadId);
        setTimeout(() => {
            event.complete();    
        }, 2000);
    }

    cancel(event) {
        event.stopPropagation();
    }

    editContact(contact) {
        let modal = this.modalCtrl.create('Contact', { editContact: contact });
        modal.onDidDismiss(data => {
            // check cancel
            this.leadsService.getLead(this.accountDetails.leadId).subscribe(res => {
                this.contacts = _.orderBy(res.leadContacts, 'isDecisionMaker', 'desc');
            });
        });
        modal.present();
    }
}