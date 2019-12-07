import {Component, OnInit} from '@angular/core';
import {ShareSingleExerciseService} from '@gw-services/shared';
import {SingleExercise} from '@gw-models';
import {Router} from '@angular/router';

@Component({
  selector: 'app-video-exercise',
  templateUrl: './video-exercise.component.html',
  styleUrls: ['./video-exercise.component.css']
})
export class VideoExerciseComponent implements OnInit {
  selectedSingleExercise: SingleExercise;
  isLoadingSpinnerShown = true;

  /**
   *
   * @param shareSingleExercise - inject share single exercise to get selected single exercise
   * @param router - inject router for routing
   */
  constructor(private shareSingleExercise: ShareSingleExerciseService,
              private router: Router) {
  }

  /**
   * init data
   */
  ngOnInit(): void {
    this.getSelectedSingleExercise();
  }

  /**
   * get selected single exericse
   */
  private getSelectedSingleExercise(): void {
    this.isLoadingSpinnerShown = true;
    this.shareSingleExercise.currentSingleExercise.subscribe(selectedSingleExercise => {
      if (selectedSingleExercise) {
        this.selectedSingleExercise = selectedSingleExercise;
      } else {
        this.router.navigate(['/client/exercise']);
      }
      this.isLoadingSpinnerShown = false;
    });
  }
}
