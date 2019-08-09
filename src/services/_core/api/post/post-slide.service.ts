import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostSlide, ProductSlide} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostSlideService {

  constructor(private http: HttpClient) {
  }

  /** GET: get all post's slides */
  public getAllPostSlides(status: number): Observable<ProductSlide[]> {
    return this.http.get<PostSlide[]>(`${Config.api}/${Config.apiGetAllPostSlides}/${status}`, httpOptions).pipe(
      tap((postSlides: PostSlide[]) => console.log(JSON.stringify(postSlides)))
    );
  }
}
