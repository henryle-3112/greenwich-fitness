import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Product, ProductFeedback, ResponseMessage, UserAccount} from '@gw-models/core';
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
export class ProductFeedbackService {

  constructor(private http: HttpClient) {
  }

  /** POST: get product's feedbacks by product */
  public getProductFeedbacksByProduct(product: Product, status: number): Observable<ProductFeedback[]> {
    return this.http.post<ProductFeedback[]>(`${Config.api}/${Config.apiGetProductFeedback}/${status}`, product, httpOptions).pipe(
      tap((productFeedbacks: ProductFeedback[]) => console.log(JSON.stringify(productFeedbacks)))
    );
  }

  /** POST: add new product's feedback */
  public addProductFeedback(productFeedback: ProductFeedback): Observable<ProductFeedback> {
    return this.http.post<ProductFeedback>(`${Config.api}/${Config.apiAddProductFeedback}`, productFeedback, httpOptions).pipe(
      tap((insertedProductFeedback: ProductFeedback) => console.log(JSON.stringify(insertedProductFeedback)))
    );
  }

  /** GET: get product's feedback by user's id and product's id */
  /* public getProductFeedbackByUserIdAndProductId(userId: number, productId: number): Observable<ProductFeedback> {
    return this.http.get<ProductFeedback>(
      `${Config.api}/${Config.apiGetProductFeedbackByUserIdAndProductId}/${userId}/${productId}`, httpOptions).pipe(
      tap((productFeedback: ProductFeedback) => console.log(JSON.stringify(productFeedback)))
    );
  } */
}
