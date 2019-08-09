import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductRate} from '@gw-models/core';
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
export class ProductRateService {

  constructor(private http: HttpClient) {
  }

  /** POST: add new product's rate */
  public addProductRate(productRate: ProductRate): Observable<ProductRate> {
    return this.http.post<ProductRate>(`${Config.api}/${Config.apiAddProductRate}`, productRate, httpOptions).pipe(
      tap((insertedProductRate: ProductRate) => console.log(JSON.stringify(insertedProductRate)))
    );
  }

  /** GET: get product's rate by user's id and product's id */
  public getProductRateByUserIdAndProductId(userId: number, productId: number): Observable<ProductRate> {
    return this.http.get<ProductRate>(
      `${Config.api}/${Config.apiGetProductRateByUserIdAndProductId}/${userId}/${productId}`, httpOptions).pipe(
      tap((productRate: ProductRate) => console.log(JSON.stringify(productRate)))
    );
  }
}
