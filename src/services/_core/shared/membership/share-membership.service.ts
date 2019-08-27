import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Coach, Membership } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareMembershipService {
  // share single membership
  private currentMembershipSubject: BehaviorSubject<Coach>;
  public currentMembership: Observable<Coach>;


  constructor() {
    this.currentMembershipSubject = new BehaviorSubject<Coach>(null);
    this.currentMembership = this.currentMembershipSubject.asObservable();
  }

  /**
   *
   * @param membership - change membership
   */
  public changeMembership(membership: Membership) {
    this.currentMembershipSubject.next(membership);
  }
}
