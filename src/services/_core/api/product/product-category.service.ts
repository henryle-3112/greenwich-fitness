import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductCategory} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';


// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductCategoryService {
  constructor(private http: HttpClient) {
  }

  /** GET: get all product's categories */
  public getAllProductCategories(status: number): Observable<ProductCategory[]> {
    return this.http.get<ProductCategory[]>(`${Config.api}/${Config.apiGetAllProductCategory}/${status}`, httpOptions).pipe(
      tap((productCategories: ProductCategory[]) => console.log(JSON.stringify(productCategories)))
    );
  }
}
