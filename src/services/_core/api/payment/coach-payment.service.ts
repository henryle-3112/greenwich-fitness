import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';
import {CoachPayment, ResponseMessage} from '@gw-models/core';
import {Observable} from 'rxjs';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class CoachPaymentService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param coachPayment - coach payment
   */
  public addCoachPayment(coachPayment: CoachPayment) {
    return this.http.post<CoachPayment>(`${Config.api}/${Config.apiAddCoachPayment}`, coachPayment, httpOptions).pipe(
      tap((insertedProductPayment: CoachPayment) => console.log(insertedProductPayment))
    );
  }

  /** GET: get get coach payments by coach id, month, year and page */
  public getCoachPaymentsByCoachIdByMonthByYearByPage(
    coachId: number,
    month: number,
    year: number,
    page: number
  ): Observable<CoachPayment[]> {
    return this.http.get<CoachPayment[]>(
      `${Config.api}/${Config.apiGetCoachPaymentsByCoachIdByMonthByYearByPage}/${coachId}/${month}/${year}/${page}`,
      httpOptions).pipe(
      tap((coachPayments: CoachPayment[]) => console.log(JSON.stringify(coachPayments)))
    );
  }

  /** GET: get number of coach payments by coach id, month, year and page */
  public countCoachPaymentsByCoachIdAndByMonthAndByYear(
    coachId: number,
    month: number,
    year: number
  ): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiCountCoachPaymentsByCoachIdAndByMonthAndByYear}/${coachId}/${month}/${year}`,
      httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get total payment by coach id and by month and by year */
  public getTotalPaymentByCoachIdAndByMonthAndByYear(
    coachId: number,
    month: number,
    year: number
  ): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiGetTotalPaymentByCoachIdAndByMonthAndByYear}/${coachId}/${month}/${year}`, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get coach payments by user profile id, month, year and page */
  public getCoachPaymentsByUserProfileIdByMonthByYearByPage(
    userProfileId: number,
    month: number,
    year: number,
    page: number
  ): Observable<CoachPayment[]> {
    return this.http.get<CoachPayment[]>(
      `${Config.api}/${Config.apiGetCoachPaymentsByUserProfileIdByMonthByYearByPage}/${userProfileId}/${month}/${year}/${page}`,
      httpOptions).pipe(
      tap((coachPayments: CoachPayment[]) => console.log(JSON.stringify(coachPayments)))
    );
  }

  /** GET: get number of coach payments by user profile id, month, year and page */
  public countCoachPaymentsByUserProfileIdAndByMonthAndByYear(
    userProfileId: number,
    month: number,
    year: number
  ): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiCountCoachPaymentsByUserProfileIdAndByMonthAndByYear}/${userProfileId}/${month}/${year}`,
      httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get total payment by coach id and by month and by year */
  public getTotalPaymentByUserProfileIdAndByMonthAndByYear(
    userProfileId: number,
    month: number,
    year: number
  ): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiGetTotalPaymentByUserProfileIdAndByMonthAndByYear}/${userProfileId}/${month}/${year}`,
      httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
