import {Gallery, ResponseMessage} from '@gw-models/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Injectable} from '@angular/core';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})

export class GalleryService {

  constructor(private http: HttpClient) {
  }

  /** GET: get galleries by page based on keywords */
  public getGalleriesByPage(url): Observable<Gallery[]> {
    return this.http.get<Gallery[]>(url, httpOptions).pipe(
      tap((galleries: Gallery[]) => console.log(JSON.stringify(galleries)))
    );
  }


  /** GET: get total galleries based on keywords */
  public getTotalGalleries(url): Observable<ResponseMessage> {
    return this.http.get<ResponseMessage>(url, httpOptions).pipe(
      tap((responseMessage: ResponseMessage) => console.log(JSON.stringify(responseMessage)))
    );
  }
}
