import { SharedService } from './../../providers/shared-service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
import { FilterPipe } from './../../pipes/filter';
import _ from 'lodash';

@IonicPage()
@Component({
  providers: [FilterPipe],
  selector: 'page-select-company',
  templateUrl: 'select-company.html',
})
export class SelectCompany {
  
  @ViewChild('searchbar') searchbar: Searchbar;
  header = 'Select Company'
  showSearchBar: boolean = true;
  showFilters: boolean = true;
  private userCompanies: any;
  private userCompaniesInit: any;
  searchCompaniesString = '';
  meetingType = 'All';

  constructor(private navCtrl: NavController, private navParams: NavParams, private sharedService: SharedService, private view: ViewController, private filterPipe: FilterPipe) {
    if (this.navParams.get('SeeAll')) {
      this.header = 'See All';
    }
      
  }

  ionViewWillLoad() {

  }

  ionViewDidLoad() {
    this.userCompanies = _.sortBy(this.sharedService.GetUserCompanies(), [function (c) {
      return c.companyName.trim();
    }]);
      
    this.userCompaniesInit = _.sortBy(this.sharedService.GetUserCompanies(), [function (c) {
      return c.companyName.trim();
    }]);
  }

  cancel() {
    if (this.header != 'See All')
      this.view.dismiss();
  }

  selectCompany(company) {
    if (this.header != 'See All')
      this.view.dismiss(company);
    else {
      this.navCtrl.push('CompanyDetails', {
            item: {id: company.companyId}
        });
    }
  }

  filterCompaniesByType(selectedCompanyType) {
    this.searchCompaniesString = '';
    this.userCompanies = this.userCompaniesInit;

    if (selectedCompanyType != 'All') {
      this.userCompanies = this.userCompanies.filter(v => {
        if (v.companyType === selectedCompanyType) {
          return true;
        }
        return false;
      })
    }
  }

  clearSearch(){
    this.searchCompaniesString = '';
  }

  cancelSearch(){
    this.searchCompaniesString = '';
    this.showSearchBar = false;
    this.navCtrl.resize();
  }

  toggleFilter(){
    this.showFilters = !this.showFilters;
    this.navCtrl.resize();
  }

  toggleSearchBar() {
    this.showSearchBar = !this.showSearchBar;
    this.navCtrl.resize();
    if (this.showSearchBar) {
      setTimeout(() => {
        this.searchbar.setFocus();
      });    
    }
  }

  searchCompanies(ev: any) {
    if (this.meetingType === 'All') {
      this.userCompanies = this.userCompaniesInit;  
    }
    
    let val = ev.target.value;

    if (!val || val.trim() == '') {
      return;
    }

    this.userCompanies = this.filterPipe.transform(this.userCompanies, {companyName: val}, false);
    
    // this.userCompanies = this.userCompanies.filter(v => {
    //   if (v.companyName.toLowerCase().indexOf(val.toLowerCase()) > -1) {
    //     return true;
    //   }
    //   return false;
    // })
  }

}