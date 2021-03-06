import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductFeedbackReaction} from '@gw-models';
import {Observable} from 'rxjs';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get reactions of product's feedback
   */
  public getProductFeedbackReactions(url: string): Observable<ProductFeedbackReaction[]> {
    return this.http.get<ProductFeedbackReaction[]>(url, httpOptions);
  }

  /**
   *
   * @param url - url that will be used to add reaction of product's feedback
   * @param productFeedbackReaction - reaction of product's feedback that will be added
   */
  public addNewProductFeedbackReaction(url: string, productFeedbackReaction: ProductFeedbackReaction): Observable<ProductFeedbackReaction> {
    return this.http.post<ProductFeedbackReaction>(url, productFeedbackReaction, httpOptions);
  }
}
