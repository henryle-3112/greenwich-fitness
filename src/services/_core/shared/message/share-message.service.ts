import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SingleExercise } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareMessageService {
  private currentMessageSubject: BehaviorSubject<string>;
  public currentMessage: Observable<string>;

  constructor() {
    this.currentMessageSubject = new BehaviorSubject<string>(null);
    this.currentMessage = this.currentMessageSubject.asObservable();
  }

  public changeMessage(message: string) {
    this.currentMessageSubject.next(message);
  }
}
