import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostSlide, ProductSlide} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostSlideService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get post's slides
   */
  public getPostSlides(url: string): Observable<ProductSlide[]> {
    return this.http.get<PostSlide[]>(url, httpOptions);
  }
}
