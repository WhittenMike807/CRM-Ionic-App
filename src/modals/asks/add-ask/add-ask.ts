import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Restangular } from 'ngx-restangular';
import { SharedService } from './../../../providers/shared-service';
import { LeadsService } from './../../../providers/leads-service';
import { AskService } from './../../../providers/ask-service';
import * as moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

// const moment = extendMoment(Moment);
@IonicPage()
@Component({
    selector: 'page-add-ask',
    templateUrl: 'add-ask.html',
})

export class AddAsk {
    addAskForm: FormGroup;
    userData$: any;
    debug: any;

    formSettings: any = {
        
    };

    stationSettings: any = {
        // display: 'center',
        label: 'Name',
        // group: true,
        // groupLabel: '&nbsp;',
        select: 'multiple',
        placeholder: 'Required'
    };

    numpadSettings: any = {
        display: 'bottom',
        min: 1,
        max: 999999,
        scale: 0,
        prefix: '$',
        preset: 'decimal'
    };

    monthsSettings: any = {
        preset: 'decimal',
        min: 1,
        max: 24,
        scale: 0
    }

    closeDateSettings: any = {
        weekCounter: 'year',
        headerText: 'Select Date',
        display: 'bottom',
        outerMonthChange: true,
        setOnDayTap: true,
        buttons: [
            {
                text: 'Select',
                handler: 'set',
            },
            {
                text: 'Cancel',
                handler: 'cancel',
            }
        ],
        yearChange: false,
        months: 1,
    };

    constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular, private formBuilder: FormBuilder, private sharedService: SharedService, private leadsService: LeadsService, private askService: AskService, private modalCtrl: ModalController) {

    }

    ionViewWillLoad() {
        this.userData$ = this.sharedService.GetUsersData();
        this.debug = this.userData$;
        console.log(this.navParams.data);

        this.addAskForm = this.formBuilder.group({
            id: 0,
            company: [{}, Validators.required],
            stations: [[], Validators.required],
            closeDate: [moment().add(1, 'day').toDate(), Validators.required],
            amount: [0, Validators.min(1)],
            months: [1, Validators.min(1)],
            probability: ['10', Validators.required],
            title: [null, Validators.maxLength(120)],
            notes: [null, Validators.maxLength(2000)],
        });

        if (this.navParams.data && this.navParams.data.companyData) {
            this.addAskForm.controls['company'].setValue(this.navParams.data.companyData)
        }

        this.addAskForm.valueChanges.subscribe(data => this.onValueChanged(data));
    }

    onValueChanged(data?: any) {

    }

    selectCompany() {
        let selectCompanyModal = this.modalCtrl.create('SelectCompany');

        selectCompanyModal.onDidDismiss(data => {
            if (data)
                this.addAskForm.controls['company'].setValue(data);
        });

        selectCompanyModal.present();
    }

    addCancel() {
        let data = { userCanceled: true };
        this.view.dismiss(data);
    }

    

    decreaseProbability() {
        let current = this.addAskForm.controls['probability'].value;
        switch (current) {
            case 'Won':
                current = '90';
                break;
            case '90':
                current = '60';
                break;
            case '60':
                current = '40';
                break;
            case '40':
                current = '10';
                break;
            case '10':
                current = 'Lost';
                break;
        }

        this.addAskForm.controls['probability'].setValue(current);
    }

    increaseProbability() {
        let current = this.addAskForm.controls['probability'].value;
        switch (current) {
            case 'Lost':
                current = '10';
                break;
            case '10':
                current = '40';
                break;
            case '40':
                current = '60';
                break;
            case '60':
                current = '90';
                break;
            case '90':
                current = 'Won';
                break;
        }

        this.addAskForm.controls['probability'].setValue(current);
        
    }

    getStationById(stationId: number) {
        let match = this.sharedService.GetMarketStations().filter((a: any) => a.stationId == stationId);
        return match;
    }

    addDetails = function () {
        let ask: any = {};
        ask.id = this.addAskForm.controls['id'].value;
        ask.amount = this.addAskForm.controls['amount'].value;
        ask.months = this.addAskForm.controls['months'].value;
        ask.probability = this.addAskForm.controls['probability'].value as number;
        ask.company = this.addAskForm.controls['company'].value;
        ask.closeDate = moment(this.addAskForm.controls['closeDate'].value).startOf('day').toDate();
        ask.stations = [];
        this.addAskForm.controls['stations'].value.forEach(s => {
            ask.stations.push(this.getStationById(s))
        });
        ask.title = this.addAskForm.controls['title'].value;
        ask.notes = this.addAskForm.controls['notes'].value;
        ask.userId = this.userData$.id;
        ask.marketId = this.userData$.market.stratusMarketId;

        //console.log('ask', ask);
        this.navCtrl.push('AskDetails', { addAsk: ask });

        // this.askDetailRows = [];
        // for(let station of this.addAskForm.controls['selectedStations'].value) {
        //     this.askDetailRows.push(this.buildAskDetailModel(station.id, false));
        // }

        // this.debug = [];
        // var askPromises = [];

        // for(let ask of this.askDetailRows) {
        //     //this.updateAskDetailsAmounts(ask);
        //     ask.askAmount = this.addAskForm.controls['askAmount'].value;
        //     ask.askId = this.addAskForm.controls['askId'].value;
        //     ask.askMonths = this.addAskForm.controls['askMonths'].value;
        //     ask.selectedAskPercentage = this.addAskForm.controls['selectedAskPercentage'].value as number;
        //     ask.selectedCompany =  this.addAskForm.controls['selectedCompany'].value;
        //     ask.selectedDate = this.addAskForm.controls['selectedDate'].value;
        //     ask.askId = this.addAskForm.controls['askId'].value;
        //     //ask = this.generateAskModel(ask);
        //     this.debug.push(ask);
        //     // if (ask.id === 0) {
        //     //     askPromises.push(this.askService.AddAsk(ask).map(res => res));
        //     // } else {
        //     //     askPromises.push(this.askService.UpdateAsk(ask).map(res => res))
        //     // }
        // }

        // Observable.forkJoin(askPromises).subscribe((data : Array<any>) => {
        //    this.view.dismiss(data);
        // },
        // err => {
        //       console.error(err)
        // });

    };
}