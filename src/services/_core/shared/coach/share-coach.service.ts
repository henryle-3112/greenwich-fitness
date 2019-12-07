import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Coach} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareCoachService {
  public currentCoach: Observable<Coach>;
  // share single coach
  private currentCoachSubject: BehaviorSubject<Coach>;

  constructor() {
    this.currentCoachSubject = new BehaviorSubject<Coach>(null);
    this.currentCoach = this.currentCoachSubject.asObservable();
  }

  /**
   *
   * @param coach - change coach
   */
  public changeCoach(coach: Coach) {
    this.currentCoachSubject.next(coach);
  }
}
