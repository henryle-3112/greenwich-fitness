import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductRate} from '@gw-models/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductRateService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to add product's rate
   * @param productRate - product's rate that will be added
   */
  public addProductRate(url: string, productRate: ProductRate): Observable<ProductRate> {
    return this.http.post<ProductRate>(url, productRate, httpOptions).pipe(
      tap((insertedProductRate: ProductRate) => console.log(JSON.stringify(insertedProductRate)))
    );
  }

  /**
   *
   * @param url - url that will be used to get product's rate
   */
  public getProductRate(url: string): Observable<ProductRate> {
    return this.http.get<ProductRate>(url, httpOptions).pipe(
      tap((productRate: ProductRate) => console.log(JSON.stringify(productRate)))
    );
  }
}
