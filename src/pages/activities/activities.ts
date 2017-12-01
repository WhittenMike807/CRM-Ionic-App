// import { FileOpener } from '@ionic-native/file-opener';
// import { IonicPage, NavController, AlertController, Platform, ModalController, ItemSliding, ToastController } from 'ionic-angular';
import _ from 'lodash';
import { ActivitiesService } from './../../providers/activities-service';
import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { extendMoment } from 'moment-range';
import { IonicPage, NavController, ModalController, ItemSliding, ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { SharedService } from './../../providers/shared-service';
import Moment from 'moment';

const moment = extendMoment(Moment);

@IonicPage()
@Component({
    selector: 'page-activities',
    templateUrl: 'activities.html',
    encapsulation: ViewEncapsulation.None
})

export class Activities {

    @ViewChild('eventsCalendar') calRef: any;

    // userActivities$: Observable<any[]>;
    endDate: any = moment().endOf('week');
    eventMonth: number = moment().month();
    events: any = [];
    headerText: string = moment.utc().format('MMMM YYYY');
    returningData: boolean = true;
    searchText: string = '';
    selectedDateActivites: any = [];
    selectedDay: any = moment().startOf('day');
    selectedDayIsToday: boolean = true;
    showSearchBar: boolean = false;
    startDate: any = moment().startOf('week');
    userActivities: any = [];
    userActivitiesByDay: any = [];
    weekDates: any = [];

    eventSettings: any = {
        calendarScroll: 'horizontal',
        display: 'center',
        firstDay: 0,
        layout: 'liquid',
        showEventCount: true,
        showOuterDays: true,
        yearChange: false,
        onMonthChange: function(event, inst) {
            let selectedMonth = moment().month(event.month).format('MMMM');
            let monthStart = moment(event.year + '-' + selectedMonth + '-01', 'YYYY-MMMM-DD').startOf('month').format('MMMM YYYY');
            this.events = [];

            this.activitiesService.getUserCalendarAll(monthStart).subscribe(data => {            
                for (let i = 0; i < data.length; i++) {
                    if (data[i].companyName) {
                        this.events.push({ d: moment.utc(data[i].startDate).local().toDate(), text: '<br>' + data[i].companyName + '<br>' + data[i].subject, activity: data[i]});
                    } else {
                        this.events.push({ d: moment.utc(data[i].startDate).local().toDate(), text: '<br>' + data[i].subject, activity: data[i]});
                    }
                }
            });
        }.bind(this),
        onEventSelect: function(event, inst) {
            this.eventSelected(event.event.activity);
        }.bind(this),
        onShow: function(event, inst) {
            this.showEventsCalendar();
        }.bind(this),
        // onDestroy: function(event, inst) {
        //     console.log('onDestroy Event');
        // },
        // onClose: function(event, inst) {
        //     console.log('onClose Event');
        // },
        // onBeforeClose: function(event, inst) {
        //     console.log('onBeforeClose Event');
        // }
    };

    // constructor(private navCtrl: NavController, private activitiesService: ActivitiesService, private fileOpener: FileOpener, private alertCtrl: AlertController, private platform: Platform, private modalCtrl: ModalController, private toastCtrl: ToastController, private sharedService: SharedService) {
    constructor(private navCtrl: NavController, private activitiesService: ActivitiesService, private modalCtrl: ModalController, private toastCtrl: ToastController, private sharedService: SharedService) {
        //  this.weekDates = this.getdates();
    }

    public toggles = [
        {
            value: 'Closed'
        },
        {
            value: 'Open'
        }
    ];

    ionViewDidLoad() {
        this.weekDates = this.getdates();
        this.activitiesService.getUsersActivities(this.startDate, this.endDate).subscribe(data => {
            this.userActivities = data;
            this.parseUserActivites();
            this.gotoToday();
        });
    }

    doRefresh(refresher) {
        setTimeout(() => {
            this.activitiesService.getUsersActivities(this.startDate, this.endDate).subscribe(data => {
                this.userActivities = data;
                this.parseUserActivites();
                this.gotoToday();
            });
            refresher.complete();
        }, 2000);
    }

    closeActivity(activity) {
        let closeActivityModal = this.modalCtrl.create('CloseActivity', activity);

        closeActivityModal.onDidDismiss(data => {
            if (data.userCanceled) {
                activity.activityState = 'Open';
            } else {
                activity.activityState = 'Closed';
            }
        });

        closeActivityModal.present();
    }

    openActivity(activity) {
        activity.activityState = 'Open';
        this.activitiesService.openUserActivity(activity).then(res => {
            console.log(res);
        });
    }

    editActivity(slidingItem: ItemSliding, activity) {
        this.activitiesService.getActivity(activity).subscribe(res => {
            let editActivityModal = this.modalCtrl.create('Activity', {editActivity: res});
            editActivityModal.onDidDismiss(data => {
                this.updateUserActivities(this.selectedDay);
            });
            editActivityModal.present();
        });

        slidingItem.close();
    }

    isActivityClosed(act, $event) {
        if (act.activityState === 'Closed') {
            return 'closedActivity';
        }
        return false;
    }

    itemTapped(event, item) {
        if (item.companyId !== 0) {
            this.sharedService.getCompanyDetails(item.companyId).subscribe(res => {
                this.navCtrl.push('CompanyDetails', {
                    item: res
                });
            });
        }
    }

    updateUserActivities(date) {
        this.returningData = true;
        this.userActivitiesByDay = [];
        this.userActivities = [];
        this.activitiesService.getUsersActivities(this.startDate, this.endDate).subscribe(res => {
            this.userActivities = res;
            this.parseUserActivites();
            this.selectActivityDate(moment(date).format('MM/DD/YYYY'));
        });
    }

    isMidnight(date) {
        if (moment.utc(date).local().format('HH:mm:ss') !== '00:00:00') {
            return true;
        } else {
            return false;
        }
    }

    parseUserActivites() {
        let testGroup = _(this.userActivities)
            .groupBy(function (item) {
                var dateMoment = moment.utc(item['startDate']).local();
                return dateMoment.format('MM/DD/YYYY');
            })
            .map(function (items, sdate) {
                return {
                    startDate: sdate,
                    activities: items
                };
            })
            .value();

        testGroup = _.sortBy(testGroup, function (o) {
            return new Date(o.startDate);
        });

        this.weekDates = _.forEach(this.weekDates, function (value, key) {
            var blah = _.find(testGroup, function (grp) {
                return grp.startDate === value['date']
            });
            if (blah) {
                value['hasActivites'] = true;
            } else {
                value['hasActivites'] = false;
            }
        });

        this.returningData = false;
    }

    getdates() {
        var dates = [
            {
                dateNumber: moment(this.startDate).day("Sunday").format('D'),
                dateAbbv: "SUN",
                isWeekend: true,
                selected: false,
                hasActivites: false,
                date: moment(this.startDate).day("Sunday").format('MM/DD/YYYY')
            }, {
                dateNumber: moment(this.startDate).day("Monday").format('D'),
                dateAbbv: "MON",
                isWeekend: false,
                selected: false,
                hasActivites: false,
                date: moment(this.startDate).day("Monday").format('MM/DD/YYYY')
            }, {
                dateNumber: moment(this.startDate).day("Tuesday").format('D'),
                dateAbbv: "TUE",
                isWeekend: false,
                selected: false,
                hasActivites: false,
                date: moment(this.startDate).day("Tuesday").format('MM/DD/YYYY')
            }, {
                dateNumber: moment(this.startDate).day("Wednesday").format('D'),
                dateAbbv: "WED",
                isWeekend: false,
                selected: false,
                hasActivites: false,
                date: moment(this.startDate).day("Wednesday").format('MM/DD/YYYY')
            }, {
                dateNumber: moment(this.startDate).day("Thursday").format('D'),
                dateAbbv: "THU",
                isWeekend: false,
                selected: false,
                hasActivites: false,
                date: moment(this.startDate).day("Thursday").format('MM/DD/YYYY')
            }, {
                dateNumber: moment(this.startDate).day("Friday").format('D'),
                dateAbbv: "FRI",
                isWeekend: false,
                selected: false,
                hasActivites: false,
                date: moment(this.startDate).day("Friday").format('MM/DD/YYYY')
            }, {
                dateNumber: moment(this.startDate).day("Saturday").format('D'),
                dateAbbv: "SAT",
                isWeekend: true,
                selected: false,
                hasActivites: false,
                date: moment(this.startDate).day("Saturday").format('MM/DD/YYYY')
            }
        ];

        _.forEach(dates, function (value, key) {
            if (value.date === moment().format('MM/DD/YYYY')) {
                value.selected = true;
            }
        });

        return dates;
    }

    selectActivityDate(day) {
        this.selectedDay = moment(day, 'MM/DD/YYYY');
        this.userActivitiesByDay = _.filter(this.userActivities, function (act) {
            return moment.utc(act['startDate']).local().isSame(moment(day, 'MM/DD/YYYY'), 'day');
        });

        _.forEach(this.weekDates, function (value, key) {
            value['selected'] = false;
            if (value['date'] === day) {
                value['selected'] = true;
            } else {
                value['selected'] = false;
            }
        });

        if (moment(day, 'MM/DD/YYYY').isSame(moment(), 'day')) {
            this.selectedDayIsToday = true;
        } else {
            this.selectedDayIsToday = false;
        }
    }

    gotoToday() {
        this.selectActivityDate(moment().format('MM/DD/YYYY'));
    }

    toggleSearchBar() {
        this.showSearchBar = !this.showSearchBar;
        this.navCtrl.resize();
    }

    gotoPrevWeek() {
        this.startDate = moment(this.startDate).add(-1, 'week');
        this.endDate = moment(this.endDate).add(-1, 'week');
        this.weekDates = this.getdates();
        this.headerText = moment(this.startDate).format('MMMM YYYY');
        this.updateUserActivities(moment(this.startDate).day('Monday'));
    }

    gotoNextWeek() {
        this.startDate = moment(this.startDate).add(1, 'week');
        this.endDate = moment(this.endDate).add(1, 'week');
        this.weekDates = this.getdates();
        this.headerText = moment(this.startDate).format('MMMM YYYY');
        this.updateUserActivities(moment(this.startDate).day('Monday'));
    }

    // clearSearch($event) {
    //     this.searchText = '';
    // }

    addActivity() {
        let addActivityModal = this.modalCtrl.create('Activity', {selectedDate: this.selectedDay.toDate()});
        addActivityModal.onDidDismiss(data => {
            this.updateUserActivities(this.selectedDay);
        });
        addActivityModal.present();
    }

    // cancelSearch($event) {
    //     this.searchText = '';
    //     this.showSearchBar = !this.showSearchBar;
    // }

    deleteActivity(item: ItemSliding, activity: any) {
        this.expandAction(item, 'deleting', 'Activity was deleted.', activity);
    }

    closeActivitySliding(item: ItemSliding, activity: any) {
        item.close();
        this.closeActivity(activity);
    }

    expandAction(item: ItemSliding, action: string, text: string, activity: any) {
        item.setElementClass(action, true);

        this.activitiesService.deleteActivity(activity).subscribe(res => {
            setTimeout(() => {
                const toast = this.toastCtrl.create({
                    message: text
                });
                this.updateUserActivities(this.selectedDay);
                toast.present();
                item.setElementClass(action, false);
                item.close();

                setTimeout(() => toast.dismiss(), 2000);
            }, 1500);
        });
    }

    showEventsCalendar() {
        // Default it to the current month
        let monthStart = moment().startOf('month').format('MMMM YYYY');
        this.events = [];

        this.activitiesService.getUserCalendarAll(monthStart).subscribe(data => {
            for (let i = 0; i < data.length; i++) {
                if (data[i].companyName) {
                    this.events.push({ d: moment.utc(data[i].startDate).local().toDate(), text: '<br>' + data[i].companyName + '<br>' + data[i].subject, activity: data[i]});
                } else {
                    this.events.push({ d: moment.utc(data[i].startDate).local().toDate(), text: '<br>' + data[i].subject, activity: data[i]});
                }
            }
        });
    }

    eventSelected(activity) {
        // This is where the code goes to open the activity or company if an event is clicked on
        console.log(activity);
    }
}
