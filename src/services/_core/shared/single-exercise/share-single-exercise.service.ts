import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {SingleExercise} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareSingleExerciseService {
  public currentSingleExercise: Observable<SingleExercise>;
  private currentSingleExerciseSubject: BehaviorSubject<SingleExercise>;

  constructor() {
    this.currentSingleExerciseSubject = new BehaviorSubject<SingleExercise>(null);
    this.currentSingleExercise = this.currentSingleExerciseSubject.asObservable();
  }

  public changeSingleExercise(singleExercise: SingleExercise) {
    this.currentSingleExerciseSubject.next(singleExercise);
  }
}
