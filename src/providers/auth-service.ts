import { LoginStatus } from './../models/login-status';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Restangular } from 'ngx-restangular';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

const DEFAULT_LOGIN_STATUS: LoginStatus = {isLoggedIn: false, loginMessage: null};
@Injectable()
export class AuthService {
   private userLoginStatusSubject = new BehaviorSubject<LoginStatus>(DEFAULT_LOGIN_STATUS);
   userLoginStatus$: Observable<LoginStatus> = this.userLoginStatusSubject.asObservable();

  constructor( private restangular: Restangular) {
  }
  
  login(credentials) {
    if (credentials.username === null || credentials.password === null) {
      return Observable.throw("Please insert credentials");
    } else {
      return this.restangular
      .all('Account/AmpLogin')
      .post(credentials, undefined, undefined).map(res => {
        this.userLoginStatusSubject.next(res);
        return res;
      });
    }
  }

  logout() {
    return this.restangular.one('Account/LogOut').get().map(res => {
      console.log(res)
    });
  }

  load(){
    return new Promise(resolve => {
      this.restangular.one('Account/isAuthenticated').get().subscribe(res => {
        this.userLoginStatusSubject.next(res);
        resolve();
      })
    })
  }

  getUserStatus(){
    return this.userLoginStatusSubject.value;
  }

}