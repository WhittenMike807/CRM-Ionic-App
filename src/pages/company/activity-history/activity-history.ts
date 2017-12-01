import _ from 'lodash';
import { ActivitiesService } from './../../../providers/activities-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { extendMoment } from 'moment-range';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { LeadsService } from './../../../providers/leads-service';
import Moment from 'moment';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-activity-history',
    templateUrl: 'activity-history.html',
    encapsulation: ViewEncapsulation.None
})

export class ActivityHistory {
    accountDetails: any;
    activityHistory: any;
    pendingActivities: any;

    activeSegment: string = 'pending';
    formSettings: any = {
        
    };

    constructor(navParams: NavParams, private leadsService: LeadsService, private activitiesService: ActivitiesService, private toastCtrl: ToastController, private modalCtrl: ModalController) {
        this.accountDetails = navParams.data;
    }

    ionViewDidLoad() {
        console.log('leadId', this.accountDetails);
        this.leadsService.setLeadActivities(this.accountDetails.leadId);
    }

    doRefresh(event) {
        this.leadsService.setLeadActivities(this.accountDetails.leadId);
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

    segment(segment) {
        this.activeSegment = segment;
    }

    openActivity(activity) {
        activity.activityState = 'Open';
        this.activitiesService.openUserActivity(activity).then(res => {
            console.log(res);
        })
    }

    deleteActivity(item: ItemSliding, activity: any) {
        this.expandAction(item, 'deleting', 'Activity was deleted.', activity);
    }

    closeActivitySliding(item: ItemSliding, activity: any) {
        item.close();
        this.closeActivity(activity);
    }

    

    expandAction(item: ItemSliding, action: string, text: string, activity: any) {
        item.setElementClass(action, true);

        this.activitiesService.deleteActivity(activity).subscribe(res => {
            this.leadsService.setLeadActivities(this.accountDetails.leadId);
            setTimeout(() => {
                const toast = this.toastCtrl.create({
                    message: text
                });

                toast.present();
                item.setElementClass(action, false);
                item.close();

                setTimeout(() => toast.dismiss(), 2000);
            }, 1500);
        })
    }

    closeActivity(activity) {
        let closeActivityModal = this.modalCtrl.create('CloseActivity', activity);

        closeActivityModal.onDidDismiss(data => {
            if (data.userCanceled)
                return;

            this.leadsService.setLeadActivities(this.accountDetails.leadId);
        });

        closeActivityModal.present();
    }

    editActivity(slide, act) {
        // let modal = this.modalCtrl.create('EditActivity', {activity: act});
        let modal = this.modalCtrl.create('Activity', { editActivity: act, thisLead: this.accountDetails });
        modal.onDidDismiss(data => {
            slide.close();

            if (data.userCanceled)
                return;

            this.leadsService.setLeadActivities(this.accountDetails.leadId);
        });
        modal.present();
    }
}