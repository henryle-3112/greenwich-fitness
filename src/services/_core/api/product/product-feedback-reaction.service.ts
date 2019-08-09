import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ProductFeedback, ProductFeedbackReaction, ResponseMessage, UserProfile} from '@gw-models/core';
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
export class ProductFeedbackReactionService {

  constructor(private http: HttpClient) {
  }

  /** POST: count number of product feedback reactions */
  public countNumberOfProductFeedbackReactions(productFeedback: ProductFeedback, reactionType: number): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(
      `${Config.api}/${Config.apiCountProductFeedbackReaction}/${reactionType}`, productFeedback, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }

  /** POST: get product's feedback reaction by user's profile */
  public getProductFeedbackReactionsByUserProfile(userProfile: UserProfile): Observable<ProductFeedbackReaction[]> {
    return this.http.post<ProductFeedbackReaction[]>(
      `${Config.api}/${Config.apiGetProductFeedbackReactionsByUserProfile}`, userProfile, httpOptions).pipe(
      tap((productFeedbackReactions: ProductFeedbackReaction[]) => console.log(JSON.stringify(productFeedbackReactions)))
    );
  }

  /** POST: add new product's feedback reaction */
  public addNewProductFeedbackReaction(productFeedbackReaction: ProductFeedbackReaction): Observable<ProductFeedbackReaction> {
    return this.http.post<ProductFeedbackReaction>(
      `${Config.api}/${Config.apiAddNewProductFeedbackReaction}`, productFeedbackReaction, httpOptions).pipe(
      tap((insertedProductFeedbackReaction: ProductFeedbackReaction) => console.log(JSON.stringify(insertedProductFeedbackReaction)))
    );
  }
}
