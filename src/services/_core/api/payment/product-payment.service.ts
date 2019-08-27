import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductPayment } from '@gw-models/core';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductPaymentService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add product payment
   * @param productPayment - product payment that will be added
   */
  public addProductPayment(url: string, productPayment: ProductPayment) {
    return this.http.post<ProductPayment>(url, productPayment, httpOptions);
  }
}
