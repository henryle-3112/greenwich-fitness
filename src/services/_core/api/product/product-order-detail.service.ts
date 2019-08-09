import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductOrder, ProductOrderDetail} from '@gw-models/core';
import {Observable} from 'rxjs';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductOrderDetailService {
  constructor(private http: HttpClient) {
  }

  /** POST: add new product's order's detail */
  public addProductOrderDetail(productOrderDetails: ProductOrderDetail[]): Observable<ProductOrderDetail[]> {
    return this.http.post<ProductOrderDetail[]>(`${Config.api}/${Config.apiAddProductOrderDetail}`, productOrderDetails, httpOptions).pipe(
      tap((insertedProductOrderDetails: ProductOrderDetail[]) => console.log(JSON.stringify(insertedProductOrderDetails)))
    );
  }

  /** POST: get list of product order details by product order */
  public getProductOrderDetailsByProductOrder(productOrder: ProductOrder): Observable<ProductOrderDetail[]> {
    return this.http.post<ProductOrderDetail[]>(
      `${Config.api}/${Config.apiGetProductOrderDetailsByProductOrder}`, productOrder, httpOptions).pipe(
      tap((productOrderDetails: ProductOrderDetail[]) => console.log(JSON.stringify(productOrderDetails)))
    );
  }
}
