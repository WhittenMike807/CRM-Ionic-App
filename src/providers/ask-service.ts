import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';

@Injectable()
export class AskService {

  selectedSeller: any;
  private corporateCampaignsSubject = new BehaviorSubject<any[]>([]);
  private stationCampaignsSubject = new BehaviorSubject<any[]>([]);
  corporateCampaigns$: Observable<any[]> = this.corporateCampaignsSubject.asObservable();
  stationCampaigns$: Observable<any[]> = this.stationCampaignsSubject.asObservable();

  constructor(private restangular: Restangular) {
    
  }

  public hasSeller() {
    return false;
  }


  public AddAsk(ask) {
    return this.restangular.one('Asks/AddAsk').customPOST(ask)
  }
  
  public GetAskById(askId: number) {
    return this.restangular.all('Asks/GetAskModel').customGET('', { askId: askId })
  }

  public GetAsks(askStatusID: number) {
    if (!this.hasSeller()) {
      return this.restangular.all('Asks/GetUsersAsks').customGET('', { askStatus: askStatusID })
    } else {
      return this.restangular.all('Asks/GetSellersAsks').customGET('', { userID: this.selectedSeller.id, marketID: this.selectedSeller.marketID, askStatus: askStatusID })
    }
  }

  public GetPipelineAsks() {
    if (!this.hasSeller()) {
      return this.restangular.all('Asks/GetUserPipelineAsks').customGET()
    } else {
      return this.restangular.all('Asks/GetSellerPipelineAsks').customGET('', { userID: this.selectedSeller.id, marketID: this.selectedSeller.marketID })
    }
  }

  public GetWeightedPipeline() {
    if (!this.hasSeller()) {
      return this.restangular.all('Asks/GetUserPipelineProjection').customGET()
    } else {
      return this.restangular.all('Asks/GetSellerPipelineProjection').customGET('', { userID: this.selectedSeller.id, marketID: this.selectedSeller.marketID })
    }
  }

  public GetNonWeightedPipeline() {
    if (!this.hasSeller()) {
      return this.restangular.all('Asks/GetUserNonWeightedPipeline').customGET()
    } else {
      return this.restangular.all('Asks/GetSellerNonWeightedPipeline').customGET('', { userID: this.selectedSeller.id, marketID: this.selectedSeller.marketID })
    }
  }

  public GetPipelineProjection() {
    if (!this.hasSeller()) {
      return this.restangular.all('Asks/GetUserPipelineProjection').customGET()
    } else {
      return this.restangular.all('Asks/GetSellerPipelineProjection').customGET('', { userID: this.selectedSeller.id, marketID: this.selectedSeller.marketID })
    }
  }

  public SetCorporateCampaigns() {
      return this.restangular.all('Asks/GetCorporateCampaigns').withHttpConfig({ cache: false }).customGET('').subscribe(data => {
          this.corporateCampaignsSubject.next(data);
      });
  }

  public GetCorporateCampaigns(){
    return this.corporateCampaignsSubject.value;
  }

  public SetStationCampaigns() {
      return this.restangular.all('Asks/GetStationCampaigns').getList().subscribe(data => {
          this.stationCampaignsSubject.next(data);
      });
  }

  public GetStationCampaigns(){
    return this.stationCampaignsSubject.value;
  }

  public UpdateAsk(ask) {
    return this.restangular.one('Asks/UpdateAsk').customPUT(ask)
  }

  public UpdateAskProbability(id, probability) {
    return this.restangular.one('Asks/UpdateAskProbability').customPUT({ id: id, probability: probability })
  }

  public DeleteAskDetail(id) {
    return this.restangular.one('Asks/DeleteAskDetail').customDELETE('', {id: id});
  }

  public DeleteAsk(id) {
    return this.restangular.one('Asks/DeleteUserAsk').customDELETE('', {askId: id});
  }
}
