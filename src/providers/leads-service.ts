import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class LeadsService {

    private companyTypesSubject = new BehaviorSubject<any[]>([]);
    private revenueTypesSubject = new BehaviorSubject<any[]>([]);
    private leadActivitiesSubject = new BehaviorSubject<any[]>([]);
    private companyAskHistorySubject = new BehaviorSubject<any[]>([]);
    private leadSubject = new BehaviorSubject<any[]>([]);
    private leadNotesSubject = new BehaviorSubject<any[]>([]);
    private companyRevenueByMonthSubject = new BehaviorSubject<any>([]);
    private companyRevenueSubject = new BehaviorSubject<any>([]);
    companyTypesSubject$: Observable<any[]> = this.companyTypesSubject.asObservable();
    revenueTypesSubject$: Observable<any[]> = this.revenueTypesSubject.asObservable();
    leadActivitiesSubject$: Observable<any[]> = this.leadActivitiesSubject.asObservable();
    companyAskHistorySubject$: Observable<any[]> = this.companyAskHistorySubject.asObservable();
    leadSubject$: Observable<any[]> = this.leadSubject.asObservable();
    leadNotesSubject$: Observable<any[]> = this.leadNotesSubject.asObservable();
    companyRevenueByMonthSubject$: Observable<any> = this.companyRevenueByMonthSubject.asObservable();
    companyRevenueSubject$:  Observable<any> = this.companyRevenueSubject.asObservable();

    constructor(private restangular: Restangular) {
        
    }

    public getLead(leadId) {
        return this.restangular.all('Lead/GetLead').customGET("", { leadId: leadId, includeContact: true });
    }

    public setLead(leadId) {
        return this.restangular.all('Lead/GetLead').customGET("", { leadId: leadId, includeContact: true }).subscribe(data => {
            console.log('leadContacts', data.leadContacts)
            this.leadSubject.next(data.leadContacts);
        })
    }

    public getLeads() {
        return this.restangular.all('Lead/GetUsersCompanies');
    }

    public getAgencies() {
        return this.restangular.all('Lead/GetSellersAgencies');
    }


    public getCompanyTypes() {
        return this.restangular.all('Lead/GetCompanyTypes');
    }

    public getRevenueTypes() {
        return this.restangular.all('Lead/GetRevenueTypes');
    }
    
    public SetCompanyTypes() {
      return this.restangular.all('Lead/GetCompanyTypes').getList().subscribe(data => {
          this.companyTypesSubject.next(data);
      });
    }

    public GetCompanyTypes(){
        return this.companyTypesSubject.value;
    }

    public SetRevenueTypes() {
      return this.restangular.all('Lead/GetRevenueTypes').getList().subscribe(data => {
          this.revenueTypesSubject.next(data);
      });
    }

    public GetRevenueTypes(){
        return this.companyTypesSubject.value;
    }

    public GetUserMarkets(){
        return this.restangular.all('Account/GetUserMarkets');
    }     

    public getLeadNotes(leadId) {
        return this.restangular.all('Lead/GetLeadNotes?leadID=' + leadId);
    }

    public setLeadNotes(leadId) {
        return this.restangular.all('Lead/GetLeadNotes?leadID=' + leadId).getList().subscribe(data => {
            this.leadNotesSubject.next(data);
        })
    }

    public getLeadActivities(leadId) {
        return this.restangular.all('Lead/GetLeadActivities?leadID=' + leadId);
    }

    public setLeadActivities(leadId) {
        return this.restangular.all('Lead/GetLeadActivities?leadID=' + leadId).getList().subscribe(data => {
            console.log('leadId', leadId);
            console.log('setLeadActivities', data);
            this.leadActivitiesSubject.next(data);
        });
    }

    public getCompanyAskHistory (leadId) {
        return this.restangular.all('Asks/GetCompanyAsks?leadID=' + leadId);
    }

    public setCompanyAskHistory(leadId) {
        return this.restangular.all('Asks/GetCompanyAsks?leadID=' + leadId).getList().subscribe(data => {
            this.companyAskHistorySubject.next(data);
        });
    }

    public getAccountSpending (leadId) {
        return this.restangular.all('Lead/GetCompanyRevenue?leadID=' + leadId).customGET("");
    }

    public setAccountSpending (leadId) {
        return this.restangular.all('Lead/GetCompanyRevenue?leadID=' + leadId).customGET("").subscribe(data => {
            if (data.cySpending !== undefined) {
                this.companyRevenueSubject.next({spendingCY: data.cySpending, spendingLY: data.pySpending});
            } else {
                this.companyRevenueSubject.next({spendingCY: 0, spendingLY: 0});
            }
           
        })
    }

    public getCompanyRevenueByMonth (leadId, marketId) {
        return this.restangular.all('Lead/GetCompanyRevenueByMonth').withHttpConfig({ cache: false }).customGET("", { leadId: leadId, marketID: marketId });
    }

    public setCompanyRevenueByMonth (leadId, marketId) {
        return this.restangular.all('Lead/GetCompanyRevenueByMonth').withHttpConfig({ cache: false }).customGET("", { leadId: leadId, marketID: marketId }).subscribe(data => {
            if (data.length > 0) {
                this.companyRevenueByMonthSubject.next(data[0])
            } else {
                this.companyRevenueByMonthSubject.next({
                    month1: "0", month2: "0", month3: "0", month4: "0", month5: "0", month6: "0", month7: "0", month8: "0", month9: "0", month10: "0", month11: "0", month12: "0",
                    priorMonth1: "0", priorMonth2: "0", priorMonth3: "0", priorMonth4: "0", priorMonth5: "0", priorMonth6: "0", priorMonth7: "0", priorMonth8: "0", priorMonth9: "0", priorMonth10: "0", priorMonth11: "0", priorMonth12: "0"
                });
            }
        })
    }

    public getCompanies (companyName) {
        return this.restangular.all('Lead/SearchMarketLeads?companyName=' + companyName).customGET("");
    }

    public deleteLead(id) {
        return this.restangular.all('Lead/SellerDeleteLead').remove({ id: id });
    }

    public requestAccount(lead) {
        let postData = {
            leadID: lead.id,
            request: true
        };
        
        return this.restangular.all('Lead/RequestAccountToStratus').customPOST(undefined, undefined, postData, {});
    }

    public cancelAccountRequest(lead) {
        let postData = {
            leadID: lead.id,
            request: false
        };

        return this.restangular.all('Lead/RequestAccountToStratus').customPOST(undefined, undefined, postData, {});
    }

    public convertToLead(lead) {
        return this.restangular.one('Accounts/ConvertAccountToLead').customPUT(lead.id, undefined, undefined, {'Content-Type': 'application/json'});
    }
}
