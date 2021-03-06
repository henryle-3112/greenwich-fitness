import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductFeedback} from '@gw-models';
import {Observable} from 'rxjs';


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
    return this.http.get<ProductFeedback[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add product's feedback
   * @param productFeedback - product's feedback that will be added
   */
  public addProductFeedback(url: string, productFeedback: ProductFeedback): Observable<ProductFeedback> {
    return this.http.post<ProductFeedback>(url, productFeedback, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to update product's feedback
   * @param productFeedback - product's feedback that will be updated
   */
  public updateProductFeedback(url: string, productFeedback: ProductFeedback): Observable<ProductFeedback> {
    return this.http.put<ProductFeedback>(url, productFeedback, httpOptions);
  }
}
