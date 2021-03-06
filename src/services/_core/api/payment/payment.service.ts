import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to make payment
   */
  public makePayment(url: string) {
    return this.http.post<Response>(url, {}, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to complete payment
   */
  public completePayment(url: string) {
    return this.http.post<Response>(url, httpOptions);
  }
}
