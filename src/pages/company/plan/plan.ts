import _ from 'lodash';
import { ActivitiesService } from './../../providers/activities-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { extendMoment } from 'moment-range';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { LeadsService } from './../../../providers/leads-service';
import { SharedService } from './../../../providers/shared-service';
import Moment from 'moment';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-plan',
    templateUrl: 'plan.html',
    encapsulation: ViewEncapsulation.None
})

export class Plan {
    accountDetails: any;
    spendingData: any;
    userData$: any;

    formSettings: any = {
        
    };

    constructor(navParams: NavParams, private leadsService: LeadsService, private sharedService: SharedService) {
        this.accountDetails = navParams.data;
        this.userData$ = this.sharedService.GetUsersData();
    }

    ionViewDidLoad() {
        if (this.accountDetails.type === 'Account') {
            this.leadsService.setCompanyRevenueByMonth(this.accountDetails.leadId, this.userData$.market.stratusMarketId);
        }
    }

    doRefresh(event) {
        if (this.accountDetails.type === 'Account') {
            this.leadsService.setCompanyRevenueByMonth(this.accountDetails.leadId, this.userData$.market.stratusMarketId);
        }
        setTimeout(() => {
            event.complete();    
        }, 2000);
    }

    isActivityClosed(act, $event) {
        if (act.activityState === 'Closed') {
            return 'closedActivity'
        }
        return false
    }

    isMidnight(date) {
        if (moment.utc(date).local().format('HH:mm:ss') !== '00:00:00') {
            return true;
        } else {
            return false;
        }
    }
}