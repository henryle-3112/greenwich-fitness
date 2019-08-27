import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductOrderDetail } from '@gw-models/core';
import { Observable } from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductOrderDetailService {
  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add details of product's order
   * @param productOrderDetails - details of product's order that will be added
   */
  public addProductOrderDetails(url: string, productOrderDetails: ProductOrderDetail[]): Observable<ProductOrderDetail[]> {
    return this.http.post<ProductOrderDetail[]>(url, productOrderDetails, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get details of product's order
   */
  public getProductOrderDetails(url: string): Observable<ProductOrderDetail[]> {
    return this.http.get<ProductOrderDetail[]>(url, httpOptions);
  }
}
