import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Post} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class SharePostService {

  public currentPost: Observable<Post>;
  private currentPostSubject: BehaviorSubject<Post>;

  constructor() {
    this.currentPostSubject = new BehaviorSubject<Post>(null);
    this.currentPost = this.currentPostSubject.asObservable();
  }

  public changePost(post: Post) {
    this.currentPostSubject.next(post);
  }
}
