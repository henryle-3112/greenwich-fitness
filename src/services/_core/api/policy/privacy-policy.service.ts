import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PrivacyPolicy} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';


// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PrivacyPolicyService {

  constructor(private http: HttpClient) {
  }

  /** GET: get privacy policy by id */
  public getPrivacyPolicyById(id: number): Observable<PrivacyPolicy> {
    return this.http.get<PrivacyPolicy>(`${Config.api}/${Config.apiGetPrivacyPolicy}/${id}`, httpOptions).pipe(
      tap((privacyPolicy: PrivacyPolicy) => console.log(JSON.stringify(privacyPolicy)))
    );
  }
}
