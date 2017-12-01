import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';
import * as moment from 'moment';


@Injectable()
export class ActivitiesService {

    private subject = new BehaviorSubject<any[]>([]);
    activities$: Observable<any> = this.subject.asObservable();

    constructor( private restangular: Restangular) {

    }

    getUsersActivities(startDate, endDate): Observable<any[]>{
        return this.restangular
            .all('UserActivity/GetUserActivities?startDate=' + moment(startDate).format('MM/DD/YYYY') + '&endDate=' + moment(endDate).format('MM/DD/YYYY'))
            .getList()
            .publishLast().refCount();
    }

    closeUserActivity(id, note){
        let postData = {
            id: id,
            closeActivityStatusId: 17,
            description: note.comments
        };
        return this.restangular.one('UserActivity').customPOST(undefined,'CloseActivity', postData).toPromise();
    }

    openUserActivity(activity){
        return this.restangular.one('UserActivity/ReopenOOOActivityByID').put({id:  activity.id}).toPromise();
    }

    testGetUsersActivities(startDate, endDate): Observable<any[]>{
        return this.restangular
            .all('UserActivity/GetUserActivities?startDate=' + moment(startDate).format('MM/DD/YYYY') + '&endDate=' + moment(endDate).format('MM/DD/YYYY'))
            .getList()
            .do(data => this.subject.next(data))
            .publishLast().refCount();
    }

    postActivity(activity){
        return this.restangular.all('UserActivity/AddMeetingActivity').post(activity);
    }

    addMeetingActivity(activity){
        return this.restangular.all('UserActivity/AddMeetingActivity').post(activity);
    }

    addTaskActivity(activity){
        return this.restangular.all('UserActivity/AddUserTaskActivity').post(activity);
    }

    getActivity(activity){
        return this.restangular.one('UserActivity/GetActivity', activity.id).get();
    }

    deleteActivity(activity){
        return this.restangular.one('UserActivity/DeleteActivity?id=' + activity.id + '&pushToExchange=true' + '&userId=' + activity.userId).customDELETE('');
    }

    addSuspectActivity(suspectID, activityID){
        let postData = {
            suspectId: suspectID,
            activityId: activityID
        };

        return this.restangular.one('Contact').customPOST(undefined, 'AddSuspectActivity', postData);
    }

    updateActivity(activity){
        return this.restangular.all('UserActivity/UpdateActivity').customPOST(activity);
    }

    getUserCalendarAll(month) {
        return this.restangular.all('UserActivity/GetUserCalendarAll').customGET('', { monthDate: month});
    }

}
