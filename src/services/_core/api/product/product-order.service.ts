import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductOrder, ResponseMessage} from '@gw-models/core';
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
export class ProductOrderService {
  constructor(private http: HttpClient) {
  }

  /** POST: add new product's order */
  public addProductOrder(productOrder: ProductOrder): Observable<ProductOrder> {
    return this.http.post<ProductOrder>(`${Config.api}/${Config.apiAddProductOrder}`, productOrder, httpOptions).pipe(
      tap((insertedProductOrder: ProductOrder) => console.log(JSON.stringify(insertedProductOrder)))
    );
  }

  /** GET: get product orders by user profile id and by product order status and by page */
  public getProductOrdersByUserProfileIdAndProductOrderStatusAndByPage(
    userProfileId: number, productOrderStatus: number, startIndex: number): Observable<ProductOrder[]> {
    return this.http.get<ProductOrder[]>(
      `${Config.api}/${Config.apiGetProductOrdersByUserProfileIdAndProductOrderStatusAndByPage}/${userProfileId}/${productOrderStatus}/${startIndex}`
      , httpOptions).pipe(
      tap((productOrders: ProductOrder[]) => console.log(JSON.stringify(productOrders)))
    );
  }

  /** GET: get number of product orders by user profile id and by product order status */
  public getNumberOfProductOrdersByUserProfileIdAndProductOrderStatus(
    userProfileId: number, productOrderStatus: number): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiCountNumberOfProductOrdersByUserProfileIdAndProductOrderStatus}/${userProfileId}/${productOrderStatus}`,
      httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
