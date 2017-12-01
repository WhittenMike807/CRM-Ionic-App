import { Component, ViewEncapsulation } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the PipelineList page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-pipeline-list',
  templateUrl: 'pipeline-list.html',
  encapsulation: ViewEncapsulation.None
})
export class PipelineList {
  
  textDisplay: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewWillLoad(){
    this.textDisplay = this.navParams.data;
  }

  ionViewDidLoad() {
    
  }

  

}
