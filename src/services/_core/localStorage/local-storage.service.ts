import { Injectable } from '@angular/core';
import {Config} from '@gw-config/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  /**
   * remove single exercise's state
   */
  public removeSingleExericseState() {
    localStorage.removeItem(Config.currentExerciseTime);
    localStorage.removeItem(Config.currentSecondExerciseTime);
    localStorage.removeItem(Config.isCountDownSingleExerciseShown);
  }

  /**
   * clear workout's state when component was destroyed
   */
  public removeWorkoutState() {
    localStorage.removeItem(Config.currentDetailedRoundPosition);
    localStorage.removeItem(Config.currentSingleExercisePosition);
    localStorage.removeItem(Config.isCountDownShown);
    localStorage.removeItem(Config.currentWorkoutTime);
    localStorage.removeItem(Config.currentSecondWorkoutTime);
  }
}
