import { SharedService } from './../../providers/shared-service';
import { ContactsService } from './../../providers/contacts-service';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Searchbar } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-see-all',
  templateUrl: 'see-all.html',
})

export class SeeAll {
  @ViewChild('searchbar') searchbar: Searchbar;
  @ViewChild('companyList') companyList;

  showSearchBar: boolean = true;
  searchCompaniesString = '';
  searchFilter: any;
  searchCondition: any;
  companyType = '';
  
  constructor(public navCtrl: NavController, public navParams: NavParams, sharedService: SharedService, private contactsService: ContactsService) {
    
  }

  doRefresh(event) {
      setTimeout(() => {
          this.contactsService.setAllCompaniesAndContacts();
          event.complete();    
      }, 2000);
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

  conditionChanged(event) {
    let condition = event.target.value;  

    if (condition == 1) {
      this.searchCondition = {isFavorite: true};
    }
    else if (condition == 2){
      this.searchCondition = {isOverdue: true};
    }
    else if (condition == 3) {
      this.searchCondition = {nextActivityDate: {'$ne': null}}
    }
    else if (condition == 4) {
      this.searchCondition = {nextActivityDate: null}
    }
    else if (condition == 5) {
      this.searchCondition = {status: 'Hot'}
    }
    else if (condition == 6) {
      this.searchCondition = {status: 'Warm'}
    }
    else if (condition == 7) {
      this.searchCondition = {status: 'Cold'}
    }
  }
}
