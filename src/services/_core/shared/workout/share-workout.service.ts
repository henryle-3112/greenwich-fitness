import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {Workout} from '@gw-models';

@Injectable({
  providedIn: 'root'
})
export class ShareWorkoutService {
  public currentWorkout: Observable<Workout>;
  private currentWorkoutSubject: BehaviorSubject<Workout>;

  constructor() {
    this.currentWorkoutSubject = new BehaviorSubject<Workout>(null);
    this.currentWorkout = this.currentWorkoutSubject.asObservable();
  }

  public changeWorkout(workout: Workout) {
    this.currentWorkoutSubject.next(workout);
  }
}
