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
    selector: 'page-revenue',
    templateUrl: 'revenue.html',
    encapsulation: ViewEncapsulation.None
})

export class Revenue {
    accountDetails: any;
    spendingCY: any;
    spendingLY: any;

    formSettings: any = {
        
    };

    constructor(navParams: NavParams, private leadsService: LeadsService) {
        this.accountDetails = navParams.data;
    }

    ionViewDidLoad() {
        if (this.accountDetails.type === 'Account') {
            this.leadsService.setAccountSpending(this.accountDetails.leadId);
        }
    }

    doRefresh(event) {
        if (this.accountDetails.type === 'Account') {
            this.leadsService.setAccountSpending(this.accountDetails.leadId);
        }
        setTimeout(() => {
            event.complete();    
        }, 2000);
    }
}