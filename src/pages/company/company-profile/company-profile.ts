import _ from 'lodash';
import { ActivitiesService } from './../../providers/activities-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { extendMoment } from 'moment-range';
import { IonicPage, NavController, NavParams, ActionSheetController, ModalController, AlertController, ItemSliding, ToastController } from 'ionic-angular';
import { LeadsService } from './../../../providers/leads-service';
import { ContactsService } from './../../../providers/contacts-service';
import Moment from 'moment';
import { NativeGeocoder, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, CameraPosition, MarkerOptions, Marker } from '@ionic-native/google-maps';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-company-profile',
    templateUrl: 'company-profile.html',
    encapsulation: ViewEncapsulation.None
})

export class CompanyProfile {
    
    accountDetails: any;
    formSettings: any = {
        
    };

    constructor(navParams: NavParams, private navCtrl: NavController, private leadsService: LeadsService, private contactsService: ContactsService, private modalCtrl: ModalController, private alertCtrl: AlertController, private nativeGeocoder: NativeGeocoder, private googleMaps: GoogleMaps) {
        this.accountDetails = navParams.data;
        

    }

    ionViewDidLoad() {
        this.leadsService.getLead(this.accountDetails.leadId).subscribe(res => {
            this.accountDetails = res;
        });
        this.loadMap();
    }

    doRefresh(event) {
        this.leadsService.getLead(this.accountDetails.id).subscribe(res => {
            this.accountDetails = res;
            event.complete();  
        });
    }


    editCompany() {
        if (this.accountDetails.type != 'Account') {
            let modal = this.modalCtrl.create('Lead', { editLead: this.accountDetails });
            modal.onDidDismiss(data => {
                if (data.userCanceled)
                    return;

                this.leadsService.getLead(this.accountDetails.id).subscribe(res => {
                    this.accountDetails = res;
                    this.contactsService.setAllCompaniesAndContacts();
                });                
            });
            modal.present();
        }
    }

    cancel(event) {
        event.stopPropagation();
    }

    loadMap() {
        
        let element: HTMLElement = document.getElementById('map');
        let map: GoogleMap = this.googleMaps.create(element);
        let streetAddress: string = this.accountDetails.address1 + ', ' + this.accountDetails.city + ', ' + this.accountDetails.state + ' ' + this.accountDetails.zipCode;

        console.log(streetAddress);

        this.nativeGeocoder.forwardGeocode(streetAddress)
            .then((coordinates: NativeGeocoderForwardResult) => {

                let location: LatLng = new LatLng(parseFloat(coordinates.latitude), parseFloat(coordinates.longitude));

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
}