import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Post } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class SharePostService {

  private currentPostSubject: BehaviorSubject<Post>;
  public currentPost: Observable<Post>;

  constructor() {
    this.currentPostSubject = new BehaviorSubject<Post>(null);
    this.currentPost = this.currentPostSubject.asObservable();
  }

  public changePost(post: Post) {
    this.currentPostSubject.next(post);
  }
}
