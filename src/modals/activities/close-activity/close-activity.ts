import { ActivitiesService } from './../../../providers/activities-service';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Restangular } from 'ngx-restangular';
import * as moment from 'moment';

@IonicPage()
@Component({
  selector: 'page-close-activity',
  templateUrl: 'close-activity.html'
})

export class CloseActivity {
  closeActivityForm: FormGroup;

    formSettings: any = {
        
    };

    closeDateSettings: any = {
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
  
  constructor(private navCtrl: NavController, private navParams: NavParams, private view: ViewController, private restangular: Restangular, private formBuilder: FormBuilder, private activityService: ActivitiesService) {

    this.closeActivityForm = formBuilder.group({
        id: navParams.data.id,
        companyName: navParams.data.companyName,
        subject: navParams.data.subject,
        comments: ['', Validators.compose([Validators.maxLength(2000)])],
        myDate: [moment().utc(true).toDate(), Validators.required]
    });

  }
  
  cancel() {
    let data = { userCanceled: true };
    this.view.dismiss(data);
  }
  
  save() {
    // console.log('date', this.closeActivityForm.controls['myDate'].value);
    // console.log('dateISO', moment(this.closeActivityForm.controls['myDate'].value).toISOString());
    // this.closeActivityForm.patchValue({myDate: moment(this.closeActivityForm.controls['myDate'].value).toISOString()});
    this.activityService.closeUserActivity(this.closeActivityForm.controls['id'].value, this.closeActivityForm.value).then(res => {
      this.view.dismiss(res);
    });
  }
}
