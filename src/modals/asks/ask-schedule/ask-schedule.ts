import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
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
import { FilterPipe } from './../../../pipes/filter';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
  providers: [FilterPipe],
  selector: 'page-ask-schedule',
  templateUrl: 'ask-schedule.html',
})
export class AskSchedule {
  addAskForm: FormGroup;
  debug: any;
  ask: any;
  total: number = 0;
  formSettings: any = {
    theme: 'ios'
  };

  numpadSettings: any = {
      theme: 'ios',
      display: 'bottom',
      min: 1,
      max: 999999,
      scale: 2,
      prefix: '$',
      preset: 'decimal'
  };

  constructor(private navCtrl: NavController, private navParams: NavParams, private sharedService: SharedService, private view: ViewController, private formBuilder: FormBuilder, private filterPipe: FilterPipe) {
    this.ask = navParams.get('ask');

    this.createForm(this.ask);
  }

  createForm(ask: any) {
    this.addAskForm = new FormGroup({
      station: new FormControl(ask.station),
      asks: new FormArray([]),
    });

    const askDetailsForms = <FormArray>this.addAskForm.controls['asks'];
   
    ask.details.periods.forEach(askDetail => {
      this.total += Number(askDetail.detailsAmount);

      let formGroup = this.formBuilder.group({
        station: ask.station,
        month: askDetail.month,
        detailsStartDate: moment(askDetail.detailsStartDate).format('MM/DD/YYYY'),
        detailsEndDate: moment(askDetail.detailsEndDate).format('MM/DD/YYYY'),
        detailsAmount: Number(askDetail.detailsAmount),
        id: askDetail.id,
        probability: askDetail.probability
      });
      
      askDetailsForms.push(formGroup);
    });
  }

  ionViewWillLoad() {
    this.addAskForm.valueChanges.subscribe(data => this.onValueChanged(data));
  }

  ionViewDidLoad() {

  }
  
  onValueChanged(data?: any) {
     const askDetailsForms = this.addAskForm.controls['asks'].value;
     this.total = askDetailsForms.reduce(function(a, b){ return a + Number(b['detailsAmount']); }, 0);
  }

  back() {
     this.view.dismiss(this.addAskForm);
  }
}