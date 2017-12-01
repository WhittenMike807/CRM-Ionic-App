import { LeadsService } from './../../providers/leads-service';
import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content, ItemSliding, ToastController } from 'ionic-angular';
import * as moment from 'moment';
import { AskService } from './../../providers/ask-service';
import { BudgetService } from './../../providers/budget-service';
import _ from 'lodash';
import 'rxjs/add/observable/forkJoin';
import 'rxjs/add/operator/map';


@IonicPage()
@Component({
  selector: 'page-pipeline',
  templateUrl: 'pipeline.html',
  encapsulation: ViewEncapsulation.None
})
export class Pipeline {
  @ViewChild('myContent') content: Content;

  pipelineFilterItems = [
      {
          askFilter: 1,
          isActive: false,
          topText: 'Prior',
          bottomText: 'Pending',
          listHeaderText: 'Prior Pending Asks'
      },
      {
          askFilter: 2,
          isActive: true,
          topText: 'This',
          bottomText: 'Week',
          listHeaderText: 'To Be Added This Week'
      },
      {
          askFilter: 3,
          isActive: false,
          topText: 'Next',
          bottomText: 'Week',
          listHeaderText: 'To Be Added Next Week'
      },
      {
          askFilter: 4,
          isActive: false,
          topText: 'After Next',
          bottomText: 'Week',
          listHeaderText: 'To Be Added After Next Week'
      }
  ];

  selectedAskView: any = {};
  pipelineData: any = [];
  pipelineGraphData: any = [];
  currentMonthDate = moment().startOf('month');
  currentWeekDate = moment().startOf('week');
  headerText: string = moment(this.currentMonthDate).format('MMMM YYYY');

  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController,  private askService: AskService, private budgetService: BudgetService, private modalCtrl: ModalController, private leadsService: LeadsService) {

  }

  ionViewWillLoad() {
      //console.log(this.content.getContentDimensions().contentHeight);
      
  }

  tooglePipelineView(item){

    this.content.scrollToTop();

    // this.changeItem.emit(item);


    //   if (this.pipelineHeader)
    //     this.renderer.setElementStyle(this.pipelineHeader.nativeElement, 'transform', 'translateY(0px)');

      this.content.scrollToTop();

      switch (item.askFilter) {
          case 1:
          this.currentWeekDate = moment().startOf('week');
          this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), item.askFilter);
          break;

          case 2:
          this.currentWeekDate = moment().startOf('week');
          this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), item.askFilter);
          break;

          case 3:
          this.currentWeekDate = moment().startOf('week').add(1, 'week');
          this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(),item.askFilter);
          break;

          case 4:
          this.currentWeekDate = moment().startOf('week').add(2, 'weeks');
          this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), item.askFilter);
          break;
      }
      
      _.forEach(this.pipelineFilterItems, function(value){
          value.isActive = false;
      });
      item.isActive = true;
      this.selectedAskView = item;
  }

  scrollingFun(e) {
      console.log(this.content.contentHeight);
      console.log(e);
  }

  ionViewDidLoad() {
    this.tooglePipelineView(this.pipelineFilterItems[1]);
    this.budgetService.GetMonthlyPipelineGraphData(moment(this.currentMonthDate).startOf('month').toISOString());
    //this.budgetService.GetPipelineData(moment(this.currentWeekDate).toISOString());
  }

  doRefresh(event) {
        setTimeout(() => {
            this.budgetService.GetMonthlyPipelineGraphData(moment(this.currentMonthDate).startOf('month').toISOString());
            event.complete();    
        }, 2000);
    }

  nextMonth(){
      this.currentMonthDate.add(1, 'month');
      this.headerText = moment(this.currentMonthDate).format('MMMM YYYY');
      let queryStartDate = moment(this.currentMonthDate).startOf('month').toISOString();
      this.budgetService.GetMonthlyPipelineGraphData(queryStartDate);
      this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), this.selectedAskView.askFilter);
  }

  prevMonth(){
      this.currentMonthDate.subtract(1, 'month');
      this.headerText = moment(this.currentMonthDate).format('MMMM YYYY');
      let queryStartDate = moment(this.currentMonthDate).startOf('month').toISOString();
      this.budgetService.GetMonthlyPipelineGraphData(queryStartDate);
      this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), this.selectedAskView.askFilter);
  }

  viewCompanyDetails(ask){
      this.leadsService.getLead(ask.leadID).subscribe(res => {
        this.navCtrl.push('CompanyDetails', {item: res});
    });
  }

  addAsk() {
    let addAskModal= this.modalCtrl.create('AddAsk');

    addAskModal.onDidDismiss(data => {
        if (data.userCanceled)
            return;

        this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), this.selectedAskView.askFilter);
    });

    addAskModal.present();
  }
  editAsk(slidingItem: ItemSliding, ask){
      this.askService.GetAskById(ask.askID).subscribe(askDetails => {
    
       askDetails.companyName = ask.companyName;
       let editAskModal= this.modalCtrl.create('AskDetails', { editAsk: askDetails});
        editAskModal.onDidDismiss(data => {
            if (data.userCanceled)
                return;

            this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), this.selectedAskView.askFilter);
        });
        editAskModal.present();
        slidingItem.close();
    }); 
  }


  deleteAsk(slidingItem: ItemSliding, ask){
      this.askService.DeleteAsk(ask.askID).subscribe(res => {
        const toast = this.toastCtrl.create({
          message: 'Ask Deleted'
        });
        toast.present();
        setTimeout(() => toast.dismiss(), 2000);
         this.budgetService.GetPipelineData(moment(this.currentMonthDate).toISOString(), moment(this.currentWeekDate).toISOString(), this.selectedAskView.askFilter);

         slidingItem.close();
      });
  }
}
