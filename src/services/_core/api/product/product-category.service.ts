import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductCategory} from '@gw-models';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get product's categories
   */
  public getProductCategories(url: string): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(url, httpOptions);
  }
}
