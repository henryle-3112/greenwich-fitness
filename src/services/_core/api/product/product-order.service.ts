import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ProductOrder } from '@gw-models/core';
import { Observable } from 'rxjs';

const httpFullOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  observe: 'response' as 'body'
};

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class ProductOrderService {
  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add product's order
   * @param productOrder - product's order that will be added
   */
  public addProductOrder(url: string, productOrder: ProductOrder): Observable<ProductOrder> {
    return this.http.post<ProductOrder>(url, productOrder, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get product's orders
   */
  public getProductOrders(url: string): Observable<HttpResponse<ProductOrder[]>> {
    return this.http.get<HttpResponse<ProductOrder[]>>(url, httpFullOptions);
  }
}
