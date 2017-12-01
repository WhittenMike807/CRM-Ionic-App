import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/filter';

@Injectable()

export class ContactsService {
    private allCompaniesAndContactsSubject = new BehaviorSubject<any>([]);
    allCompaniesAndContacts$: Observable<any> = this.allCompaniesAndContactsSubject.asObservable();

    constructor(private restangular: Restangular) {
        
    }

    public setAllCompaniesAndContacts() {
        return this.restangular.all('Contact/GetAllContactsAndCompanies').getList().subscribe(data => {
            this.allCompaniesAndContactsSubject.next(data);
            //this.allCompaniesAndContactsSubject.complete();
            console.log('GetAllContactsAndCompanies', data);
        });
    }

    public getContact(id) {
        return this.restangular.all('Contact/GetContact').customGET("", { contactId: id })
    }

    public getUserContacts() {
        return this.restangular.all('Contact/GetLeadOwnerContacts');
    }

    public getMarketContacts(searchTerm) {
        return this.restangular.all('Contact/GetMarketContacts?searchTerm=' + searchTerm);
    }

}
