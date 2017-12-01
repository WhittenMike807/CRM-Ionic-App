import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { App, IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Restangular } from 'ngx-restangular';
import { SharedService } from './../../../providers/shared-service';
import { LeadsService } from './../../../providers/leads-service';
import { AskService } from './../../../providers/ask-service';
import Moment from 'moment';
import { extendMoment } from 'moment-range';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';

const moment = extendMoment(Moment);
@IonicPage()
@Component({
    selector: 'page-ask-details',
    templateUrl: 'ask-details.html',
})

export class AskDetails {
  ask: any;
  addAskForm: FormGroup;
  debug: any;
  userData$: any;
  total: number = 0;
  mode: string = 'add';
  companyName: string = '';

  formSettings: any = {
    theme: 'ios'
  };

    numpadSettings: any = {
        theme: 'ios',
        display: 'bottom',
        min: 1,
        max: 999999,
        scale: 0,
        prefix: '$',
        preset: 'decimal'
    };

  rangeSettings: any = {
        theme: 'ios',
        display: 'bottom',
        max: moment().add(3, 'year').toDate(),
        maxRange: 86400000 * 365 * 2
    };

  closeDateSettings: any = {
    theme: 'ios',
    weekCounter: 'year',
    headerText: 'Select Date',
    display: 'bottom',
    outerMonthChange: true,
    setOnDayTap: true,
    buttons: [
        { 
        text: 'Select',
        handler: 'set',
      },
      { 
        text: 'Cancel',
        handler: 'cancel',
      }
    ],
    yearChange: false,
    months: 1,
  };

    campaignSettings: any = {
      theme: 'ios',
      display: 'bottom',
      label: 'Name',
      group: true,
      groupLabel: '&nbsp;',
      placeholder: 'Optional'
  };

  numberSettings: any = {
        theme: 'ios',
        step: 1,
        min: 0,
        max: 100,
        width: 150
    };

  constructor(public appCtrl: App, private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular, private formBuilder: FormBuilder, private sharedService: SharedService, private askService: AskService, private leadsService: LeadsService, private modalCtrl: ModalController) {
    this.ask = navParams.get('addAsk');

    if (navParams.get('addAsk') != null) {
        this.ask = navParams.get('addAsk');
        this.createForm(this.ask);
    }
    else {
        this.mode = 'edit';
        this.ask = navParams.get('editAsk');
        // console.log('ask', this.ask);
        this.createEditForm(navParams.get('editAsk'));
    }
   
    this.debug = this.ask;
  }

  adjustPeriods(ask, index) {
    // console.log('ask', ask);
    setTimeout(t => {
        let formAsk = (<FormArray>this.addAskForm.controls['asks']).at(index) as FormGroup;

        let details = this.generateDetails(ask.value.period.period[0], ask.value.period.period[1], ask.value.amount);
        (<FormArray>this.addAskForm.controls['asks']).at(index).patchValue({details: {periods: details}});
        //ask.patchValue({details: {periods: details}});
    },  500);
  }

  ionViewWillLoad(){
    this.userData$ = this.sharedService.GetUsersData();
    this.addAskForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  editCancel() {
    let data = { userCanceled: true };
    this.view.dismiss(data);
  }

  addEditContinue() {
    if (this.mode == 'edit') {
        let success = this.saveEdit();
    }
    else {
        let success = this.saveNew();
    }    
  }

  saveEdit() {
    let asks = this.addAskForm.controls['asks'].value;
    // console.log('addAskForm', this.addAskForm);
    let askModels = [];

    asks.forEach(ask => {
        // console.log('ask5', ask);
        let deleteDetails = [];
        ask.originalDetails.forEach(a => {
            deleteDetails.push(this.askService.DeleteAskDetail(a.id).map(res => res));
        });

        Observable.forkJoin(deleteDetails).subscribe((data : Array<any>) => {
            let probability = 0;
            switch(ask.probability) {
                case 'Won':
                    probability = 100;
                    break;
                case 'Lost':
                    probability = 0;
                    break;
                default:
                    probability = Number(ask.probability);
                    break;
            }

            ask.probability = probability;
            let formModel = this.addAskForm.controls['askModel'].value;

            ask.leadId = formModel.leadId;
            ask.userId = this.userData$.id;
            ask.marketId = formModel.marketId;
            ask.title = this.addAskForm.controls['title'].value;
            ask.notes = this.addAskForm.controls['notes'].value;

            let askModel = this.generateAskModel(ask, ask.station.id);
            // console.log('askModel', askModel);
            askModels.push(this.askService.UpdateAsk(askModel).map(res => res));
            Observable.forkJoin(askModels).subscribe((data : Array<any>) => {
                let ret = { userCanceled: false };
                this.view.dismiss(ret);
            },
            err => {
                console.error(err)
            });
        },
        err => {
            console.error(err)
        });        
    });
  }

  saveNew() {
    // console.log('addAskForm', this.addAskForm);

    let asks = this.addAskForm.controls['asks'].value;
    let askModels = [];

    asks.forEach(ask => {
        let probability = 0;
        switch(ask.probability) {
            case 'Won':
                probability = 100;
                break;
            case 'Lost':
                probability = 0;
                break;
            default:
                probability = Number(ask.probability);
                break;
        }

        ask.probability = probability;
        ask.company = this.addAskForm.controls['company'].value;
        ask.userId = this.addAskForm.controls['userId'].value;
        ask.marketId = this.addAskForm.controls['marketId'].value;
        ask.title = this.addAskForm.controls['title'].value;
        ask.notes = this.addAskForm.controls['notes'].value;

        let askModel = this.generateAskModel(ask, ask.station.id);
        console.log('askModel', askModel);
         askModels.push(this.askService.AddAsk(askModel).map(res => res));
    });

    Observable.forkJoin(askModels).subscribe((data : Array<any>) => {
       console.log('save', 'success');
        let ret = { userCanceled: false };
        let firstViewCtrl = this.navCtrl.first();
        this.navCtrl.popToRoot({animate: false}).then(() => firstViewCtrl.dismiss(ret));
    },
    err => {
        console.error(err)
    });
  }

  removeStation(index: number) {
       let formArray = (<FormArray>this.addAskForm.controls['asks']);
       if (formArray.length > 1)
            formArray.removeAt(index);
       //(<FormArray>this.addAskForm.controls['asks']).removeAt(index);
  }

  decreaseProbability(formGroup: any) {
    let current = formGroup.controls['probability'].value;

    switch(current) {
        case 'Won':
            current = '90';
            break;
        case '90':
            current = '60';
            break;
        case '60':
            current = '40';
            break;
        case '40':
            current = '10';
            break;
        case '10':
            current = 'Lost';
            break;
    }

    formGroup.patchValue({probability: current});
  }

  increaseProbability(formGroup:any) {
    let current = formGroup.controls['probability'].value;
    switch(current) {
        case 'Lost':
            current = '10';
            break;
        case '10':
            current = '40';
            break;
        case '40':
            current = '60';
            break;
        case '60':
            current = '90';
            break;
        case '90':
            current = 'Won';
            break;
    }

    formGroup.patchValue({probability: current});
  }

  onValueChanged(data?: any) {
     // console.log('changed', data);  
     this.calculateTotal();
  }

//   onAmountChanged(data?: any) {
//      console.log('amount', data);
//   }

  calculateTotal() {
    let askDetailForms = this.addAskForm.controls['asks'].value;
    this.total = 0;
    askDetailForms.forEach(askDetailForm => {
        this.total += askDetailForm.details.periods.reduce(function(a, b){ return a + Number(b['detailsAmount']); }, 0);
    })
  }

  createEditForm(ask:any) {

    this.companyName = ask.companyName;

    this.addAskForm = this.formBuilder.group({
        askName: new FormControl(''),
        asks: new FormArray([]),
        closeDate:  moment(ask.expectedCloseDate).toDate(),
        askModel: ask,
        title: ask.subject,
        notes: ask.comments
    });

    const askDetailsForms = <FormArray>this.addAskForm.controls['asks'];

    let station = ask.askDetails[0].station;
    let probability: string = '';

    switch(ask.totalProbability) {
        case 100:
            probability = 'Won'
            break;
        case 90:
        case 60:
        case 40:
        case 10:
            probability = String(ask.totalProbability)
            break;
        case 0:
            probability = 'Lost';
            break;
    }

    let periods = this.generatePeriods(ask);

    let formGroup = this.formBuilder.group({
        id: ask.id,
        period: { period: [periods.startDate,periods.endDate]},
        amount: ask.askAmount,
        probability: probability,
        corporateCampaign: ask.corporateAssetId,
        stationCampaign: ask.stationAssetId,
        station: { id:  station.id, stationId: station.stationId, stationName: station.name },
        details: { periods: periods.series },
        originalDetails: this.formBuilder.array(ask.askDetails)
    });

    // console.log('formGroup', formGroup);
    askDetailsForms.push(formGroup);

    this.calculateTotal();
  }

  
   generatePeriods(ask: any) {
      let periods: any = { series: []};
      let startDate = moment().startOf('year').add(25, 'years');
      let endDate = moment().startOf('year').subtract(25, 'years');

      ask.askDetails.forEach(period => {
        //   console.log(period);
          let periodStart = moment(period.startDate);
          let periodEnd = moment(period.endDate);

          if (periodStart.isBefore(startDate))
            startDate = periodStart;

          if (endDate.isBefore(periodEnd))
            endDate = periodEnd;

          periods.series.push({
                probability: period.probability,
                month: moment(period.startDate).format('MMM'),
                detailsStartDate: periodStart.toDate(),
                detailsEndDate: periodEnd.toDate(),
                detailsAmount: period.amount,
                id: period.id
            });
      });

      periods.startDate = startDate.toDate();
      periods.endDate = endDate.toDate();

    //   console.log(periods);

      return periods;
  }


  createForm(ask: any) {
    // console.log('ask', ask);
    this.companyName = ask.company.companyName;
    this.addAskForm = this.formBuilder.group({
        askName: new FormControl(''),
        asks: new FormArray([]),
        closeDate: ask.closeDate,
        title: ask.title,
        notes: ask.notes,
        company: ask.company,
        userId: ask.userId,
        marketId: ask.marketId 
    });

    const askDetailsForms = <FormArray>this.addAskForm.controls['asks'];

    ask.stations.forEach(station => {
        let startDate = moment(ask.closeDate).toDate();
        let endDate = moment(ask.closeDate).add('month', ask.months).toDate();

        console.log('Start Date: ' + startDate);
        console.log('End Date: ' + endDate);

        let amount = ask.amount / ask.stations.length;
        let periods = this.generateDetails(startDate, endDate, amount);

        // console.log('askDetail', station);
        let formGroup = this.formBuilder.group({
            company: null,
            id: 0,
            period: { period: [startDate, endDate]},
            amount: amount,
            probability: ask.probability,
            corporateCampaign: null,
            stationCampaign: null,
            station: station,
            details: { periods: periods }
        });

        askDetailsForms.push(formGroup);
    })

    this.calculateTotal();
  }

  generateDetails(startDate: Date, endDate: Date, amount: number) {
    var start = moment(startDate);
    var end = moment(endDate);

    var dr = moment.range(start, end);
    const acc = Array.from(dr.by('months'));

    let askDetails = [];
    //console.log('acc', dr);
    if (acc.length == 1)
        askDetails.push({
            month: moment(start).format('MMM'),
            detailsStartDate: moment(start).startOf('day').toDate(),
            detailsEndDate: moment(end).startOf('day').toDate(),
            detailsAmount: 0,
            id: 0
        });
    else 
        _.forEach(acc, item => {
            if (moment(item).isSame(start)) {
                askDetails.push({
                    month: moment(item).format('MMM'),
                    detailsStartDate: moment(start).startOf('day').toDate(),
                    detailsEndDate: moment(item).endOf('month').startOf('day').toDate(),
                    detailsAmount: 0,
                    id: 0
                });
            } else if (moment(item).isSame(start, 'month')) {
                askDetails.push({
                    month: moment(item).format('MMM'),
                    detailsStartDate: moment(item).startOf('month').startOf('day').toDate(),
                    detailsEndDate: moment(item).endOf('month').startOf('day').toDate(),
                    detailsAmount: 0,
                    id: 0
                });
            } else if (moment(item).isSame(end, 'month')) {
                askDetails.push({
                    month: moment(item).format('MMM'),
                    detailsStartDate: moment(item).startOf('month').startOf('day').toDate(),
                    detailsEndDate: moment(end).startOf('day').toDate(),
                    detailsAmount: 0,
                    id: 0
                });
            } else {
                askDetails.push({
                    month: moment(item).format('MMM'),
                    detailsStartDate: moment(item).startOf('month').startOf('day').toDate(),
                    detailsEndDate: moment(item).endOf('month').startOf('day').toDate(),
                    detailsAmount: 0,
                    id: 0
                });
            }  
        });

    let parentDays = dr.diff('days') + 1;
    let amountPerDay = amount / parentDays;
    let distributedAmount = 0;
     _.forEach(askDetails, function (detail) {
          var childRange = moment.range(detail.detailsStartDate, detail.detailsEndDate);
          var childDays = childRange.diff('days') + 1;
          var monthAmount = amountPerDay * childDays;
          distributedAmount += Math.floor(monthAmount);
          detail.detailsAmount = Math.floor(monthAmount);
      });

      if (amount != distributedAmount) {
          var amountToSplit = amount - distributedAmount;
          if (askDetails && askDetails[0]) {
              askDetails[0].detailsAmount = askDetails[0].detailsAmount + amountToSplit;
          }
      }

    return askDetails;
  }

  adjustAmounts(ask: any) {

  }
  
  showAmounts(ask: any){
    let scheduleModal = this.modalCtrl.create('AskSchedule', { ask: ask.value });
    
    scheduleModal.onDidDismiss(askSchedule => {
        const askDetailsForms = <FormArray>this.addAskForm.controls['asks'].value;
        let index = _.findIndex(this.addAskForm.controls['asks'].value, {station: {stationId: askSchedule.controls['station'].value.stationId} });
        let scheduleAmount = askSchedule.controls['asks'].value.reduce(function(a, b){ return a + Number(b['detailsAmount']); }, 0);
        (<FormArray>this.addAskForm.controls['asks']).at(index).patchValue({amount: scheduleAmount, details: {periods: askSchedule.value.asks}});
    });

    scheduleModal.present();
  }

    generateAskModel(ask, stationId) {
      let postAskModel: any = {};

      postAskModel.userId = ask.userId;
      postAskModel.marketId = ask.marketId;
     
      //this ternary means if triggered from modal
      if (ask.company != null) {
        if (ask.company.id)
            postAskModel.leadId = ask.company.id;
        else
            postAskModel.leadId = ask.company.companyId;
      }
      else if (ask.leadId)
        postAskModel.leadId = ask.leadId;

      //define ask status. 1 = open, 2 = closed, 3 = declined, 4 = pending
      switch (ask.probability) {
        case 0:
            postAskModel.askStatus = 3;
            postAskModel.expectedCloseDate = moment.utc().format();
            break;
        case 100:
            postAskModel.askStatus = 2;
            postAskModel.expectedCloseDate = moment.utc().format();
            break;
        default:
            postAskModel.askStatus = 1;
      }

      postAskModel.id = ask.id;
      postAskModel.parentId = null;
      postAskModel.askSubtype = 1;
      postAskModel.expectedCloseDate = moment(ask.startDate).startOf('day').toISOString();
      postAskModel.closeDate = null;
      postAskModel.isVisible = true;
      postAskModel.totalProbability = ask.probability;
      postAskModel.askAmount = ask.amount;
      postAskModel.closedAmount = null;
      postAskModel.commissionPercentage = 0;
      postAskModel.AskDetails = [];
      postAskModel.subject = ask.title;
      postAskModel.comments = ask.notes;
      postAskModel.commentsDate = moment().startOf('day').toISOString();
      postAskModel.corporateAssetId = ask.corporateCampaign;
      postAskModel.stationAssetId = ask.stationCampaign;

      _.forEach(ask.details.periods, function(detail) {
          postAskModel.AskDetails.push({
              id: 0, //detail.id,
              stationId: stationId,
              initialAmount: detail['detailsAmount'],
              amount: detail['detailsAmount'],
              probability: ask.probability,
              startDate: moment(detail['detailsStartDate']).toISOString(),
              endDate: moment(detail['detailsEndDate']).toISOString(),
              AskId: ask.id,
              groupId: 0
          });
      });

      return postAskModel;
  };
}