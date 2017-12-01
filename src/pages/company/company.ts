import _ from 'lodash';
import { ActivitiesService } from './../../providers/activities-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { extendMoment } from 'moment-range';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController, ItemSliding, ToastController, Tabs } from 'ionic-angular';
import { LeadsService } from './../../providers/leads-service';
import { ContactsService } from './../../providers/contacts-service';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import Moment from 'moment';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-company',
    templateUrl: 'company.html',
    encapsulation: ViewEncapsulation.None
})

export class Company {
    @ViewChild('myTabs') tabRef: Tabs;

    accountDetails: any;

    menustripSettings: any = {
        theme: 'ios',
        display: 'top',
        type: 'tabs',
        onItemTap: function (event, inst) {
            document.querySelector('.md-tabs-sel').classList.remove('md-tabs-sel');
            document.querySelector('.' + event.target.getAttribute('data-tab')).classList.add('md-tabs-sel');
        }
    }

    companyProfile: string = 'CompanyProfile';
    companyContacts: string = 'CompanyContacts';
    revenue: string = 'Revenue';
    notes: string = 'Notes';
    activityHistory: string = 'ActivityHistory';
    asks: string = 'Asks'
    plan: string =  'Plan'
    
    constructor(private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private googleMaps: GoogleMaps, private activitiesService: ActivitiesService, private leadsService: LeadsService, private contactsService: ContactsService, private modalCtrl: ModalController, private nativeGeocoder: NativeGeocoder, private alertCtrl: AlertController) {
        this.accountDetails = navParams.get('item');

        console.log('accountDetails', this.accountDetails);
    }

    openMenu() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Actions'
        });

        actionSheet.addButton({
            text: 'Add Activity',
            icon: 'archive',
            handler: () => {
                let modal = this.modalCtrl.create('Activity', { selectedDay: moment().startOf('day'), companyData: this.accountDetails });

                modal.onDidDismiss(data => {
                    if (data.userCanceled)
                        return;
                    
                    this.leadsService.setLeadActivities(this.accountDetails.leadId);
                });

                modal.present();
            }
        });

        actionSheet.addButton({
            text: 'Add Contact',
            icon: 'contacts',
            handler: () => {
                let modal = this.modalCtrl.create('Contact', { leadId: this.accountDetails.leadId });
                modal.onDidDismiss(data => {
                    if (data.userCanceled)
                        return;

                    this.leadsService.setLead(this.accountDetails.leadId);
                });
                modal.present();
            }
        });

        actionSheet.addButton({
            text: 'Add Note',
            icon: 'mail',
            handler: () => {
                let modal = this.modalCtrl.create('AddNote', { leadId: this.accountDetails.leadId });
                modal.onDidDismiss(data => {
                    if (data.userCanceled)
                        return;

                    this.leadsService.setLeadNotes(this.accountDetails.leadId);
                });
                modal.present();
            }
        });


        if (this.accountDetails.type === 'Account' || this.accountDetails.type === 'Lead')  {
            actionSheet.addButton({
                text: 'Add Ask',
                icon: 'pricetag',
                handler: () => {
                    let modal = this.modalCtrl.create('AddAsk', { companyData: this.accountDetails });

                    modal.onDidDismiss(data => {
                        if (data.userCanceled)
                            return;
                        
                        this.leadsService.setCompanyAskHistory(this.accountDetails.leadId)
                    });

                    modal.present();
                }
            });
        }

        if (!this.accountDetails.isAccount && !this.accountDetails.accountRequested) {
            actionSheet.addButton({
                text: 'Request Account',
                icon: 'person',
                handler: () => {
                    actionSheet.onDidDismiss(() => {
                        this.requestAccount();
                    });
                }
            });
        }

        if (!this.accountDetails.isAccount && this.accountDetails.accountRequested) {
            actionSheet.addButton({
                text: 'Cancel Request',
                icon: 'person',
                handler: () => {
                    actionSheet.onDidDismiss(() => {
                        this.cancelRequest();
                    });
                }
            });
        }

        if (this.accountDetails.type == 'Account') {
            actionSheet.addButton({
                text: 'Convert to Lead',
                icon: 'person',
                handler: () => {
                    actionSheet.onDidDismiss(() => {
                        this.convertToLead();
                    });
                }
            });
        }

        if (this.accountDetails.type != 'Account') {
            actionSheet.addButton({
                text: 'Delete Lead',
                icon: 'person',
                handler: () => {
                    actionSheet.onDidDismiss(() => {
                        this.deleteLead();
                    });   
                }
            });
        }

        actionSheet.addButton({
            text: 'Cancel',
            icon: 'close',
            handler: () => {
                console.log('Cancel clicked');
            }
        });

        actionSheet.present();
    }

    deleteLead() {
        let alert = this.alertCtrl.create({
            title: 'Delete ' + this.accountDetails.type + '?',
            message: 'You will not be able to recover this ' + this.accountDetails.type,
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }, {
                    text: 'Yes',
                    handler: () => {
                        this.leadsService.deleteLead(this.accountDetails.leadId).subscribe(result => {
                            this.contactsService.setAllCompaniesAndContacts();
                            this.navCtrl.pop();
                        });
                    }
                }
            ]
        });

        alert.present();
    }

    convertToLead() {
        let alert = this.alertCtrl.create({
            title: 'Convert to Lead?',
            message: 'You will not be able to undo this change.',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.leadsService.convertToLead(this.accountDetails).subscribe(result => {
                            this.contactsService.setAllCompaniesAndContacts();
                            this.navCtrl.pop();
                        });
                    }
                }
            ]
        });

        alert.present();
    }

    requestAccount() {

        this.leadsService.getLead(this.accountDetails.leadId).subscribe(res => {
            if (res.address1 && res.city && res.state &&
                res.zipCode && res.billingCycle && res.billingCycle !== '0' &&
                res.revenueTypeId && res.revenueTypeId !== '0' && res.monthType &&
                res.leadContacts.length) {
    
                let alert = this.alertCtrl.create({
                    title: 'Request Account?',
                    message: 'Are you sure you want to request converting this Lead to an Account?',
                    buttons: [
                        {
                            text: 'No',
                            role: 'cancel',
                            handler: () => {
                                console.log('Cancel clicked');
                            }
                        },
                        {
                            text: 'Yes',
                            handler: () => {
                                // All required fields are entered
                                this.leadsService.requestAccount(res).subscribe(result => {
                                    this.contactsService.setAllCompaniesAndContacts();
                                    this.navCtrl.pop();
                                });
                            }
                        }
                    ]
                });
    
                alert.present();
    
            } else {
                let alert = this.alertCtrl.create({
                    title: 'Missing Information',
                    subTitle: 'Edit company and complete missing information. Ensure a contact has been created as well.',
                    buttons: [{
                        text: 'OK',
                        handler: () => {
                            alert.dismiss().then(() => {
                              console.log('dismiss 1');
                            });
                            console.log('dismiss 2');
                            return false;
                          }
                    }],
                });
    
                alert.present();
            }
        })
        
    }

    cancelRequest() {
        let alert = this.alertCtrl.create({
            title: 'Cancel Account Request?',
            message: 'Are you sure you want to cancel this Lead to Account request?',
            buttons: [
                {
                    text: 'No',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.leadsService.cancelAccountRequest(this.accountDetails).subscribe(result => {
                            this.contactsService.setAllCompaniesAndContacts();
                            this.navCtrl.pop();
                        });
                    }
                }
            ]
        });

        alert.present();
    }
}
