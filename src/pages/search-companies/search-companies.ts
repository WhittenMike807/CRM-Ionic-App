import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { LeadsService } from './../../providers/leads-service';
import _ from 'lodash';

@IonicPage()
@Component({
    selector: 'page-search-companies',
    templateUrl: 'search-companies.html',
})

export class SearchCompanies {

    companies: any = [];
    searchText: string = '';
    showSearchBar: boolean = true;

    constructor(private navCtrl: NavController, private leadsService: LeadsService) {

    }

    clearSearch($event) {
        this.searchText = '';
        this.companies = [];
    }

    cancelSearch($event) {
        this.searchText = '';
        this.showSearchBar = !this.showSearchBar;
        this.companies = [];
    }

    toggleSearchBar() {
        this.showSearchBar = !this.showSearchBar;
        this.companies = [];
    }

    searchThis($event) {
        
        // set val to the search term
        let val: any = $event.target.value;

        if (val && val.trim() != '') { 
            this.leadsService.getCompanies(val).subscribe(res => {
                this.companies = res.items;
                this.companies = _.orderBy(this.companies, 'companyName');
            })
        } else {
            this.companies = [];
        }
    }

    // If the company is owned by the user allow them to open it
    companySelected(company) {
        if (company.companyId > 0) {
            
            // This is set so that the companyDetails controller is able to do the needed lookups
            company.id = company.companyId;

            // Now open the CompanyDetails page
            this.navCtrl.push('CompanyDetails', {
                item: company
            });
        } 
    }

}
