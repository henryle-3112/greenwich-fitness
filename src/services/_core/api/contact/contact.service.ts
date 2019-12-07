import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Contact} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get contact
   */
  public getContact(url: string): Observable<Contact> {
    return this.http.get<Contact>(url, httpOptions);
  }
}
