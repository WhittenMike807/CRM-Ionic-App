import { ActivitiesService } from './../../../providers/activities-service';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Loading, LoadingController } from 'ionic-angular';
import { Restangular } from 'ngx-restangular';
import { SharedService } from './../../../providers/shared-service';
import * as _ from 'lodash';  
import * as moment from 'moment';

@IonicPage()
@Component({
    selector: 'page-activity',
    templateUrl: 'activity.html'
})

export class Activity {

    @ViewChild('myVariable') 

    activity: any;
    activityForm: FormGroup;
    durationTest:number = 60;
    items: any[] = [];
    loading: Loading;
    maxAddActivityDate = moment().startOf('month').add(1, 'year').format('YYYY-MM-DD');
    maxDateAllowed: string;
    meetingType = 'Meeting';
    minAddActivityDate = moment().startOf('month').subtract(3, 'months').format('YYYY-MM-DD');
    minDateAllowed: string;
    mode: string = '';
    myRef: any;
    segmented1 = 'Meeting';
    selectedCompany: any = {};
    selectOptions = {title: 'Select Contact'};
    submitAttempt: boolean = false;
    thisLead: any;
    userCompanies: any[] = [];
    userData$: any;
    userSelectsTime: boolean = false;
    companyDisabled: boolean = false;

    selectStartDateSettings: any = {
        display: 'bottom',
        headerText: 'Select Date',
        months: 1,
        outerMonthChange: true,
        setOnDayTap: true,
        theme: 'ios',
        weekCounter: 'year',
        yearChange: false,
        buttons: [
            { 
                text: 'Select',
                handler: 'set'
            },
            { 
                text: 'Cancel',
                handler: 'cancel'
            }
        ]
    };

    selectStartTimeSettings: any = {
        controls: ['time'],
        display: 'bottom',
        months: 'auto',
        theme: 'ios',
        yearChange: false,
        steps: { 
            minute: 15
        },
        buttons: [
            { 
                text: 'Select',
                handler: 'set'
            },
            { 
                text: 'Cancel',
                handler: 'cancel'
            }
        ]
    };
    
    settingsTest: any = {
        onBeforeShow: function(event, inst) {
            console.log(inst);
        }
    }
    
    constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular, private formBuilder: FormBuilder, private activityService: ActivitiesService, private loadingCtrl: LoadingController, private sharedService:SharedService, private modalCtrl: ModalController) {
    
    }

    ionViewWillLoad() {
        let startDateInit;
        let leadIDInit = 0;

        if (moment(this.navParams.get('selectedDate')).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            startDateInit = new Date();
        } else {
            startDateInit = new Date(this.navParams.get('selectedDate'));
        }

        if (this.navParams.data && this.navParams.data.companyData) {
            leadIDInit = this.navParams.data.companyData.leadId;
            this.selectedCompany = this.navParams.data.companyData;
        }

        if (this.navParams.get('editActivity') == null) {
            this.mode = 'new';
            this.newActivity(startDateInit, leadIDInit);
        } else {
            this.mode = 'edit';
            this.editActivity();
        }
    }

    ionViewDidLoad() {
        this.userData$ = this.sharedService.GetUsersData();
        this.activityForm.controls['userId'].setValue(this.userData$.id);
        this.activityForm.controls['marketId'].setValue(this.userData$.market.stratusMarketId);
        this.activityForm.controls['companyName'].disable();
    }

    newActivity(startDateInit, leadIDInit) {        
        let companyName = '';

        if (this.selectedCompany !== null && this.selectedCompany !== undefined) {
            companyName = this.selectedCompany.companyName;
        }

        this.activityForm = this.formBuilder.group({
            activityDescription: [null, Validators.compose([Validators.maxLength(2000)])],
            activityStartTime: null,
            activityStateId: 1,
            activityStatusId: 24,
            activityType: 'Meeting',
            activityTypeId: 2,
            companyName: [{value: companyName, disabled: true}, Validators.required],
            contactId: 0, 
            duration: 60,
            leadId: leadIDInit,
            location: null,
            marketId: null,
            pushToExchange: false,
            startDate: [startDateInit, Validators.required],
            subject: [null, Validators.required],
            userId: null
        });
    }

    editActivity() {
        let activityInfo;
        let companyName = '';

        // Company is not allowed to be changed when activity is edited
        this.companyDisabled = true;

        if (this.navParams.get('thisLead') !== null && this.navParams.get('thisLead') !== undefined) {
            // This is being edited from the CompanyDetails page
            activityInfo = this.navParams.get('editActivity');
            companyName = this.navParams.get('thisLead').companyName;
        } else {
            // This is being edited from the Activity list view
            activityInfo = this.navParams.get('editActivity').activity;

            if (this.navParams.get('editActivity').companyDetail !== null && this.navParams.get('editActivity').companyDetail !== undefined) {
                companyName = this.navParams.get('editActivity').companyDetail.companyName;
            }
        }

        this.activityForm = this.formBuilder.group({
            activityDescription: [activityInfo.activityDescription, Validators.compose([Validators.maxLength(2000)])],
            activityStartTime: moment.utc(activityInfo.startDate).local().toDate(),
            activityStateId: activityInfo.activityStateId,
            activityStatusId: activityInfo.activityStatusId,
            activityType: activityInfo.activityType,
            activityTypeId: activityInfo.activityTypeId,
            companyName: [{value: companyName, disabled: true}],
            contactId: activityInfo.contactId, 
            duration: activityInfo.duration,
            id: activityInfo.id,
            leadId: activityInfo.leadId,
            location: activityInfo.location,
            marketId: activityInfo.marketId,
            pushToExchange: activityInfo.pushToExchange,
            startDate: moment.utc(activityInfo.startDate).local().toDate(),
            subject: [activityInfo.subject, Validators.required],
            userId: activityInfo.userId
        });
    }
    
    showTime() {
        this.userSelectsTime = !this.userSelectsTime;
        this.activityForm.controls['activityStartTime'].setValue(this.getRoundedTime());
    }

    showSaving() {
        this.loading = this.loadingCtrl.create({
            content: 'Saving please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    }

    getRoundedTime() {
        const roundedUp = Math.ceil(moment().minute() / 15) * 15;
        return moment().minute(roundedUp).second(0).format('HH:mm');
    }

    switchMeetingType(meetingType) {
        switch(meetingType) { 
            case 'Meeting': { 
                this.activityForm.controls['activityType'].setValue('Meeting');
                this.activityForm.controls['activityTypeId'].setValue(2);
                this.activityForm.controls['activityStatusId'].setValue(24);
                if (this.mode === 'new') {
                    this.activityForm.controls['duration'].setValue(60);
                }
                break; 
            } 
            case 'Call': { 
                this.activityForm.controls['activityType'].setValue('Call');
                this.activityForm.controls['activityTypeId'].setValue(1);
                this.activityForm.controls['activityStatusId'].setValue(1);
                if (this.mode === 'new') {
                    this.activityForm.controls['duration'].setValue(5);
                }
                break; 
            }
            case 'Todo': { 
                this.activityForm.controls['activityType'].setValue('Todo');
                this.activityForm.controls['activityTypeId'].setValue(7);
                this.activityForm.controls['activityStatusId'].setValue(25);
                if (this.mode === 'new') {
                    this.activityForm.controls['duration'].setValue(15);
                }
                break; 
            } 
            default: { 
                this.activityForm.controls['activityType'].setValue('Meeting');
                this.activityForm.controls['activityTypeId'].setValue(2);
                this.activityForm.controls['activityStatusId'].setValue(24);
                if (this.mode === 'new') {
                    this.activityForm.controls['duration'].setValue(60);
                }
                break; 
            } 
        } 
    }

    selectCompany() {
        let selectCompanyModal = this.modalCtrl.create('SelectCompany');

        selectCompanyModal.onDidDismiss(data => {
            this.selectedCompany = data;

            if (data) {

                this.activityForm.controls['companyName'].setValue(this.selectedCompany.companyName);

                if (data.contacts) {
                    _.each(data.contacts, (c) => {
                        this.items.push({
                            text: c['firstName'] + ' ' + c['lastName'],
                            value: c['contactId']
                        });
                    });
                }

                if (data.companyType !== 'Suspect') {
                    this.activityForm.controls['leadId'].setValue(data.companyId);
                }
            }
        });

        selectCompanyModal.present();
    }
    
    cancel() {        
        let data = { userCanceled: true };
        this.view.dismiss(data);
    }
    
    save() {

        if (this.mode === 'new') {
            // Creating a new Activity
            if (this.activityForm.controls['activityStartTime'].value != null) {
                let newActivityTime = moment(this.activityForm.controls['startDate'].value).format('YYYY-MM-DD') + 'T' + moment(this.activityForm.controls['activityStartTime'].value).format('HH:mm');
                this.activityForm.controls['startDate'].setValue(moment(newActivityTime).toDate());
            }


            delete this.activityForm.value.activityStartTime;

            this.showSaving();

            if (_.isEmpty(this.selectedCompany) || this.selectedCompany.companyType === 'Suspect') {
                this.activityService.addTaskActivity(this.activityForm.value).subscribe(result => {
                    if (this.selectedCompany.companyType === 'Suspect') {
                        this.activityService.addSuspectActivity(this.selectedCompany.companyId, result.id).subscribe(res => {
                            let data = { userCanceled: false, activityData: result };
                            this.loading.dismiss();
                            this.view.dismiss(data);        
                        });
                    } else {
                        let data = { userCanceled: false, activityData: result };
                        this.loading.dismiss();
                        this.view.dismiss(data);
                    }
                })
            } else {
                this.activityService.addMeetingActivity(this.activityForm.value).subscribe(result => {
                    let data = { userCanceled: false, activityData: result };
                    this.loading.dismiss();
                    this.view.dismiss(data);
                });
            }   
        } else {
            // Editing an existing Activity
            if (this.activityForm.controls['activityStartTime'].value != null) {
                let newActivityTime = moment(this.activityForm.controls['startDate'].value).format('YYYY-MM-DD') + 'T' + moment(this.activityForm.controls['activityStartTime'].value).format('HH:mm');
                this.activityForm.controls['startDate'].setValue(moment(newActivityTime).toDate());
            }
            
            this.activityService.updateActivity(this.activityForm.value).subscribe(res => {
                this.view.dismiss(res);    
            });
        }

        
    }
}