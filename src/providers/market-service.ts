import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

@Injectable()
export class MarketService {

  constructor( private restangular: Restangular) {
    
  }

  public GetUserMarkets(){
    return this.restangular.all('Account/GetUserMarkets');
  }

}
