import _ from 'lodash';
import { Component } from '@angular/core';
import { ContactsService } from './../../providers/contacts-service';
import { IonicPage, NavController, ModalController, ItemSliding } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-contacts',
    templateUrl: 'contacts.html',
})

export class Contacts {

    allContacts: any = [];
    contacts: any = [];
    contactType: string = 'userContacts';
    groupedList: any = [];
    searchText: string = '';
    showSearchBar: boolean = true;
    groupListChange: boolean = false;

    constructor(private navCtrl: NavController, private contactsService: ContactsService, private modalCtrl: ModalController) {

    }

    ionViewDidLoad() {
        this.getContactList();
    }

    doRefresh(event) {
        setTimeout(() => {
            this.contactsService.setAllCompaniesAndContacts();
            event.complete();    
        }, 2000);
    }
    
    searchThis($event) {

        // initialize the data
        this.groupedList = [];

        // set val to the value of the ev target
        let val: any = $event.target.value;
        let filteredList: any = [];

        if (this.contactType === 'userContacts') {
            // if the value is an empty string don't filter the items
            if (val && val.trim() != '') {
                filteredList = this.allContacts.filter((item) => {
                    if (item.firstName !== null && item.lastName !== null) {
                        return (item.firstName.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.lastName.toLowerCase().indexOf(val.toLowerCase()) > -1);
                    }
                });
                this.groupList(filteredList);
            }
        } else {
            this.contactsService.getMarketContacts(val).getList().subscribe(res => {
                this.groupListChange = true;
                this.contacts = res;
                this.contacts = _.orderBy(this.contacts, 'firstName');

                this.groupList(this.contacts);
            });
        }
    }

    clearSearch($event) {
        this.searchText = '';
        this.groupedList = [];

        if (this.contactType === 'userContacts') {
            this.groupList(this.allContacts);
        } 
    }

    cancelSearch($event) {
        this.searchText = '';
        this.groupedList = [];

        if (this.contactType === 'userContacts') {
            this.groupList(this.allContacts);
        } 
    }

    getContactList() {
        this.groupedList = [];

        this.contactsService.getUserContacts().getList().subscribe(res => {
            this.contacts = res;
            this.contacts = _.orderBy(this.contacts, 'firstName');

            // This is used to be able to reset the contacts array after searching
            this.allContacts = this.contacts;
            this.groupList(this.contacts);
            this.groupListChange = false;
            console.log('groups', this.groupedList);
        });
    }

    createContact() {
        // let modal = this.modalCtrl.create('AddContact');
        let modal = this.modalCtrl.create('Contact');
        
        modal.onWillDismiss(data => {
            this.searchText = '';
            this.getContactList();
        });

        modal.present();
    }

    userContacts() {
        // initialize the data
        if(this.groupListChange){
            this.getContactList();
        } else {
            this.groupedList = [];
            this.groupList(this.allContacts);
        }
        
        this.searchText = '';
    }

    marketContacts() {
        // initialize the data
        this.groupedList = [];
        this.searchText = '';
    }

    editContact(slidingItem: ItemSliding, contact) {
        // due to the way items render behind the modal removing search bar until modal is closed
        // this.showSearchBar = false;

        // let modal = this.modalCtrl.create('EditContact', contact);
        let modal = this.modalCtrl.create('Contact', {editContact: contact});
        modal.onWillDismiss(data => {
            // this.showSearchBar = true;
            this.searchText = '';
            this.getContactList();
        });

        slidingItem.close();
        modal.present();
    }

    groupList(contacts) {

        // let sortedContacts = contacts;
        let sortedContacts = _.orderBy(this.contacts, [c => c['firstName'].toUpperCase()], ['asc']);
        let currentLetter = false;
        let currentContacts = [];
 
        sortedContacts.forEach((value, index) => {

            if(value['firstName'].charAt(0).toUpperCase() != currentLetter){
 
                currentLetter = value['firstName'].charAt(0).toUpperCase();
 
                let newGroup = {
                    letter: currentLetter,
                    contacts: []
                };
 
                currentContacts = newGroup.contacts;
                this.groupedList.push(newGroup);
            } 
 
            currentContacts.push(value);
        });
 
    }

  itemTapped(event, contact) {
   let modal = this.modalCtrl.create('Contact', {editContact: contact});
    modal.onWillDismiss(data => {
        // this.showSearchBar = true;
        this.searchText = '';
        this.getContactList();
    });

    modal.present();
  }
}
