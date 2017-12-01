import _ from 'lodash';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { LeadsService } from './../../providers/leads-service';
import { Restangular } from 'ngx-restangular';
import { SharedService } from './../../providers/shared-service';

@IonicPage()
@Component({
    selector: 'page-lead',
    templateUrl: 'lead.html',
})

export class Lead {
    formSettings: any = {

    };

    categorySettings: any = {
        placeholder: 'Month Type',
    };
    companySettings: any = {
        placeholder: 'Select Category',
        filter: true
    };
    billingSettings: any = {
        placeholder: 'Billing'
    };
    revenueSettings: any = {
        placeholder: 'Revenue'
    };

    addLeadForm: FormGroup;

    billingCycleList: any = [
        { value: 'F', description: 'End of Flight' },
        { value: 'M', description: 'Monthly' },
        { value: 'W', description: 'Weekly' }
    ];
    companyTypeList: any = [];

    monthTypeList: any = [
        { value: 'B', description: 'Broadcast' },
        { value: 'C', description: 'Calendar' }
    ];

    revenueTypeIdList: any = [];
    userData$: any;

    mode = 'add';

    localSettings = {
        filter: true,
        dataText: 'name',
        dataValue: 'abbreviation',
        placeholder: 'Select State',
        buttons: [
            {
                text: 'Select State',
                handler: 'set',
            },
            'cancel'
        ]
    };

    statesArray = [
        { "name": "Alabama", "abbreviation": "AL" }, { "name": "Alaska", "abbreviation": "AK" }, { "name": "Arizona", "abbreviation": "AZ" },
        { "name": "Arkansas", "abbreviation": "AR" }, { "name": "California", "abbreviation": "CA" }, { "name": "Colorado", "abbreviation": "CO" },
        { "name": "Connecticut", "abbreviation": "CT" }, { "name": "Delaware", "abbreviation": "DE" }, { "name": "District Of Columbia", "abbreviation": "DC" },
        { "name": "Florida", "abbreviation": "FL" }, { "name": "Georgia", "abbreviation": "GA" }, { "name": "Hawaii", "abbreviation": "HI" },
        { "name": "Idaho", "abbreviation": "ID" }, { "name": "Illinois", "abbreviation": "IL" }, { "name": "Indiana", "abbreviation": "IN" },
        { "name": "Iowa", "abbreviation": "IA" }, { "name": "Kansas", "abbreviation": "KS" }, { "name": "Kentucky", "abbreviation": "KY" },
        { "name": "Louisiana", "abbreviation": "LA" }, { "name": "Maine", "abbreviation": "ME" }, { "name": "Maryland", "abbreviation": "MD" },
        { "name": "Massachusetts", "abbreviation": "MA" }, { "name": "Michigan", "abbreviation": "MI" }, { "name": "Minnesota", "abbreviation": "MN" },
        { "name": "Mississippi", "abbreviation": "MS" }, { "name": "Missouri", "abbreviation": "MO" }, { "name": "Montana", "abbreviation": "MT" },
        { "name": "Nebraska", "abbreviation": "NE" }, { "name": "Nevada", "abbreviation": "NV" }, { "name": "New Hampshire", "abbreviation": "NH" },
        { "name": "New Jersey", "abbreviation": "NJ" }, { "name": "New Mexico", "abbreviation": "NM" }, { "name": "New York", "abbreviation": "NY" },
        { "name": "North Carolina", "abbreviation": "NC" }, { "name": "North Dakota", "abbreviation": "ND" }, { "name": "Ohio", "abbreviation": "OH" },
        { "name": "Oklahoma", "abbreviation": "OK" }, { "name": "Oregon", "abbreviation": "OR" }, { "name": "Pennsylvania", "abbreviation": "PA" },
        { "name": "Rhode Island", "abbreviation": "RI" }, { "name": "South Carolina", "abbreviation": "SC" }, { "name": "South Dakota", "abbreviation": "SD" },
        { "name": "Tennessee", "abbreviation": "TN" }, { "name": "Texas", "abbreviation": "TX" }, { "name": "Utah", "abbreviation": "UT" },
        { "name": "Vermont", "abbreviation": "VT" }, { "name": "Virginia", "abbreviation": "VA" }, { "name": "Washington", "abbreviation": "WA" },
        { "name": "West Virginia", "abbreviation": "WV" }, { "name": "Wisconsin", "abbreviation": "WI" }, { "name": "Wyoming", "abbreviation": "WY" }
    ];

    constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular, private sharedService: SharedService, private formBuilder: FormBuilder, private leadsService: LeadsService, private alertCtrl: AlertController) {
        if (navParams.get('editLead') == null) {
            this.createForm();
        }
        else {
            this.mode = 'edit';
            this.createEditForm(navParams.get('editLead'));
        }
    }

    ionViewWillLoad() {

    }

    ionViewDidLoad() {
        this.userData$ = this.sharedService.GetUsersData();
    }

    createForm() {
        this.addLeadForm = this.formBuilder.group({
            address1: '',
            address2: '',
            approved: false,
            assignedTo: 0,
            billingCycle: '',
            city: '',
            companyName: ['', Validators.required],
            companyType: 'N',
            companyTypeId: ['', Validators.required],
            createdBy: 0,
            creditStatus: 'P',
            id: 0,
            isAccount: false,
            isAgency: false,
            isElephant: false,
            isPipeLine: false,
            leadContacts: this.formBuilder.array([]),
            leadStatusId: 1,
            leadStatusName: 'New',
            monthType: '',
            marketId: 0,
            ownerId: 0,
            phone: '',
            revenueTypeId: '',
            seasonal: 0,
            state: '',
            stratusCompanyId: null,
            zipCode: ''
        });
    }

    createEditForm(accountDetails) {
        this.addLeadForm = this.formBuilder.group({
            address1: accountDetails.address1,
            address2: accountDetails.address2,
            approved: accountDetails.approved,
            assignedTo: accountDetails.assignedTo,
            billingCycle: accountDetails.billingCycle,
            city: accountDetails.city,
            companyName: [accountDetails.companyName, Validators.required],
            companyType: accountDetails.companyType,
            companyTypeId: [accountDetails.companyTypeId, Validators.required],
            createdBy: accountDetails.createdBy,
            creditStatus: accountDetails.creditStatus,
            id: accountDetails.id,
            isAccount: accountDetails.isAccount,
            isAgency: accountDetails.isAgency,
            isElephant: accountDetails.isElephant,
            isPipeLine: accountDetails.isPipeLine,
            leadContacts: this.formBuilder.array(accountDetails.leadContacts),
            leadStatusId: accountDetails.leadStatusId,
            leadStatusName: accountDetails.leadStatusName,
            monthType: accountDetails.monthType,
            marketId: accountDetails.marketId,
            ownerId: accountDetails.ownerId,
            phone: accountDetails.phone,
            revenueTypeId: accountDetails.revenueTypeId,
            seasonal: accountDetails.seasonal,
            state: accountDetails.state,
            stratusCompanyId: accountDetails.stratusCompanyId,
            zipCode: accountDetails.zipCode
        });
    }

    editCancel() {
        this.view.dismiss('');
    }

    editSave() {
        if (this.mode == 'add') {
            this.addLeadForm.controls['assignedTo'].setValue(this.userData$.id);
            this.addLeadForm.controls['createdBy'].setValue(this.userData$.fullname);
            this.addLeadForm.controls['marketId'].setValue(this.userData$.market.stratusMarketId);
            this.addLeadForm.controls['ownerId'].setValue(this.userData$.id);
            this.restangular.all('Lead/AddLead').post(this.addLeadForm.value);
        }
        else
            this.restangular.all('Lead/UpdateLead').customPOST(this.addLeadForm.value);

        this.sharedService.SetUsersCompanies();

        this.view.dismiss(this.addLeadForm.value);
    }

}
