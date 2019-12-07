import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Tag} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareTagService {

  public currentTag: Observable<Tag>;
  private currentTagSubject: BehaviorSubject<Tag>;

  constructor() {
    this.currentTagSubject = new BehaviorSubject<Tag>(null);
    this.currentTag = this.currentTagSubject.asObservable();
  }

  public changeTag(tag: Tag) {
    this.currentTagSubject.next(tag);
  }

}
