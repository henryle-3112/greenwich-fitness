import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostCategory} from '@gw-models';

const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostCategoryService {

  constructor(private http: HttpClient) {
  }

  /**
   *
   * @param url - url that will be used to get post's categories
   */
  public getPostCategories(url: string): Observable<PostCategory[]> {
    return this.http.get<PostCategory[]>(url, httpOptions);
  }
}
