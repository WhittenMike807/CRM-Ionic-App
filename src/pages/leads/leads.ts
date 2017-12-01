import _ from 'lodash';
import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ActionSheetController, ModalController, Searchbar } from 'ionic-angular';
import { ContactsService } from './../../providers/contacts-service';

@IonicPage()
@Component({
    selector: 'page-leads',
    templateUrl: 'leads.html',
})

export class Leads {
    @ViewChild('searchbar') searchbar: Searchbar;

    groupedList: any = [];
    accounts: any = [];
    searchText: string = '';
    searchCondition: number = 0;
    showSearchBar: boolean = false;

    searchSettings: any = {
        placeholder: 'Required',
        minWidth: 200
    };

    formSettings: any = {
        
    };
    
    sub: any;

    constructor(private navCtrl: NavController, private contactsService: ContactsService, private actionSheetCtrl: ActionSheetController, private modalCtrl: ModalController) {
        
    }

    ionViewWillUnload() {
        this.sub.unsubscribe();
    }

    ionViewDidLoad() {
        this.sub = this.contactsService.allCompaniesAndContacts$.subscribe(res => {
            this.accounts = _.filter(res, { type: "Lead" });
            this.accounts = _.sortBy(this.accounts, 'companyName');
            this.accounts = _.orderBy(this.accounts, [lead => lead['companyName'].toUpperCase()], ['asc']);
            this.search(this.searchText, this.searchCondition);
            //this.groupList(this.accounts);
        });
    }

    conditionChanged(event) {
        this.searchCondition = event.target.value;
        this.search(this.searchText, this.searchCondition);
    }

    itemTapped(event, item) {
        this.navCtrl.push('Company', {
            item: item
        });
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

    doRefresh(event) {
        setTimeout(() => {
            this.contactsService.setAllCompaniesAndContacts();
            event.complete();    
        }, 2000);
    }

    search(text, condition) {
         // initialize the data
         this.groupedList = [];
         
        // set val to the value of the ev target
        
        let filteredList: any = [];
        
        // if the value is an empty string don't filter the items
        if (text && text.trim() != '') {
            filteredList = this.accounts.filter((item) => {
                return (item.companyName.toLowerCase().indexOf(text.toLowerCase()) > -1);
            })
        }
        else
            filteredList = this.accounts;

        if (condition == 1) {
            filteredList = filteredList.filter((item) => {
                return (item.isFavorite = true);
            });
        }
        else if (condition == 2) {
            filteredList = filteredList.filter((item) => {
                return (item.isOverdue = true);
            });
        }
        else if (condition == 3) {
            filteredList = filteredList.filter((item) => {
                return (item.nextActivityDate != null);
            });
        }
        else if (condition == 4) {
            filteredList = filteredList.filter((item) => {
                return (item.nextActivityDate == null);
            });
        }
        else if (condition == 5) {
            filteredList = filteredList.filter((item) => {
                return (item.status == 'Hot');
            });
        }
        else if (condition == 6) {
            filteredList = filteredList.filter((item) => {
                return (item.status == 'Warm');
            });
        }
        else if (condition == 7) {
            filteredList = filteredList.filter((item) => {
                return (item.status == 'Cold');
            });
        }
        this.groupList(filteredList);
    }

    searchThis($event) {
        this.search(this.searchText, this.searchCondition);
    }


    clearSearch($event) {
        this.searchText = '';
        
        // reset the view with all data
        this.groupedList = [];
        this.groupList(this.accounts);
    }

    cancelSearch($event) {
        this.searchText = '';
        this.showSearchBar = !this.showSearchBar;

        // reset the view with all data
        this.groupedList = [];
        this.groupList(this.accounts);
    }

    groupList(leads) {

        let sortedLeads = leads;
        let currentLetter = false;
        let currentLeads = [];
 
        sortedLeads.forEach((value, index) => {

            if(value.companyName.charAt(0) != currentLetter){

                currentLetter = value.companyName.charAt(0);
 
                let newGroup = {
                    letter: currentLetter,
                    leads: []
                };
 
                currentLeads = newGroup.leads;
                this.groupedList.push(newGroup);
            } 
 
            currentLeads.push(value);
        });
 
    }

    createLead() {
        let modal = this.modalCtrl.create('Lead');
        modal.onWillDismiss(data => {
            // Refresh the list of Leads
            // this.accounts = [];
            // this.groupedList = [];
            this.contactsService.setAllCompaniesAndContacts();
            // this.search(this.searchText, this.searchCondition);
            // this.leadsService.getLeads().getList().subscribe(res => {
            //     this.leads = _.filter(res, { companyType: "Lead" });
            //     this.leads = _.sortBy(this.leads, 'companyName');

            //     this.groupList(this.accounts);
            // })
        });
        modal.present();
    }

}
