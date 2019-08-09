import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {PostCategory} from '@gw-models/core';
import {Config} from '@gw-config/core';
import {tap} from 'rxjs/operators';

// httpOptions to change content-type to application/json
const httpOptions = {
  headers: new HttpHeaders({'Content-Type': 'application/json'})
};

@Injectable({
  providedIn: 'root'
})
export class PostCategoryService {

  constructor(private http: HttpClient) {
  }

  /** GET: get all post's categories */
  public getAllPostCategories(status: number): Observable<PostCategory[]> {
    return this.http.get<PostCategory[]>(`${Config.api}/${Config.apiGetAllPostCategories}/${status}`, httpOptions).pipe(
      tap((postCategories: PostCategory[]) => console.log(JSON.stringify(postCategories)))
    );
  }
}
