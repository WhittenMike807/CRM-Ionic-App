import _ from 'lodash';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { LeadsService } from './../../../providers/leads-service';
import { Restangular } from 'ngx-restangular';

@IonicPage()
@Component({
    selector: 'page-edit-company',
    templateUrl: 'edit-company.html',
})

export class EditCompany {

    accountDetails: any;
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

    constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular, private leadsService: LeadsService) {
        this.accountDetails = navParams.data;
    }

    ionViewWillLoad() {
        this.leadsService.getCompanyTypes().getList().subscribe(res => {
            this.companyTypeList = res;
        });

        this.leadsService.getRevenueTypes().getList().subscribe(res => {
            this.revenueTypeIdList = _.sortBy(res, 'name');
        });
    }

    editCancel() {
        this.view.dismiss('');
    }

    editSave() {
        this.restangular.all('Lead/UpdateLead').customPOST(this.accountDetails);
        this.view.dismiss('');
    }

}
