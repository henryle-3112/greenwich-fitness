import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Coach, Training} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareMembershipScheduleService {
  public currentMembershipSchedule: Observable<Training>;
  // share single coach
  private currentMembershipScheduleSubject: BehaviorSubject<Training>;

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
