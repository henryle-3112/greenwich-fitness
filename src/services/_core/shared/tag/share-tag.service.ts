import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Tag} from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareTagService {

  private currentTagSubject: BehaviorSubject<Tag>;
  public currentTag: Observable<Tag>;

  constructor() {
    this.currentTagSubject = new BehaviorSubject<Tag>(null);
    this.currentTag = this.currentTagSubject.asObservable();
  }

  public changeTag(tag: Tag) {
    this.currentTagSubject.next(tag);
  }

}
