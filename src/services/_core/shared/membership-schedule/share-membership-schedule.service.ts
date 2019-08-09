import { Injectable } from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Coach, Training} from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareMembershipScheduleService {
  // share single coach
  private currentMembershipScheduleSubject: BehaviorSubject<Training>;
  public currentMembershipSchedule: Observable<Training>;


  constructor() {
    this.currentMembershipScheduleSubject = new BehaviorSubject<Coach>(null);
    this.currentMembershipSchedule = this.currentMembershipScheduleSubject.asObservable();
  }

  /**
   *
   * @param membershipSchedule - change training
   */
  public changeMembershipSchedule(membershipSchedule: Training) {
    this.currentMembershipScheduleSubject.next(membershipSchedule);
  }
}
