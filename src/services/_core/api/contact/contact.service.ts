import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Contact} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};


@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http: HttpClient) {
  }

  /** GET: get contact by id */
  public getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${Config.api}/${Config.apiGetContactContent}/${id}`, httpOptions).pipe(
      tap((contact: Contact) => console.log(JSON.stringify(contact)))
    );
  }
}
