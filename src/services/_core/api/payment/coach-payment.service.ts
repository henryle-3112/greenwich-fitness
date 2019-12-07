import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {CoachPayment} from '@gw-models';
import {Observable} from 'rxjs';

const httpFullOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'}),
  observe: 'response' as 'body'
};

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
   * @param url - that will be used to add coach payment
   * @param coachPayment - coach payment that will be added
   */
  public addCoachPayment(url: string, coachPayment: CoachPayment) {
    return this.http.post<CoachPayment>(url, coachPayment, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get coach payments
   */
  public getCoachPayments(url: string): Observable<HttpResponse<CoachPayment[]>> {
    return this.http.get<HttpResponse<CoachPayment[]>>(url, httpFullOptions);
  }
}
