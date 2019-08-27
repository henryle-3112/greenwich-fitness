import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SingleExercise, UserAccount } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareUserAccountService {
  private currentUserAccountSubject: BehaviorSubject<UserAccount>;
  public currentUserAccount: Observable<UserAccount>;

  constructor() {
    this.currentUserAccountSubject = new BehaviorSubject<UserAccount>(null);
    this.currentUserAccount = this.currentUserAccountSubject.asObservable();
  }

  public changeUserAccount(userAccount: UserAccount) {
    this.currentUserAccountSubject.next(userAccount);
  }
}
