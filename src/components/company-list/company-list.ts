import { FilterPipe } from './../../pipes/filter';
import { ContactsService } from './../../providers/contacts-service';
import { SharedService } from './../../providers/shared-service';
import { Component, Input } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController,  } from 'ionic-angular';
import _ from 'lodash';



@Component({
  selector: 'company-list',
  providers: [FilterPipe],
  templateUrl: 'company-list.html'
})
export class CompanyListComponent {
  _isSeeAll;
  _searchText;
  _companyType;
  _searchCondition;

  @Input()
  get isSeeAll() {
    return this._isSeeAll
  }

  @Input()
  get searchText() {
    return this._searchText;
  }
  
  @Input()
  get companyType() {
    return this._companyType;
  }

  @Input()
  get searchCondition() {
    return this._searchCondition;
  }

  set isSeeAll(val: any) {
    this._isSeeAll = val
  }
  set searchText(val: any) {
    this._searchText = val
  }
  set companyType(val: any) {
    this._companyType = val
  }
  set searchCondition(val: any) {
    this._searchCondition = val
  }

  accounts: any;
  private sub: any;

  constructor(private navCtrl: NavController, private sharedService: SharedService, private contactsService: ContactsService, private view: ViewController, private filterPipe: FilterPipe) {
  }

  ngOnInit() {
    this.sub = this.contactsService.allCompaniesAndContacts$.subscribe(res => {
        this.accounts = _.filter(res, function(account:any) { return account.type != 'Contact'});
        this.accounts = _.sortBy(this.accounts, 'companyName');
        this.accounts = _.orderBy(this.accounts, [lead => lead['companyName'].toUpperCase()], ['asc']);
      console.log('here', this.accounts);
        //this.search(this.searchText, this.searchCondition);
        //this.groupList(this.accounts);
    });

    
  }

  ionViewDidLoad() {

    }
    
  ionViewWillUnload() {
      this.sub.unsubscribe();
  }

  selectCompany(company) {
    if (this._isSeeAll) {
      this.navCtrl.push('CompanyDetails', { item: { id: company.companyId } });
    } else {
      this.view.dismiss(company);
    }
  }

}
