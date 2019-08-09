import {Component, OnInit} from '@angular/core';
import {ShareSingleExerciseService} from '../../../../../../services/_core/shared/single-exercise/share-single-exercise.service';
import {SingleExercise} from '@gw-models/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-video-exercise',
  templateUrl: './video-exercise.component.html',
  styleUrls: ['./video-exercise.component.css']
})
export class VideoExerciseComponent implements OnInit {

  // selected single exercise - get from share single exercise
  selectedSingleExercise: SingleExercise;
  // show loading component
  loading = true;

  /**
   *
   * @param shareSingleExercise - inject share single exercise to get selected single exercise
   * @param route - inject router for routing
   */
  constructor(private shareSingleExercise: ShareSingleExerciseService,
              private route: Router) {
  }

  /**
   * init data
   */
  ngOnInit() {
    // show loading component
    this.loading = true;
    // get selected single exercise
    this.getSelectedSingleExercise();
  }

  /**
   * check selected single exercise exsited or not, if not, redirect to single exercise component to let user-account choose again
   */
  private checkSelectedSingleExerciseExistedOrNot() {
    if (this.selectedSingleExercise == null) {
      this.route.navigate(['/client/exercise']);
    }
  }

  /**
   * get selected single exericse
   */
  private getSelectedSingleExercise() {
    this.shareSingleExercise.currentSingleExercise.subscribe(selectedSingleExercise => {
      this.selectedSingleExercise = selectedSingleExercise;
      this.loading = false;
      // check selected single exercise existed or not
      // if selected single exercise not existed - redirect to list of single exercises
      this.checkSelectedSingleExerciseExistedOrNot();
    });
  }
}
