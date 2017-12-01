import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

import { SharedService } from './../../../providers/shared-service';
import { LeadsService } from './../../../providers/leads-service';
import { AskService } from './../../../providers/ask-service';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

const moment = extendMoment(Moment);
@IonicPage()
@Component({
    selector: 'page-edit-ask',
    templateUrl: 'edit-ask.html',
})

export class EditAsk {
  editAskForm: FormGroup;
  //stations: Array<any> = [];
  userData$: any;
  debug: any;
  saveDisabled: boolean = true;
  ask: any;
  formattedCloseDate: string;

  constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private formBuilder: FormBuilder, private sharedService: SharedService, private leadsService: LeadsService, private askService: AskService, private modalCtrl: ModalController) {
    // sharedService.getUsersData().subscribe(res => {
    //   this.userData = res
    // })

    this.formattedCloseDate = moment(this.navParams.data.closeDate).format('MMM DD YYYY');
    
    this.editAskForm = this.formBuilder.group({ 
        id: this.navParams.data.askID,
        company: this.navParams.data.companyName,
        station: this.navParams.data.stationName,
        startDate: this.navParams.data.closeDate,
        amount: this.navParams.data.totalAskAmount,
        months: null,
        probability: this.navParams.data.probability,
        title: null,
        notes: null
    });

    this.editAskForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  ionViewWillLoad(){
    this.userData$ = this.sharedService.GetUsersData();
    this.debug = this.navParams.data;
    this.setupForm(this.navParams.data);
    //this.leadsService.getMarketStations().getList().subscribe(res => { this.stations = res});
  }

  setupForm(ask) {
    this.askService.GetAskById(ask.askID).subscribe(ask => {
        this.ask = ask;
        //this.debug = ask;
        // let total = this.ask.askDetails.reduce((a,b) => a + b.nonWeightedAmount, 0);
        let start = _.head<any>(this.ask.askDetails).startDate;
        let end = _.last<any>(this.ask.askDetails).endDate;

        const range = moment.range(start, end);
        const acc = Array.from(range.by('days'));
        let months = Math.floor(acc.length / 30);
        
        this.editAskForm.controls['months'].setValue(months);
    });
  }


  onValueChanged(data?: any) {
    // this.debug++;
    this.saveDisabled = this.disableSave();
  }

  disableSave() {
      return (this.editAskForm.controls['company'].value == null ||
      this.editAskForm.controls['station'].value == null ||
      this.editAskForm.controls['startDate'].value == null ||
      this.editAskForm.controls['amount'].value == null ||
      this.editAskForm.controls['months'].value == null ||
      this.editAskForm.controls['probability'].value == null)
  }

    save() {
        let newProb = Number(this.editAskForm.controls['probability'].value);

        if (newProb === 0) {
            this.ask.askStatus = 3;
            this.ask.expectedCloseDate = moment.utc().format();
            _.forEach(this.ask.askDetails, function (d) {
                d['probability'] = 0;
            });
            this.askService.UpdateAsk(this.ask).subscribe(res => {
                this.notifySender(newProb);
            })
        } else if (newProb === 100) {
            this.ask.askStatus = 2;
            this.ask.expectedCloseDate = moment.utc().format();
            _.forEach(this.ask.askDetails, function (d) {
                d['probability'] = 100;
            });
            this.askService.UpdateAsk(this.ask).subscribe(res => {
                this.notifySender(newProb);
            })
        } else {
            this.askService.UpdateAskProbability(this.ask.id, newProb).subscribe(res => {
                this.notifySender(newProb);
            })
        }
    }

    notifySender(prob) {
        let ret: any = Object.assign({}, this.navParams.data);
        ret.probability = prob;
        this.view.dismiss(ret);
    }

  cancel() {
    let data = { userCanceled: true };
    this.view.dismiss(data);
  }
}