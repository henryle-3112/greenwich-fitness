import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PrivacyPolicy} from '@gw-models/core';


const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PrivacyPolicyService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get privacy policy
   */
  public getPrivacyPolicy(url: string): Observable<PrivacyPolicy> {
    return this.http.get<PrivacyPolicy>(url, httpOptions);
  }
}
