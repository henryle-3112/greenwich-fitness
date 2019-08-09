import {Injectable} from '@angular/core';
import {Coach, CoachPayment, Membership, ResponseMessage} from '@gw-models/core';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class MembershipService {

  constructor(private http: HttpClient) {
  }

  /** POST: get number of memberships by coach */
  public countNumberOfMembershipsByCoach(coach: Coach, status: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfMemberships}/${status}`, coach, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get memberships by page based on keywords */
  public getMembershipsByPage(url): Observable<Membership[]> {
    return this.http.get<Coach[]>(url, httpOptions).pipe(
      tap((memberships: Membership[]) => console.log(JSON.stringify(memberships)))
    );
  }

  /** GET: get total memberships based on keywords */
  public getTotalMemberships(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: check user has pay for selected coach or not */
  public checkUserHasPayForSelectedCoachOrNot(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  public getMembershipByCoachAndByUserProfile(coachId: number, userProfileId: number): Observable<Membership> {
    return this.http.get<Membership>(`${Config.api}/${Config.apiGetMembershipByCoachAndByUserProfile}/${coachId}/${userProfileId}`
      , httpOptions).pipe(
      tap((selectedMembership: Membership) => console.log(JSON.stringify(selectedMembership)))
    );
  }

  /**
   *
   * @param membership - membership
   */
  public addMembership(membership: Membership) {
    return this.http.post<Membership>(`${Config.api}/${Config.apiAddMembership}`, membership, httpOptions).pipe(
      tap((insertedMembership: Membership) => console.log(insertedMembership))
    );
  }

  public updateMembership(membership: Membership) {
    return this.http.post<Membership>(`${Config.api}/${Config.apiUpdateMembership}`, membership, httpOptions).pipe(
      tap((updatedMembership: Membership) => console.log(updatedMembership))
    );
  }
}
