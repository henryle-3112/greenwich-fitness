import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Training} from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareTrainingService {

  private currentTrainingSubject: BehaviorSubject<Training>;
  public currentTraining: Observable<Training>;

  constructor() {
    this.currentTrainingSubject = new BehaviorSubject<Training>(null);
    this.currentTraining = this.currentTrainingSubject.asObservable();
  }

  public changeTraining(training: Training) {
    this.currentTrainingSubject.next(training);
  }
}
