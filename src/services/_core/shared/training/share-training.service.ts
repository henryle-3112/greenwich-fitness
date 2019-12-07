import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Training} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareTrainingService {

  public currentTraining: Observable<Training>;
  private currentTrainingSubject: BehaviorSubject<Training>;

  constructor() {
    this.currentTrainingSubject = new BehaviorSubject<Training>(null);
    this.currentTraining = this.currentTrainingSubject.asObservable();
  }

  public changeTraining(training: Training) {
    this.currentTrainingSubject.next(training);
  }
}
