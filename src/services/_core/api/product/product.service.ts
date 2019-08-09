import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Product, ResponseMessage} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {
  }

  /** GET: get all products */
  public getTopProducts(top: number, categoryId: number, status: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${Config.api}/${Config.apiGetProducts}/${top}/${categoryId}/${status}`, httpOptions).pipe(
      tap((products: Product[]) => console.log(JSON.stringify(products)))
    );
  }


  /** GET: get all products by category include pagination */
  public getProductsByCategoryAndByPage(categoryId: number, page: number, status: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${Config.api}/${Config.apiGetProductsPaging}/${categoryId}/${page}/${status}`, httpOptions).pipe(
      tap((products: Product[]) => console.log(JSON.stringify(products)))
    );
  }

  /** GET: get number of products by category */
  public getNumberOfProductsByCategory(categoryId: number, status: number): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(
      `${Config.api}/${Config.apiGetNumberOfProductsByCategory}/${categoryId}/${status}`, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get number of products by searching */
  public getNumberOfSearchingProducts(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** GET: get searching products by page */
  public getSearchingProductsByPage(url): Observable<Product[]> {
    return this.http.get<Product[]>(url, httpOptions).pipe(
      tap((products: Product[]) => console.log(JSON.stringify(products)))
    );
  }

  /** GET: get selected products */
  /* public getSelectedProduct(selectedProductId: number): Observable<Product> {
    return this.http.get<Product>(`${Config.api}/${Config.apiGetSelectdProduct}/${selectedProductId}`, httpOptions).pipe(
      tap((selectedProduct: Product) => console.log(JSON.stringify(selectedProduct)))
    );
  } */
}
