import _ from 'lodash';
import { ActivitiesService } from './../../providers/activities-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { extendMoment } from 'moment-range';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { LeadsService } from './../../../providers/leads-service';
import { AskService } from './../../../providers/ask-service';
import Moment from 'moment';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-asks',
    templateUrl: 'asks.html',
    encapsulation: ViewEncapsulation.None
})

export class Asks {
    accountDetails: any;
    openAsks: any;

    formSettings: any = {
        
    };

    constructor(navParams: NavParams, private leadsService: LeadsService, private askService: AskService, private modalCtrl: ModalController) {
        this.accountDetails = navParams.data;
    }

    doRefresh(event) {
        this.leadsService.setCompanyAskHistory(this.accountDetails.leadId);
        setTimeout(() => {
            event.complete();    
        }, 2000);
    }

    ionViewDidLoad() {
        console.log('asksLoad', this.accountDetails);
        this.leadsService.setCompanyAskHistory(this.accountDetails.leadId);
    }

    editAsk(ask) {
        this.askService.GetAskById(ask.askId).subscribe(askDetails => {
            askDetails.companyName = ask.companyName;
            let editAskModal= this.modalCtrl.create('AskDetails', { editAsk: askDetails});
            editAskModal.onDidDismiss(data => {
                if (data.userCanceled)
                    return;
            });
            editAskModal.present();
        });
    }
}