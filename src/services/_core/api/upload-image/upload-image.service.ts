import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Injectable} from '@angular/core';
import {Config} from '@gw-config/core';
import {ResponseMessage} from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class UploadImageService {

  constructor(private http: HttpClient) {
  }

  /** POST: upload image to server */
  public uploadImage(formData: FormData, rootLocation: string): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${Config.api}/${Config.apiUploadImage}/${rootLocation}`, formData).pipe(
      tap((responseMessage: ResponseMessage) => console.log(responseMessage.message))
    );
  }

}
