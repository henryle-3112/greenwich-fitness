import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductPayment} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductPaymentService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param productPayment - product's payment
   */
  public addProductPayment(productPayment: ProductPayment) {
    return this.http.post<ProductPayment>(`${Config.api}/${Config.apiAddProductPayment}`, productPayment, httpOptions).pipe(
      tap((insertedProductPayment: ProductPayment) => console.log(insertedProductPayment))
    );
  }
}
