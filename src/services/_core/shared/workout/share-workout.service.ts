import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Workout } from '@gw-models/core';

@Injectable({
  providedIn: 'root'
})
export class ShareWorkoutService {
  private currentWorkoutSubject: BehaviorSubject<Workout>;
  public currentWorkout: Observable<Workout>;

  constructor() {
    this.currentWorkoutSubject = new BehaviorSubject<Workout>(null);
    this.currentWorkout = this.currentWorkoutSubject.asObservable();
  }

  public changeWorkout(workout: Workout) {
    this.currentWorkoutSubject.next(workout);
  }
}
