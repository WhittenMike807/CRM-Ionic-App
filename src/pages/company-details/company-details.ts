import _ from 'lodash';
import { ActivitiesService } from './../../providers/activities-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { extendMoment } from 'moment-range';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { LeadsService } from './../../providers/leads-service';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import Moment from 'moment';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-company-details',
    templateUrl: 'company-details.html',
    encapsulation: ViewEncapsulation.None
})

export class CompanyDetails {

    rootPage: any;

    @ViewChild('content') content: NavController;

    accountDetails: any;
    activityHistory: any = [];
    contacts: any = [];
    leadNotes: any = [];
    // map: GoogleMap;
    openAsks: any = [];
    pendingActivities: any = [];
    selectedDay: any = moment().startOf('day');
    showActivityHistory: boolean = false;
    showContacts: boolean = true;
    showMap: boolean = true;
    showNotes: boolean = false;
    showOpenAsks: boolean = false;
    showPendingActivity: boolean = false;
    showPlan: boolean = false;
    spendingCY: number = 0;
    spendingData: any = [];
    spendingLY: number = 0;

    constructor(private navCtrl: NavController, private navParams: NavParams, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private googleMaps: GoogleMaps, private activitiesService: ActivitiesService, private leadsService: LeadsService, private modalCtrl: ModalController, private nativeGeocoder: NativeGeocoder, private alertCtrl: AlertController) {
        this.accountDetails = navParams.get('item');
    }

    ionViewCanEnter(){
        if(this.accountDetails === undefined){
            return false;
        }
    }

    // Load map only after view is initialized and load all of the data for the selected Lead
    ionViewDidLoad() {

        // Get Lead Details and Contacts and sort so that the Decision Maker is on top
        this.leadsService.getLead(this.accountDetails.id).subscribe(res => {
            // Have to reset the accountDetails because of the SearchMarketCompany view and the information it is lacking
            this.accountDetails = res;
            this.loadMap();

            this.contacts = res.leadContacts;
            this.contacts = _.orderBy(this.contacts, 'isDecisionMaker', 'desc');
        });

        // Get Lead Notes
        this.leadsService.getLeadNotes(this.accountDetails.id).getList().subscribe(res => {
            this.leadNotes = res;
        });

        // Get Lead Activities and sort with the most recently closed on top
        this.leadsService.getLeadActivities(this.accountDetails.id).getList().subscribe(res => {
            this.activityHistory = _.filter(res, { isClosed: true });
            this.activityHistory = _.orderBy(this.activityHistory, 'closeDate', 'desc');

            this.pendingActivities = _.filter(res, { isClosed: false });
        });

        // Get Open Asks
        this.leadsService.getCompanyAskHistory(this.accountDetails.id).getList().subscribe(res => {
            this.openAsks = _.filter(res, { isAskOpen: true });
        });

        // Get Account Revenue if type = Account
        if (this.accountDetails.companyType === 'Account') {
            this.leadsService.getAccountSpending(this.accountDetails.id).subscribe(res => {
                if (res.cySpending !== undefined) {
                    this.spendingCY = res.cySpending;
                    this.spendingLY = res.pySpending;
                } else {
                    this.spendingCY = 0;
                    this.spendingLY = 0;
                }
            })
        }

        // Get PLAN data if type = Account
        if (this.accountDetails.companyType === 'Account') {
            this.leadsService.getCompanyRevenueByMonth(this.accountDetails.id, this.accountDetails.id.marketId).subscribe(res => {
                if (res.length > 0) {
                    this.spendingData = res[0];
                } else {
                    this.spendingData = {
                        month1: "0", month2: "0", month3: "0", month4: "0", month5: "0", month6: "0", month7: "0", month8: "0", month9: "0", month10: "0", month11: "0", month12: "0",
                        priorMonth1: "0", priorMonth2: "0", priorMonth3: "0", priorMonth4: "0", priorMonth5: "0", priorMonth6: "0", priorMonth7: "0", priorMonth8: "0", priorMonth9: "0", priorMonth10: "0", priorMonth11: "0", priorMonth12: "0"
                    };
                }
            })
        }
    }

    // Opens up the menu at the bottom to create new items
    openMenu() {
        let actionSheet = this.actionSheetCtrl.create({
            title: 'Actions',
            buttons: [
                {
                    text: 'Add Activity',
                    handler: () => {
                        // let modal = this.modalCtrl.create('AddActivity', {selectedDay: this.selectedDay, companyData: this.accountDetails});
                        let modal = this.modalCtrl.create('Activity', { selectedDay: this.selectedDay, companyData: this.accountDetails });
                        this.showMap = false;

                        modal.onDidDismiss(data => {
                            this.showMap = true;
                            this.pendingActivities = [];
                            this.leadsService.getLeadActivities(this.accountDetails.id).getList().subscribe(res => {
                                this.pendingActivities = _.filter(res, { isClosed: false });
                            });
                        });

                        modal.present();
                    }
                }, {
                    text: 'Add Contact',
                    handler: () => {
                        this.showMap = false;
                        let modal = this.modalCtrl.create('Contact', { leadId: this.accountDetails.id });
                        modal.onDidDismiss(data => {
                            this.showMap = true;

                            // Get updated Contact list
                            this.leadsService.getLead(this.accountDetails.id).subscribe(res => {
                                this.contacts = res.leadContacts;
                                this.contacts = _.orderBy(this.contacts, 'isDecisionMaker', 'desc');
                            });
                        });
                        modal.present();
                    }
                }, {
                    text: 'Add Note',
                    handler: () => {
                        this.showMap = false;
                        let modal = this.modalCtrl.create('AddNote', { leadId: this.accountDetails.id });
                        modal.onDidDismiss(data => {
                            this.showMap = true;
                        });
                        modal.present();
                    }
                }, {
                    text: 'Add Ask',
                    handler: () => {
                        if (this.accountDetails.companyType === 'Account' || this.accountDetails.companyType === 'Lead') {

                            let modal = this.modalCtrl.create('AddAsk', { companyData: this.accountDetails });
                            this.openAsks = [];
                            this.showMap = false;
                            modal.onDidDismiss(data => {
                                this.showMap = true;
                                this.leadsService.getCompanyAskHistory(this.accountDetails.id).getList().subscribe(res => {
                                    this.openAsks = _.filter(res, { isAskOpen: true });
                                });
                            });

                            modal.present();
                        } else {
                            // Don't let the user create an Ask for type Agency
                            console.log('Asks not allowed for Agencies');
                            return;
                        }
                    }
                }, {
                    text: 'Cancel',
                    role: 'cancel',
                    handler: () => {
                        console.log('Cancel clicked');
                    }
                }
            ]
        });

        actionSheet.present();
    }

    loadMap() {

        let element: HTMLElement = document.getElementById('map');
        let map: GoogleMap = this.googleMaps.create(element);
        let streetAddress: string = this.accountDetails.address1 + ', ' + this.accountDetails.city + ', ' + this.accountDetails.state + ' ' + this.accountDetails.zipCode;

        console.log(streetAddress);

        this.nativeGeocoder.forwardGeocode(streetAddress)
            .then((coordinates: NativeGeocoderForwardResult) => {

                let location: LatLng = new LatLng(parseFloat(coordinates.latitude), parseFloat(coordinates.longitude));
                // console.log('latitude=' + coordinates.latitude + ', longitude=' + coordinates.longitude);

                // Until the MAP_READY event is complete DO NOT try to do anything to the map
                map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
                    // console.log('Map is ready!');

                    let position: CameraPosition = {
                       target: location,
                       zoom: 16
                   };
   
                   // move the map's camera to position
                   map.moveCamera(position);
   
                   // create new marker
                   let markerOptions: MarkerOptions = {
                       position: location
                   };
   
                   map.addMarker(markerOptions)
                       .then((marker: Marker) => {
                           marker.showInfoWindow();
                       });

               });
            })
            .catch((error: any) => {
                console.log(error);
            });
    }

    // Expand or collapse each of the sections of the Company Details page
    toggleSection(toggle) {
        switch (toggle) {
            case 'showContacts': {
                this.showContacts = !this.showContacts;
                break;
            }
            case 'showNotes': {
                this.showNotes = !this.showNotes;
                break;
            }
            case 'showPendingActivity': {
                this.showPendingActivity = !this.showPendingActivity;
                break;
            }
            case 'showActivityHistory': {
                this.showActivityHistory = !this.showActivityHistory;
                break;
            }
            case 'showOpenAsks': {
                this.showOpenAsks = !this.showOpenAsks;
                break;
            }
            case 'showPlan': {
                this.showPlan = !this.showPlan;
                break;
            }
        }
    }

    // Must hide map for modals due to issue with interaction with map behind the modal
    // Once the modal is dismissed show the map again
    editCompany() {
        this.showMap = false;
        let modal = this.modalCtrl.create('Lead', { editLead: this.accountDetails });
        modal.onDidDismiss(data => {
            this.showMap = true;
        });
        modal.present();
    }

    editContact(contact) {
        this.showMap = false;

        // let modal = this.modalCtrl.create('EditContact', contact);
        let modal = this.modalCtrl.create('Contact', { editContact: contact });
        modal.onDidDismiss(data => {
            this.showMap = true;
        });
        modal.present();
    }

    editNote(note) {
        this.showMap = false;

        let modal = this.modalCtrl.create('EditNote', note);
        modal.onDidDismiss(data => {
            this.showMap = true;
        });
        modal.present();
    }

    editActivity(slide, act) {
        this.showMap = false;

        // let modal = this.modalCtrl.create('EditActivity', {activity: act});
        let modal = this.modalCtrl.create('Activity', { editActivity: act, thisLead: this.accountDetails });
        modal.onDidDismiss(data => {

            // Resetting Pending Activities
            this.pendingActivities = [];
            this.leadsService.getLeadActivities(this.accountDetails.id).getList().subscribe(res => {
                this.pendingActivities = _.filter(res, { isClosed: false });
            });

            slide.close();
            this.showMap = true;
        });
        modal.present();
    }

    deleteLead() {
        let alert = this.alertCtrl.create({
            title: 'Delete ' + this.accountDetails.companyType + '?',
            message: 'You will not be able to recover this ' + this.accountDetails.companyType,
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
                        this.leadsService.deleteLead(this.accountDetails).subscribe(result => {
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
                            this.navCtrl.pop();
                        });
                    }
                }
            ]
        });

        alert.present();
    }

    requestAccount() {

        if (this.accountDetails.address1 && this.accountDetails.city && this.accountDetails.state &&
            this.accountDetails.zipCode && this.accountDetails.billingCycle && this.accountDetails.billingCycle !== '0' &&
            this.accountDetails.revenueTypeId && this.accountDetails.revenueTypeId !== '0' && this.accountDetails.monthType &&
            this.accountDetails.leadContacts.length) {

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
                            this.leadsService.requestAccount(this.accountDetails).subscribe(result => {
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
                buttons: ['OK']
            });

            alert.present();
        }
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
                            this.navCtrl.pop();
                        });
                    }
                }
            ]
        });

        alert.present();
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

    closeActivity(activity) {
        let closeActivityModal = this.modalCtrl.create('CloseActivity', activity);

        closeActivityModal.onDidDismiss(data => {
            if (data.userCanceled) {
                activity.activityState = 'Open';
            } else {
                activity.activityState = 'Closed';
            }
        });

        closeActivityModal.present();
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
}
