import { Component  } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { MarketService } from './../../providers/market-service';
import { SharedService } from './../../providers/shared-service';
import { Storage } from '@ionic/storage';
import _ from 'lodash';

@IonicPage()
@Component({
  selector: 'modal-marketlist',
  templateUrl: 'marketlist.html',
})
export class MarketList {
  markets: any = [];
  filteredMarkets: any = [];
  currentMarketSelected: any;
  userData$: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private marketService: MarketService, private viewCtrl: ViewController,
    private sharedService: SharedService, private storage: Storage) {

  }
  

  ionViewDidLoad() {
    this.userData$ = this.sharedService.GetUsersData();
    this.currentMarketSelected = this.userData$.market;

    this.marketService.GetUserMarkets().getList().subscribe(res => {
      let index = _.findIndex(res, this.currentMarketSelected)
      res = _.forEach(res, function(m){
        m['isCurrentlySelected'] = false;
      });
      
      
      if (index) {
        res[index].isCurrentlySelected = true  
      }
      
      this.markets = res
      this.filteredMarkets = res
      
    })

  }

  selectMarket(event, market) {
    this.sharedService.setUserMarket(market).subscribe(res => {
      console.log(res);
    });

    this.sharedService.GetMarketStations();
    this.storage.set('userMarket', market);
    this.viewCtrl.dismiss(market);
  }

  getMarkets(ev: any) {
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.filteredMarkets = this.markets.filter((market) => {
        return (market.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
    else {
      this.filteredMarkets = this.markets;
    }
  }
  
  dismiss() {
    this.viewCtrl.dismiss();
  }
}
