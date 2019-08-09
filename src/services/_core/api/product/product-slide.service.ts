import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ProductSlide} from '@gw-models/core';
import {tap} from 'rxjs/operators';
import {Config} from '@gw-config/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class ProductSlideService {

  constructor(private http: HttpClient) {
  }

  /** GET: get all product's slides */
  public getAllProductSlides(status: number): Observable<ProductSlide[]> {
    return this.http.get<ProductSlide[]>(`${Config.api}/${Config.apiGetAllProductSlide}/${status}`, httpOptions).pipe(
      tap((productSlides: ProductSlide[]) => console.log(JSON.stringify(productSlides)))
    );
  }
}
