import {Injectable} from '@angular/core';
import {Config} from '@gw-config/core';
import {UserProfile} from '@gw-models/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
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
   * @param sum - total payment that user have to pay
   */
  public makePayment(sum) {
    return this.http.post<Response>(`${Config.api}/${Config.apiMakePayment}?sum=${sum}`, {}, httpOptions).pipe(
      tap((response: Response) => console.log(response))
    );
  }

  /**
   *
   * @param paymentId - payment's id
   * @param payerId - payer's id
   */
  public completePayment(paymentId: string, payerId: string) {
    return this.http.post<Response>(
      `${Config.api}/${Config.apiCompletePayment}?paymentId=${paymentId}&payerId=${payerId}`, httpOptions).pipe(
      tap((response: Response) => console.log(response))
    );
  }
}
