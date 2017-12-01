import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';
import { Restangular } from 'ngx-restangular';
import 'rxjs/add/operator/filter';

@Injectable()
export class SharedService {
    private marketStationsSubject = new BehaviorSubject<any>([]);
    private userDataSubject = new BehaviorSubject<any>([]);
    private userCompaniesSubject = new BehaviorSubject<any>([]);

    marketStations$: Observable<any> = this.marketStationsSubject.asObservable();
    userData$: Observable<any[]> = this.userDataSubject.asObservable();
    userCompanies$: Observable<any> = this.userCompaniesSubject.asObservable();
   constructor( private restangular: Restangular) {

   }

  setUserMarket(market){
    return this.restangular.all('Account').one('SwitchMarket', market.stratusMarketId).post()
  }

  SetUsersCompanies(){
    return this.restangular.all('Lead/GetUsersSimpleCompanies').getList().subscribe(data => {
          this.userCompaniesSubject.next(data);
          console.log('GetUsersSimpleCompanies', data);
      });
  }

  getCompanyDetails(companyID){
    return this.restangular.all('Lead/GetLead').customGET('', { leadId: companyID, includeContact: true });
  }

  getSuspectDetails(susepctID){
    return this.restangular.all('contact/GetSuspect').customGET('', { id: susepctID});
  }

  SetUsersData(){
    return this.restangular.all('Account/GetUserData').customGET().subscribe(data => {
          this.userDataSubject.next(data);
      });;
  }

  SetMarketStations():Observable<any>{
      return this.restangular.all('Lead/GetMarketStations').getList().subscribe(data => {
          this.marketStationsSubject.next(data);
      });
  }

  testFilter() {
    this.userCompanies$.subscribe(data => {
      console.log()
    });

  }

  FilterUserCompanies(selectedCompanyType) {
    
    //this.userCompaniesSubject.filter(x => x.companyType === selectedCompanyType);
    
    
    //this.userCompanies$.filter(x => x.companyType === selectedCompanyType);
  }

  GetUsersData(){
    return this.userDataSubject.value;
  }

  GetMarketStations(){
    return this.marketStationsSubject.value;
  }
  
  GetUserCompanies(){
    return this.userCompaniesSubject.value;
  }
}
