import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductSlide} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductSlideService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get product's slides
   */
  public getProductSlides(url: string): Observable<ProductSlide[]> {
    return this.http.get<ProductSlide[]>(url, httpOptions);
  }
}
