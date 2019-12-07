import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {UserAccount} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareUserAccountService {
  public currentUserAccount: Observable<UserAccount>;
  private currentUserAccountSubject: BehaviorSubject<UserAccount>;

  constructor() {
    this.currentUserAccountSubject = new BehaviorSubject<UserAccount>(null);
    this.currentUserAccount = this.currentUserAccountSubject.asObservable();
  }

  public changeUserAccount(userAccount: UserAccount) {
    this.currentUserAccountSubject.next(userAccount);
  }
}
