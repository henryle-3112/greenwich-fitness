import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductFeedback} from '@gw-models/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductFeedbackService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get product's feedbacks
   */
  public getProductFeedbacks(url: string): Observable<ProductFeedback[]> {
    return this.http.get<ProductFeedback[]>(url, httpOptions).pipe(
      tap((productFeedbacks: ProductFeedback[]) => console.log(JSON.stringify(productFeedbacks)))
    );
  }

  /**
   *
   * @param url - url that will be used to add product's feedback
   * @param productFeedback - product's feedback that will be added
   */
  public addProductFeedback(url: string, productFeedback: ProductFeedback): Observable<ProductFeedback> {
    return this.http.post<ProductFeedback>(url, productFeedback, httpOptions).pipe(
      tap((insertedProductFeedback: ProductFeedback) => console.log(JSON.stringify(insertedProductFeedback)))
    );
  }

  /**
   *
   * @param url - url that will be used to update product's feedback
   * @param productFeedback - product's feedback that will be updated
   */
  public updateProductFeedback(url: string, productFeedback: ProductFeedback): Observable<ProductFeedback> {
    return this.http.put<ProductFeedback>(url, productFeedback, httpOptions).pipe(
      tap((updatedProductFeedback: ProductFeedback) => console.log(JSON.stringify(updatedProductFeedback)))
    );
  }
}
