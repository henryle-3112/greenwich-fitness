import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {ResponseMessage} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to upload files
   * @param formData - formData that contains file
   */
  public uploadFile(url: string, formData: FormData): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(url, formData);
  }

}
