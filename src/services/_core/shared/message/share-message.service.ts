import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShareMessageService {
  public currentMessage: Observable<string>;
  private currentMessageSubject: BehaviorSubject<string>;

  constructor() {
    this.currentMessageSubject = new BehaviorSubject<string>(null);
    this.currentMessage = this.currentMessageSubject.asObservable();
  }

  public changeMessage(message: string) {
    this.currentMessageSubject.next(message);
  }
}
