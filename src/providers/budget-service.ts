import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';

export const BLANK_PIPELINE_GRAPH_DATA : any = {
  bob: 0,
  budget: 0,
  pipeline: 0,
  percentage: 0
};

@Injectable()
export class BudgetService {

  selectedSeller: any;

  private pipelineGraphDataSubject = new BehaviorSubject(BLANK_PIPELINE_GRAPH_DATA);
  private pipelineDataSubject = new BehaviorSubject([]);
  private loadingPipelineGraphDataSubject = new BehaviorSubject(false);
  private loadingPipelineDataSubject = new BehaviorSubject(false);

  pipelineGraphData$: Observable<any> = this.pipelineGraphDataSubject.asObservable();
  pipelineData$: Observable<any> = this.pipelineDataSubject.asObservable();
  isLoadingPipelineGraphData$: Observable<boolean> = this.loadingPipelineGraphDataSubject.asObservable();
  isLoadingPipelineData$: Observable<boolean> = this.loadingPipelineDataSubject.asObservable();

  constructor( private restangular: Restangular) {
    
  }

  public hasSeller() {
    return false;
  }

  public GetBudget(stationID: number) {
    stationID = (stationID == null ? 0 : stationID)
    if (!this.hasSeller()) {
      return this.restangular.all('Budget/GetUsersBudget').customGET('', { stationID: stationID})
    } else {
      return this.restangular.all('Budget/GetSellersBudget').customGET('', { userID: this.selectedSeller.id, marketID: this.selectedSeller.marketID, stationID: stationID })
    }
  }

  public GetMarketOrderBudget(stationID: number) {
    stationID = (stationID == null ? 0 : stationID)
    if (!this.hasSeller()) {
      return this.restangular.all('Budget/GetUserMarketOrderBudget').customGET('', { stationID: stationID})
    } else {
      return this.restangular.all('Budget/GetSellerMarketOrderBudget').customGET('', { userID: this.selectedSeller.id, marketID: this.selectedSeller.marketID, stationID: stationID })
    }
  }

  
  GetMonthlyPipelineGraphData(startDate: any): Observable<any>{
      this.loadingPipelineGraphDataSubject.next(true);
      return this.restangular.all('Budget/GetPipelineGraphData').customGET('', { startDate: startDate}).subscribe(
        data => {
          var tempPercent = Math.floor(((data.bob + data.pipeline) / data.budget) *100);
          data["percentage"] = tempPercent;
          this.pipelineGraphDataSubject.next(data)
        },
        error => {
          console.log(error);
        },
        complete => {
          this.loadingPipelineGraphDataSubject.next(false);
        }
      );
    }

  GetPipelineData(monthStartDate: any, weekStartDate: any, askFilter: number): Observable<any>{
    this.loadingPipelineDataSubject.next(true);
    return this.restangular.all('Budget/PipelineDetailsMobile').customGET('', { monthStartDate: monthStartDate, weekStartDate: weekStartDate, askFilter: askFilter}).subscribe(
        data => {
          this.pipelineDataSubject.next(data)
        },
        error => {
          console.log(error);
        },
        complete => {
          this.loadingPipelineDataSubject.next(false);
        }
    );
  }
}
