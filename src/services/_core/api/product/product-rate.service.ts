import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductRate} from '@gw-models';
import {Observable} from 'rxjs';

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
    return this.http.post<ProductRate>(url, productRate, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to get product's rate
   */
  public getProductRate(url: string): Observable<ProductRate> {
    return this.http.get<ProductRate>(url, httpOptions);
  }
}
